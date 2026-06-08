const groupModel = require("../models/group.model")
const userModel = require("../models/user.model")

const getAllGroups = async (req, res) => {
    try {
        const user = req.user;
        const userDoc = await userModel.findOne({ upi: user.upi });
        if (!userDoc) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }

        const groups = userDoc.groups || [];
        const groupList = [];

        for (let groupId of groups) {
            const groupData = await groupModel.findById(groupId);
            if (!groupData) continue; // Skip if group is deleted

            let receiveableamount = 0;
            let payableamount = 0;

            for (let member of groupData.members) {
                if (member.upi === user.upi) {
                    for (let bal of member.balances) {
                        if (bal.amount >= 0) {
                            receiveableamount += bal.amount;
                        } else {
                            payableamount += bal.amount;
                        }
                    }
                    break;
                }
            }

            groupList.push({
                name: groupData.name,
                createdBy: groupData.createdBy,
                receiveableamount: receiveableamount,
                payableamount: -payableamount,
                totalMembers: groupData.members.length,
                groupCode: groupData.code
            });
        }

        return res.json({
            groups: groupList,
            status: true
        });
    } catch (error) {
        return res.json({
            status: false,
            message: error.message
        });
    }
}

const createGroup = async (req, res) => {
    try {
        const user = req.user;
        let { name, members } = req.body;

        if (!Array.isArray(members)) {
            members = [];
        }

        // Generate unique 6-digit random code
        let code = Math.floor(100000 + Math.random() * 900000).toString();
        while (await groupModel.findOne({ code })) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
        }

        const seenUpis = new Set();
        seenUpis.add(user.upi);

        const mem = [];

        // Add creator to the members array
        mem.push({
            upi: user.upi,
            name: user.name,
            balances: [],
            total: 0
        });

        for (let member of members) {
            if (!member || !member.upi) continue;

            // Skip duplicates (including the creator if they were passed in members)
            if (seenUpis.has(member.upi)) {
                continue;
            }
            seenUpis.add(member.upi);

            const memData = await userModel.findOne({ upi: member.upi });
            if (!memData) {
                return res.json({
                    status: false,
                    message: `Member with UPI ${member.upi} not found`
                });
            }
            mem.push({
                upi: memData.upi,
                name: member?.name?.trim() || memData.name,
                balances: [],
                total: 0
            });
        }

        // Initialize balances between all members
        for (let i = 0; i < mem.length; i++) {
            for (let j = 0; j < mem.length; j++) {
                if (i !== j) {
                    mem[i].balances.push({
                        upi: mem[j].upi,
                        name: mem[j].name,
                        amount: 0
                    });
                }
            }
        }

        const group = new groupModel({
            name: name,
            createdBy: user.name,
            code: code,
            members: mem
        });

        const response = await group.save();
        if (!response) {
            return res.json({
                status: false,
                message: "Group not created"
            });
        }

        // Update groups list for all unique members (including creator)
        for (let upi of seenUpis) {
            await userModel.findOneAndUpdate(
                { upi: upi },
                { $addToSet: { groups: response._id } }
            );
        }

        return res.json({
            status: true,
            message: "Group created successfully",
            code: response.code
        });

    } catch (error) {
        return res.json({
            status: false,
            message: error.message
        });
    }
}

const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { newMember } = req.body;

        // Find group by its code instead of ObjectId findById
        const groupData = await groupModel.findOne({ code: groupId });
        if (!groupData) {
            return res.json({
                status: false,
                message: "Group not found"
            });
        }

        if (!newMember || !newMember.upi) {
            return res.json({
                status: false,
                message: "No new members to add"
            });
        }

        // Verify that the new member is registered
        const memData = await userModel.findOne({ upi: newMember.upi });
        if (!memData) {
            return res.json({
                status: false,
                message: "Member not found"
            });
        }

        // Check if the user is already in the group
        const isAlreadyMember = groupData.members.some(member => member.upi === memData.upi);
        if (isAlreadyMember) {
            return res.json({
                status: false,
                message: "User already in group"
            });
        }

        // Pre-populate balances for the new member
        const newUserBalances = groupData.members.map(m => ({
            upi: m.upi,
            name: m.name,
            amount: 0
        }));


        const newMemberObj = {
            upi: memData.upi,
            name: newMember.name.trim() || memData.name,
            balances: newUserBalances,
            total: 0
        };

        // Update all existing members' balance arrays to track balances with the new member
        for (let m of groupData.members) {
            m.balances.push({
                upi: memData.upi,
                name: memData.name,
                amount: 0
            });
        }

        // Push new member to group list
        groupData.members.push(newMemberObj);
        await groupData.save();

        // Add the group's _id to the added user's groups reference list
        await userModel.findOneAndUpdate({ upi: memData.upi }, { $push: { groups: groupData._id } });

        return res.json({
            status: true,
            message: "Added Member",
            members: groupData.members
        });
    } catch (error) {
        return res.json({
            status: false,
            message: error.message
        });
    }
}

const getGroupInfo = async (req, res) => {
    try {
        const { groupId } = req.params;
        const groupData = await groupModel.findOne({ code: groupId });
        if (!groupData || !groupData.members.some(m => m.upi === req.user.upi)) {
            return res.json({
                status: false,
                message: "Group not found"
            });
        }
        return res.json({
            status: true,
            group: groupData
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: error.message
        });
    }
}

const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params; // This parameter holds the group code
        const user = req.user; // Securely get the authenticated user from the auth middleware

        // Find group by its code instead of ObjectId findById
        const groupData = await groupModel.findOne({ code: groupId });
        if (!groupData) {
            return res.json({
                status: false,
                message: "Group not found"
            });
        }

        // Check if the user is already in the group
        const isAlreadyMember = groupData.members.some(member => member.upi === user.upi);
        if (isAlreadyMember) {
            return res.json({
                status: false,
                message: "User already in group"
            });
        }

        // Pre-populate balances for the joining user (facing all existing group members)
        const newUserBalances = groupData.members.map(m => ({
            upi: m.upi,
            name: m.name,
            amount: 0
        }));

        const newMemberObj = {
            upi: user.upi,
            name: user.name,
            balances: newUserBalances,
            total: 0
        };

        // Update all existing members' balance arrays to track balances with the joining user
        for (let m of groupData.members) {
            m.balances.push({
                upi: user.upi,
                name: user.name,
                amount: 0
            });
        }

        // Push joining user to group list
        groupData.members.push(newMemberObj);
        await groupData.save();

        // Add the group's _id to the joining user's groups reference list
        await userModel.findOneAndUpdate({ upi: user.upi }, { $push: { groups: groupData._id } });

        return res.json({
            status: true,
            message: "Joined group successfully"
        });
    } catch (error) {
        return res.json({
            status: false,
            message: error.message
        });
    }
}


module.exports = {
    getAllGroups,
    createGroup,
    addMember,
    getGroupInfo,
    joinGroup
}
