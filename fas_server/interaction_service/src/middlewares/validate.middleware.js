import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  console.log("Validating body:", req.body);   // log body
  console.log("Using schema:", schema.describe()); // log schema structure

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details[0].message, "Validation Error");
  }
  next();
};


export default validate;