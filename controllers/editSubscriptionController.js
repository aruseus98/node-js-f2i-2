const userModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const updateSubscription = async (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  let select = "SELECT subscription, customer, paiement_manager FROM user WHERE id = ?;";
  let updateUser = "UPDATE user SET paiement_manager = ? WHERE id = ?;";

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

    const { paiement_manager } = body;

    if (!paiement_manager) {
      return res.status(400).json({
        message: 'Subscription ID is required.',
      });
    }

    // Vérifier si l'utilisateur a déjà une subscription
    if (userResult.subscription && userResult.paiement_manager) {
      // Annuler l'abonnement existant sur Stripe
      await stripe.subscriptions.update(userResult.subscription, {
        cancel_at_period_end: false,
      });

      await stripe.subscriptions.update(userResult.subscription, {
        cancel_at_period_end: true,
      });
    }

    // Créer un nouvel abonnement sur Stripe
    const newSubscription = await stripe.subscriptions.create({
      customer: userResult.customer,
      items: [{ price: paiement_manager }],
    });

    // Mettre à jour les informations de l'utilisateur dans la base de données
    await new Promise((resolve, reject) => {
      connect.execute(updateUser, [newSubscription.id, userId], function (err, updateResult) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return res.status(200).json({
      message: 'Subscription updated successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid token.',
    });
  }
};

module.exports = {
  updateSubscription,
};
