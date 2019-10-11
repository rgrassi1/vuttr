const mongoose = require('mongoose');

const ToolSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [String]
}, { timestamps: true })

module.exports = mongoose.model('Tool', ToolSchema);