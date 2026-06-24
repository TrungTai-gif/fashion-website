import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

import api from "./api";
import { toast } from "react-toastify";
export const userService = () => {
  const { backendUrl } = useContext(ShopContext);
  const resource = "/api/users/";

  const register = async ({ name, email, password }) => {
    try {
      const res = await api.post(resource + "register", {
        name,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      alert(err.message);
    }
  };

  const getAllUser = async () => {
    try {
      const res = await api.get(resource);
      if (res.data.success) {
        return res.data.data;
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      throw err;
    }
  };
  const deleteUser = async ({ userId }) => {
    try {
      const res = await axios.delete(backendUrl + resource + userId, {
        headers: {
          token,
        },
      });
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const getProfile = async (id) => {
    try {
      const res = await api.get(resource + "/" + id);
      if (res.data.success) {
        return res.data.data.user;
      }
    } catch (err) {
      console.log(err.response.data);

      throw err.response.data;
    }
  };

  const updateUser = async ({ userInfo }) => {
    try {
      const res = await api.put(resource + "profile", {
        user: userInfo,
      });
      if (res.data.success) {
        return res.data.data;
      } else {
        console.log(res.data.message);
        throw res.data.message;
      }
    } catch (err) {
      console.log(err.response.data);
      throw err;
    }
  };

  // api for address
  const getUserAddress = async (user_id) => {
    try {
      const res = await api.get(resource + "address/" + user_id);
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.log(err.response.data);
      throw err.response.data;
    }
  };

  const addAddress = async ({ label, detail, phone, isDefault = "false" }) => {
    try {
      const res = await api.post(resource + "address/", {
        label,
        detail,
        phone,
        isDefault,
      });
      if (res.data.success) {
        return res.data.data;
      } else {
        console.log(res.data.message);
      }
      return [];
    } catch (err) {
      throw err.response.data;
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const res = await api.patch(
        resource + "address/" + addressId + "/default"
      );
      if (res.data.success) {
        return res.data.data;
      } else {
        console.log(res.data.message);
      }
      return [];
    } catch (err) {
      throw err.response.data;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(resource + "address/" + addressId);
      if (res.data.success) {
        return res.data.data;
      } else {
        toast.error(res.data.message);
      }
      return [];
    } catch (err) {
      throw err.response.data;
    }
  };

  const getAdmin = async () => {
    try {
      const res = await api.get(resource + "admin");
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      toast.error(err.response.data);
      throw err.response.data;
    }
  };
  return {
    // User
    getAdmin,
    register,
    getProfile,
    getAllUser,
    deleteUser,
    updateUser,

    // address
    getUserAddress,
    addAddress,
    setDefaultAddress,
    deleteAddress,
  };
};
