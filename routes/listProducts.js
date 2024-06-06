const { Router} = require('express');
const { createListProducts } = require('../controllers/listProducts');
const router = Router(); 
/*
  Rutas de items
  host + /api/listProducts
  
*/

router.post('/new', createListProducts);

module.exports = router