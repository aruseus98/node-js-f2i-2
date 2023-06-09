const userModel = require('../model/UserModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const unsubscribeProduct = async (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  let select = "SELECT subscription, customer, paiement_manager FROM user WHERE id = ?;";
  let updateUser = "UPDATE user SET subscription = 1 WHERE id = ?;";

  let connect = userModel.connection();

  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
    
    const [userResult] = await new Promise((resolve, reject) => {
      connect.execute(select, [userId], function (err, selectResult) {
        if (err) {
          reject(err);
        } else {
          resolve(selectResult);
        }
      });
    });

    if (!userResult || userResult.subscription !== 0) {
      return res.status(409).json({
        message: 'User not subscribed.',
      });
    }

    // Annule l'abonnement dans Stripe
    const canceledSubscription = await stripe.subscriptions.del(userResult.paiement_manager);

    // Vérifie si l'abonnement a été correctement annulé dans Stripe
    if (canceledSubscription.status === 'canceled') {
      // Modifie les informations de l'utilisateur dans la base de données
      await new Promise((resolve, reject) => {
        connect.execute(updateUser, [userId], function (err, updateResult) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      return res.status(200).json({
        message: 'Unsubscribed successfully.',
      });
    } else {
      // Si l'abonnement n'a pas été annulé correctement dans Stripe
      return res.status(500).json({
        message: 'Failed to cancel subscription in Stripe.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid token.',
    });
  }
};

module.exports = {
  unsubscribeProduct,
};
