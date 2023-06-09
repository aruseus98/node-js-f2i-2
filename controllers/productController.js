// { } obligatoire ici
const { faker } = require('@faker-js/faker');
require('dotenv').config();
var jwt = require('jsonwebtoken')
const userModel = require('../model/UserModel')
const Subcription = require('../utils/stripe')

const createProduct = async(req, res) => {
    const productId = Math.floor(Math.random() * 10000); // Génère un faux ID

    const connect = userModel.connection();


    const error = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY, async function(err, decoded) {
        try {
            // on lui demande de promesse afin de savoir si il va bien renvoyer les données
            const resultat = await new Promise((resolve, reject) => {
                let select = "SELECT * FROM user WHERE email = ?;"
                // si l'execution a bien eu lieu 
                let result = connect.execute(select,[decoded.email],  function(err, results, fields) {
                
                    // si lemail existe déjà on renvoi erreur dans le catch
                    if (results.length > 0) {
                        return resolve(results)
                    }
                    // sinon il continue son bout de chemin
                    return reject(true)
                })
        
            })
            return true
        } catch (error) {
           return false
        } 

    });

    if (!error) {
        return res.status(409).json({
            message: 'Utilisateur inconnue',
        });
    }

    // body { card, cvc, month, year }

    const response = await Subcription(req.body.number, req.body.exp_month, req.body.exp_year, req.body.cvc)


    return res.status(200).json({
        message: 'Produit créé avec succès',
        product: {id: productId, ...req.body},
        response
    });
};

const readProduct = (req, res) => {
    // Génération de fausses données product
    const productName = faker.commerce.productName();
    const productDescription = faker.commerce.productDescription();
    const productPrice = faker.commerce.price();


    const productId = req.params.id; 
    res.status(200).json({
        // On crée un faux produit pour simuler la réponse de la BDD
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice
    });
}

const updateProduct = (req, res) => {
    res.status(200).json({
        message: 'Produit mis à jour avec succès',
    });
};

const deleteProduct = (req, res) => {
    res.status(200).json({
        message: 'Produit supprimé avec succès',
    });
};

// Syntaxe différente pour exporter des modules

module.exports={createProduct, readProduct, updateProduct, deleteProduct};
