import ApiError from "../utils/apiError.js";

// const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);
//   if (error) {
//     throw new ApiError(400, error.details[0].message, "Validation Error");
//     // return res.status(400).json(error.details[0]);
//   }
//   next();
// };

const validate = (schema) => (req, res, next) => {
  console.log("Validating body:", req.body); // log body

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details[0].message, "Validation Error");
  }
  next();
};

export default validate;
