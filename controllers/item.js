const { response } = require('express');
const  Item  = require('../models/Item');

const getItems = async(req, res= response) => {

  // Select  all itemms and group by category, order ascending by category and push all items of that category
    // const pipeline =[
    //     {
    //       $group: {
    //         _id: "$category",
    //         elementos: { $push: "$$ROOT" }
    //       }
    //     },
    //     {
    //       $sort: {
    //         _id: 1 // order ascending 
    //       }
    //     }
    //   ]
    // const items = await Item.aggregate(pipeline);

    const items = await Item.find();
    res.status(200).json({
      ok: true,
      items
    })
};

const getItem = (req, res= response) => {
  console.log('en getItem..')
    res.json({
      ok: true,
      msg: 'Item'
    })
}

const createItem = async(req, res= response) => {

  
    const { name } = req.body;

    try {

      let item = await Item.findOne({ name });

      if (item) {
        return res.status(400).json({
          ok: false,
          msg: 'El item ya existe'
        })
      }
      item = new Item( req.body);
  
      await item.save();
  
      res.status(201).json({
        ok: true,
        item
      })

    } catch (error) {
    
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error, Por favor hable con el administrador'
    })
    
    }
}

const updateItem = async(req, res= response) => {

  const itemId = req.params.id;

  try {

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        ok: false,
        msg: 'El item no existe'
      })
    }

    const nuevoItem = {
      ...req.body
    }
    const itemActualizado = await Item.findByIdAndUpdate( itemId, nuevoItem, {new: true} );

    res.status(200).json({
      ok: true,
      item: itemActualizado
    })

    

  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error, Por favor hable con el administrador'
    })
    
  }


}

const deleteItem = async(req, res= response) => {
  const itemId = req.params.id;

  try {

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        ok: false,
        msg: 'El item no existe'
      })
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json({
      ok: true,
      msg: 'Item eliminado'
    })

  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error, Por favor hable con el administrador'
    })
    
  }
}

const getCategories = async(req, res= response) => {
  try{
    const pipeline =[
      {
        $group: {
          _id: null, // Agrupar todos los documentos en un grupo
          categorias: { $addToSet: "$category" } // Agregar categorías únicas a un array
        }
      },
      {
        $project: {
          _id: 0, // No incluir el campo _id en la salida
          categorias: 1 // Proyectar solo el campo categorias
        }
      }
    ]
  
  
    const categories = await Item.aggregate(pipeline);
  
  
    res.status(200).json({
      ok: true,
      categories
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, Por favor hable con el administrador'
    })
  }

  
  
}


  module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getCategories
  }