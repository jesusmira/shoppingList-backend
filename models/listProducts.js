const { Schema, model } = require('mongoose');
const ProductSchema = Schema({
    id: { type: String, required: true },

    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
    }

});
const ShopListSchema = Schema({
    nameList: {
        type: String,
        required: true,
    },
    dateCreation: {
        type: String
    },
    completed: {
        type: Boolean,
    },
   products: [ ProductSchema ]
    
    
});

module.exports = model('ShopList', ShopListSchema)