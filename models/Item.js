const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    note: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String
    },
});

module.exports = model('Item', ItemSchema);