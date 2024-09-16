const { response } = require('express');
const  ShopList  = require('../models/listProducts');

const createListProducts = async (req, res = response) => {
    const listProducts = new ShopList(req.body);
    try {
        const listProductsDB = await listProducts.save();
        res.status(200).json({
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

const getListProducts = async (req, res = response) => {
    try{
        const listProducts = await ShopList.find();
        res.status(200).json({
            ok: true,
            listProducts,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, Por favor hable con el administrador',
        });
    }
};


const getTopProducts = async (req, res = response) => {
 
    try{
        const totalCounters = await ShopList.aggregate([
            { $unwind: "$products" },
            {
              $group: {
                _id: null,
                totalCounter: { $sum: "$products.counter" }
              }
            }
          ]);
          
        const total = totalCounters[0].totalCounter;

        const topProducts = await ShopList.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.id",
                    name: { $first: "$products.name" },
                    totalCounter: { $sum: "$products.counter" },
                }
            },
            {
                $addFields: {
                  percentage: { $multiply: [{ $divide: ["$totalCounter", total] }, 100] }
                }
            },
            {
                $addFields: {
                  percentage: { $round: ["$percentage", 0] }  // Redondear a 2 decimales
                }
            },
            { $sort: { totalCounter: -1 } },
            { $limit: 3 },
        ]);
        res.status(200).json({
            ok: true,
            topProducts,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, Por favor hable con el administrador',
        });
    }

};

const getTopCategories = async (req, res = response) => {
    try {
        // Calcular el total de todos los contadores en todas las categorías
        const totalCounter = await ShopList.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    totalCounter: { $sum: "$products.counter" }
                }
            }
        ]);

        const totalCounterInAllCategories = totalCounter[0]?.totalCounter || 1; 

        // Calcular el top 3 de categorías
        const topCategories = await ShopList.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.category",
                    totalCounter: { $sum: "$products.counter" }
                }
            },
            { $sort: { totalCounter: -1 } },
            { $limit: 3 },
            {
                $addFields: {
                    percentage: {
                        $cond: [
                            { $gt: [totalCounterInAllCategories, 0] },
                            { 
                                $multiply: [
                                    { $divide: ["$totalCounter", totalCounterInAllCategories] },
                                    100
                                ]
                            },
                            0
                        ]
                    },
                    percentageRounded: {
                        $round: [{ $multiply: [
                            { $divide: ["$totalCounter", totalCounterInAllCategories] },
                            100
                        ]}, 0]
                    }
                }
            }
        ]);
        res.status(200).json({
            ok: true,
            topCategories,
        });
    } catch (error) {
        console.error("Error fetching top categories:", error);
    }
}

const getItemMonth = async (req, res= response ) => {

    try{

        const result = await ShopList.aggregate([
           // Descomponer el array de productos
        { $unwind: "$products" },
        
        // Convertir `dateCreation` de string a Date
        {
            $addFields: {
                dateParts: { $split: ["$dateCreation", " "] } // Dividir en ["Wed", "29.4.2024"]
            }
        },
        {
            $addFields: {
                dayMonthYear: { $split: [{ $arrayElemAt: ["$dateParts", 1] }, "."] } // Dividir "29.4.2024" en ["29", "4", "2024"]
            }
        },
        {
            $addFields: {
                dateFormatted: {
                    $concat: [
                        { $arrayElemAt: ["$dayMonthYear", 2] }, "-", // Año: "2024"
                        {
                            $cond: {
                                if: { $lt: [{ $toInt: { $arrayElemAt: ["$dayMonthYear", 1] } }, 10] },
                                then: { $concat: ["0", { $arrayElemAt: ["$dayMonthYear", 1] }] }, // Mes: "04"
                                else: { $arrayElemAt: ["$dayMonthYear", 1] } // Mes sin "0"
                            }
                        }, "-",
                        { $arrayElemAt: ["$dayMonthYear", 0] } // Día: "29"
                    ]
                }
            }
        },
        {
            $addFields: {
                dateCreation: {
                    $dateFromString: {
                        dateString: "$dateFormatted",
                        format: "%Y-%m-%d"
                    }
                }
            }
        },

        // Extraer el mes y el año de la fecha de creación
        {
            $addFields: {
                month: { $month: "$dateCreation" },
                year: { $year: "$dateCreation" }
            }
        },

        // Agrupar por nombre de producto, mes y año, y sumar los contadores
        {
            $group: {
                _id: {
                    productName: "$products.name",
                    month: "$month",
                    year: "$year"
                },
                totalCounter: { $sum: "$products.counter" }
            }
        },

        // Ordenar para obtener el mejor producto de cada mes/año
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "totalCounter": -1
            }
        },

        // Agrupar de nuevo para obtener el mejor producto por mes/año
        {
            $group: {
                _id: {
                    month: "$_id.month",
                    year: "$_id.year"
                },
                bestProduct: { $first: "$_id.productName" },
                totalCounter: { $first: "$totalCounter" }
            }
        },

        // Proyectar los resultados finales
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                year: "$_id.year",
                bestProduct: 1,
                totalCounter: 1
            }
        },

        // Ordenar los resultados por año y mes
        { $sort: { "year": 1, "month": 1 } }
        ]);

        res.status(200).json({
            ok: true,
            result,
        });

    }catch (error) {
        console.error("Error fetching top categories:", error);
    }

    // el mejor item de cada

}


module.exports = {
    createListProducts,
    getListProducts,
    getTopProducts,
    getTopCategories,
    getItemMonth
}