module.exports.createUser = (req, res) => {
    let body = req.body

    let userInfo = `L'utilisateur saisi est : Nom: ${body.nom}, Prénom: ${body.prenom}, Email: ${body.email}, Téléphone: ${body.phone}, Date de naissance: ${body.date}`;

    return res.status(200).json({
        error: false,  
        message: [userInfo],
    })
}
