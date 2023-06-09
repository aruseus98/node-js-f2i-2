module.exports = {
    getHome: (req, res) => {
        return res.status(200).json({
            error: false,
            message: ["Hello world"]
        });
    },

    updateElement: (req, res) => {
        return res.status(409).json({
            error: true,
            message: ["Element modifier"]
        });
    },

    deleteElement: (req, res) => {
        return res.status(409).json({
            error: true,
            message: ["Element supprimer"]
        });
    }
}