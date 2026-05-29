const mongoose = require('mongoose');

const group = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        upi: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        balances: [{
            upi: {
                type: String,
                required: true,
                trim: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
                default: 0
            }
        }],
        total: {
            type: Number,
            default: 0
        }
    }],
    createdBy: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

module.exports = mongoose.model('Group', group);