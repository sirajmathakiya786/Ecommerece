
const validateRequest = (validator) => async (req, res, next) => {
  try {
    await validator.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.details.map((detail) => {
      const field = detail.context.key;
      const message = detail.message;
      return `${field}: ${message}`;
    });

    const errorMessage = {
      success: false,
      message: 'Validation error',
      errors,
    };
    res.status(422).json(errorMessage);
  }
};

module.exports = validateRequest;
