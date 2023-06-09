module.exports = (req, res, next) => {
    let body = req.body

    let error = []

    console.log(body)

    if (!body.nom) {
        error.push("Le nom est incorrecte")
    }

    if (!body.prenom) {
        error.push("Le prenom est incorrecte")
    }

    if (!body.email) {
        error.push("Le email est incorrecte")
    }

    if (!body.phone) {
        error.push("Le phone est incorrecte")
    }

    if (!body.date) {
        error.push("Le date est incorrecte")
    }

    if (error.length > 0) {
        return res.status(409).json({
            error: true,
            message: error
        })
    }

    if (body.nom.length <= 1 || body.nom.length >= 155) {
        error.push("Le nom est incorrecte")
    }

    if (body.prenom.length <= 1 || body.prenom.length >= 155) {
        error.push("Le prenom est incorrecte")
    }

    if (body.phone.length <= 8 || body.phone.length >= 12) {
        error.push("Le phone est incorrecte")
    }

    if (!String(body.email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
        error.push("Le email est incorrecte")
    }

    // Récupérer la date actuelle
    var currentDate = new Date();
    
    // Séparer la date en année, mois et jour
    var parts = body.date.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    
    // Créer une nouvelle date à partir de la date fournie
    var userDate = new Date(year, month - 1, day);
    
    // Calculer la différence en millisecondes entre les deux dates
    var diff = currentDate - userDate;
    
    // Calculer l'âge en années
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

    // Vérifier si l'utilisateur a plus de 18 ans
    if (age <= 18) {
        error.push("Vous n'êtes pas majeur car vous avez "+age+" ans");
    } 

    if (error.length > 0) {
        return res.status(409).json({
            error: true,
            message: error
        })
    }

    return next()
}
