const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    // fare: {
    //     type: Number,
    //     required: true
    // },
    status: {
        type: String,
        enum: ['requested', 'completed', 'accepted','started', 'cancelled'],
        default: 'requested'
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    }


});

module.exports = mongoose.model('Ride', rideSchema);
