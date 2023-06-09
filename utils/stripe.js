const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const Subscription = async(number, exp_month, exp_year, cvc) => {

    try {

        // pour créer une carte de payment
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: number,
              exp_month: exp_month,
              exp_year: exp_year,
              cvc: cvc,
            },
        });   
        
        console.log(paymentMethod.id)  

        // create customer 
        const customer = await stripe.customers.create({
            email: 'alexandre.huynh98@gmail.com',
        });

        console.log(customer.id)


        // on relie la carte au customer
        const paymentMethodAttach = await stripe.paymentMethods.attach(
            paymentMethod.id,
            {customer: customer.id}
          );


        // on créer l'abonnement   
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {price: process.env.STRIPE_PRODUCT},
            ],
            default_payment_method: paymentMethod.id
        });
        console.log(subscription)
        return subscription;
    } catch (error) {
        console.log(error)
        return false;
    }

}
module.exports= Subscription



