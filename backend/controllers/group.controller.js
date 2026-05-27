const groupModel = require("../models/group.model")
const userModel = require("../models/user.model")

const getAllGroups = async (req, res) => {
    try {
        const user = req.user;
        
        // Fix: Properly await query first to get user document
        const userDoc = await userModel.findById(user._id);
        if (!userDoc) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }
        
        const groups = userDoc.groups || [];
        const groupList = [];
        
        // Fix: Use for...of to iterate over the array elements, not index strings
        for (let groupId of groups) {
            const groupData = await groupModel.findById(groupId);
            if (!groupData) continue; // Skip if group is deleted
            
            let receiveableamount = 0;
            let payableamount = 0;
            
            // Fix: Use for...of to iterate over members
            for (let member of groupData.members) {
                if (member.upi === user.upi) {
                    // Fix: Use for...of to iterate over balances
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
        const { name, members } = req.body;
        
        // Generate unique 6-digit random code
        let code = Math.floor(100000 + Math.random() * 900000).toString();
        while (await groupModel.findOne({ code })) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        let mem = [];
        
        for (let member of members) {
            const memData = await userModel.findOne({ upi: member.upi });
            if (!memData) {
                return res.json({
                    status: false,
                    message: `Member with UPI ${member.upi} not found`
                });
            }
            mem.push({
                upi: memData.upi,
                name: memData.name, // Use the database-verified name
                balances: [],
                total: 0
            });
        }
        
        // Add creator to the members array
        mem.push({
            upi: user.upi,
            name: user.name,
            balances: [],
            total: 0
        });
        
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
        
        // Update creator
        await userModel.findByIdAndUpdate(user._id, { $push: { groups: response._id } });
        
        // Update other members
        for (let member of members) {
            await userModel.findOneAndUpdate(
                { upi: member.upi },
                { $push: { groups: response._id } }
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
            name: memData.name, 
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
        await userModel.findByIdAndUpdate(memData._id, { $addToSet: { groups: groupData._id } });

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

const getGroupInfo = async(req,res)=>{
    try{
        const {groupId} = req.params;
        const groupData = await groupModel.findOne({code:groupId});
        if(!groupData){
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
    catch(error){
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
    getGroupInfo
}