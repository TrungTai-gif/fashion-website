import ApiError from "../utils/apiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(
        new ApiError(400, errorMessages.join("; "), "ValidationError")
      );
    }

    req.body = value;
    next();
  };
};

export default validate;
