const express = require("express");
const router = express.Router();

const {
    getAllGroups,
    createGroup,
    addMember,
    getGroupInfo,
    joinGroup
} = require("../controllers/group.controller");
const txnRoutes = require("../controllers/txn.controller");

// Create a group
router.post('/create', createGroup)
// Get User Groups
router.get('/getall', getAllGroups)
// Add a new member to the group
router.post('/member/:groupId/join', addMember)
// Join a Group
router.post('/join/:groupId/', joinGroup)
// Group Transactions
// router.get('/txns', txnRoutes)
// Get Group Details
router.get('/:groupId', getGroupInfo)


module.exports = router;
