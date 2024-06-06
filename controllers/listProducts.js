const { response } = require('express');
const  ShopList  = require('../models/listProducts');

const createListProducts = async (req, res = response) => {
    const listProducts = new ShopList(req.body);
    try {
        const listProductsDB = await listProducts.save();
        res.json({
            ok: true,
            listProducts: listProductsDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, Por favor hable con el administrador',
        });
    }
};

module.exports = {
    createListProducts,
}