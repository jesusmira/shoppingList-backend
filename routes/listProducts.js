const { Router} = require('express');
const { createListProducts, getListProducts, getTopProducts, getTopCategories, getItemMonth } = require('../controllers/listProducts');
const router = Router(); 
/*
  Rutas de items
  host + /api/listProducts
  
*/

router.get('/', getListProducts);
router.post('/new', createListProducts);
router.get('/top', getTopProducts);
router.get('/topCategories', getTopCategories);
router.get('/month', getItemMonth); 


module.exports = router