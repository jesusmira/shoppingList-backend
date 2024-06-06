/*
  Rutas de items
  host + /api/items
  
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getItems, getItem, createItem, updateItem, deleteItem, getCategories } = require('../controllers/item');
const { fieldValidators } = require('../middlewares/fieldValidators');
const router = Router();

router.get('/categories', getCategories);
router.get('/', getItems);
router.post(
      '/new',
      [
        // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('category', 'La categoria es obligatoria').not().isEmpty(),
        fieldValidators

      ], 
      createItem);
router.get('/:id', getItem);
router.put('/:id',
      [
        // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('category', 'La categoria es obligatoria').not().isEmpty(),
        fieldValidators
      ],
      updateItem);
router.delete('/:id', deleteItem);



module.exports = router;