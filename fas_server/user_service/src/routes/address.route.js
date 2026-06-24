// routes/address.route.js
import express from "express";

import addressController from "../controllers/address.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  addressSchema,
  updateAddressSchema,
} from "../schemas/address.schema.js";

const router = express.Router();
// add address
router.post("/", validate(addressSchema), addressController.addAddress);
router.get("/:userId", addressController.getAddressByUserId);
router.patch(
  "/:addressId",
  validate(updateAddressSchema),
  addressController.updateAddress
);
router.delete("/:addressId", addressController.deleteAddress);
// Đặt làm mặc định hiển thị, order
router.patch("/:addressId/default", addressController.setDefaultAddress);

export default router;
