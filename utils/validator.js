const Yup = require('yup')

let register = Yup.object({
    lastname: Yup.string().required().min(1).max(155),
    firstname: Yup.string().required().min(1).max(155),
    email: Yup.string().required().email().min(1).max(155),
    phone: Yup.string().required().min(8).max(15),
    password: Yup.string().required().min(1).max(255),
});


let login = Yup.object({
    email: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255)
});

let cardInfo = Yup.object({
    name: Yup.string().required().min(1).max(155),
    description: Yup.string().required().min(1).max(255),
    price: Yup.string().required().min(1).max(155),
    number: Yup.string().required().min(16).max(16),
    exp_month: Yup.string().required().min(2).max(2),
    exp_year: Yup.string().required().min(2).max(2),
    cvc: Yup.string().required().min(3).max(3),
})

let unsubscribe = Yup.object({
    subscription: Yup.boolean().required(),
})

module.exports = {
    register,
    login,
    cardInfo,
    unsubscribe
}
