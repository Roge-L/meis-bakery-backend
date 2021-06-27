// const express = require('express');

// // Create the Router object (instance of middleware and routes)
// const router = express.Router();

// // Fetch the cake schema (recall in noSQL documents inside of
// // collections follow a blueprint (schema))
// const Cake = require('../models/cake');

// // Getting all
// router.get('/', async (req, res) => {
//     try {
//         const cakes = await Cake.find();
//         res.json(cakes);
//     } catch(err) {
//         res.status(500).json({message: err.message});
//     }
// })

// // Getting one
// router.get('/:id', getCake, (req, res) => {
//     res.send(res.cake.photoURL);
// })

// // Creating one
// router.post('/', async (req, res) => {
//     const cake = new Cake({
//         photoURL: req.body.photoURL
//     })

//     try {
//         const newCake = await cake.save();
//         res.status(201).json(newCake);
//     } catch(err) {
//         res.status(400).json({message: err.message})
//     }
// })

// // Deleting one
// router.delete('/:id', (req, res) => {

// })

// // Middleware function for getting a cake by ID
// async function getCake(req, res, next) {
//     let cake;
//     try {
//         cake = await Cake.findById(req.params.id);
//         if (cake == null) {
//             return res.status(404).json({message: 'cannot find cake'})
//         }
//     } catch(err) {
//         return res.status(400).json({message: err.message});
//     }

//     res.cake = cake;
//     next();
// }

// module.exports = router;