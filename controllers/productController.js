require('dotenv').config();
const userModel = require('../model/UserModel');
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../utils/stripe');

const createProduct = async (req, res) => {
  const connect = userModel.connection();
  let response;

  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);

    const [existingUser] = await new Promise((resolve, reject) => {
      let select = "SELECT customer, paiement_manager FROM user WHERE email = ?;";
      connect.execute(select, [decoded.email], function (err, results, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (!existingUser) {
      return res.status(409).json({
        message: 'Utilisateur inconnu',
      });
    }

    if (existingUser.customer && existingUser.paiement_manager) {
      return res.status(409).json({
        message: 'Produit existant',
      });
    }

    // Effectuer le paiement uniquement si l'utilisateur existe dans la base de données
    response = await Subscription(
      req.body.number,
      req.body.exp_month,
      req.body.exp_year,
      req.body.cvc
    );

    const productId = Math.floor(Math.random() * 10000); // Génère un faux ID pour le produit

    // Mettre à jour les champs customer et paiement_manager dans la base de données
    let updateUser = "UPDATE user SET customer = ?, paiement_manager = ? WHERE email = ?;";
    await new Promise((resolve, reject) => {
      connect.execute(updateUser, [response.customer, response.id, decoded.email], function (err, updateResult) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Associer la méthode de paiement par défaut au customer dans Stripe
    const customerID = response.customer;
    const paymentMethodID = response.default_payment_method;
    await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });

    return res.status(200).json({
      message: 'Produit créé avec succès',
      product: { id: productId, ...req.body },
      response,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Une erreur s\'est produite',
    });
  }
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
    price: productPrice,
  });
};

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

module.exports = {
  createProduct,
  readProduct,
  updateProduct,
  deleteProduct,
};
