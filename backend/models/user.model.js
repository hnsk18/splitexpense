const mongoose = require('mongoose');

const user = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    upi: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }]
});

module.exports = mongoose.model('Users', user)