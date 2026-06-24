import Address from "../models/address.model.js";
import ApiError from "../utils/apiError.js";

const addressService = {
  getAddressByUserId: async (userId) => {
    try {
      const addresses = await Address.find({ user_id: userId });
      if (!addresses || addresses.length === 0) {
        return {};
      }
      return addresses;
    } catch (error) {
      throw error;
    }
  },
  addAddress: async (userId, addressData) => {
    if (!userId) {
      throw new Error("userId is required when creating address");
    }

    if (addressData.isDefault) {
      await Address.updateMany({ user_id: userId }, { isDefault: false });
    }

    return await Address.create({
      user_id: userId,
      ...addressData,
    });
  },

  deleteAddress: async (addressId) => {
    return await Address.findByIdAndDelete(addressId);
  },

  setDefaultAddress: async (userId, addressId) => {
    await Address.updateMany({ user_id: userId }, { isDefault: false });
    return await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );
  },
};

const getAddressById = async (id) => {
  const address = await Address.findById(id);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }
  return address;
};

const updateAddress = async (addressId, addressData) => {
  if (addressData.isDefault) {
    const address = await Address.findById(addressId);
    if (address) {
      await Address.updateMany(
        { user_id: address.user_id },
        { isDefault: false }
      );
    }
  }
  return await Address.findByIdAndUpdate(addressId, addressData, { new: true });
};

export default addressService;
