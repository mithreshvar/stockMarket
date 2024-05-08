const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stockSchema = new Schema({
    
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Array,
        required: true
    },
    shareAmount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Stock', stockSchema)