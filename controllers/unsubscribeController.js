const userModel = require('../model/UserModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const unsubscribeProduct = async (req, res) => {
  const body = req.body;

  let select = "SELECT subscription, customer, paiement_manager FROM user WHERE id = ?;";
  let updateUser = "UPDATE user SET subscription = 1 WHERE id = ?;";

  let connect = userModel.connection();

  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
    
    const [userResult] = await new Promise((resolve, reject) => {
      connect.execute(select, [decoded.id], function (err, selectResult) {
        if (err) {
          reject(err);
        } else {
          resolve(selectResult);
        }
      });
    });

    if (userResult.subscription !== 1) {
      return res.status(409).json({
        message: 'User not subscribed.',
      });
    }

    // Modifie le status de l'abonne stripe
    await stripe.subscriptions.del(userResult.stripeSubscriptionId);

    // Modifie les informations de l'utilisateur dans la base données
    await new Promise((resolve, reject) => {
      connect.execute(updateUser, [decoded.id], function (err, updateResult) {
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
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token.',
    });
  }
};

module.exports = {
  unsubscribeProduct,
};