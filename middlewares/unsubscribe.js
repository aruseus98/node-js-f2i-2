const unsubscribe = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err) {
      return res.status(409).json({ type: err.name, message: err.message });
    }
};

module.exports = unsubscribe