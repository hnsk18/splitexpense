const mongoose = require('mongoose');

const txn = new mongoose.Schema({
    by: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    splits: [{
        to: {
            upi: String,
            name: String
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    settled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Txns', txn)