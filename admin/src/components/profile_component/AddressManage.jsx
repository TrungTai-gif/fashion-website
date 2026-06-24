import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit, MapPin, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import Spinner from "../common/Spinner";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";

const AddressManage = ({ user_id }) => {
  const { getUserAddress, addAddress, deleteAddress, setDefaultAddress } =
    userService();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState({
    lable: "",
    detail: "",
    phone: "",
    isDefault: false,
  });

  const queryClient = useQueryClient();

  const { data: addressData, isLoading } = useQuery({
    queryKey: ["address"],
    queryFn: () => getUserAddress(user_id),
  });
  //add address
  const { mutate: addMutate, isPending: addPending } = useMutation({
    mutationFn: addAddress,
    onSuccess: (res) => {
      setIsAddingAddress(false);
      setAddressDraft({ label: "", text: "", phone: "", isDefault: false });
      queryClient.invalidateQueries(["address"]);
    },
    onError: () => {
      toast.error("Add failed!");
    },
  });

  const saveAddress = () => {
    if (
      addressDraft.label === "" ||
      addressDraft.detail === "" ||
      addressDraft.phone === ""
    ) {
      toast.warning("Hãy nhập đầy đủ thông tin!");
      return;
    }
    addMutate(addressDraft);
  };

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (res) => {
      toast.success("Deleted!");
      queryClient.invalidateQueries(["address"]);
    },
    onError: () => {
      toast.error("Add failed!");
    },
  });

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: (res) => {
      toast.success("Updated!");
      queryClient.invalidateQueries(["address"]);
    },
    onError: () => {
      toast.error("uppdate failed!");
    },
  });
  return (
    <>
      {(isLoading || addPending || deletePending) && <Spinner />}
      <div className="group lg:col-span-2">
        <div className="flex flex-row justify-between">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Địa chỉ</span>
          </label>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setIsAddingAddress(!isAddingAddress);
                setAddressDraft({
                  label: "",
                  detail: "",
                  phone: "",
                  isDefault: false,
                });
              }}
              className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-300 bg-indigo-50 text-indigo-700 rounded-md"
            >
              <PlusCircle className="w-4 h-4" /> Thêm địa chỉ mới
            </button>
          </div>
        </div>
        {addressData && (
          <div className="space-y-4">
            {Object.keys(addressData).length === 0 && (
              <div className="text-sm text-gray-500">Chưa có địa chỉ nào.</div>
            )}

            {addressData.length > 0 ? (
              addressData.map((addr, idx) => (
                <div
                  key={addr._id || addr.id || idx}
                  className="p-3 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-r from-gray-50 to-white flex items-start justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      {addr.label || `Địa chỉ ${idx + 1}`}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {addr.detail || "Chưa có mô tả địa chỉ"}
                    </div>

                    {addr.phone && (
                      <div className="text-sm text-gray-500 mt-1">
                        SĐT: {addr.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      {addr.isDefault ? (
                        <div className="inline-block mt-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                          Mặc định
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateMutate(addr._id)}
                          className="inline-block mt-2 px-2 py-1 text-xs bg-gray-400 text-black hover:bg-gray-200 rounded-full"
                          title="Đặt làm mặc định"
                        >
                          Đặt làm mặc định
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteMutate(addr._id)}
                        className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 italic">
                Chưa có địa chỉ nào
              </div>
            )}

            {isAddingAddress && (
              <div className="p-4 border rounded-lg bg-white">
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={addressDraft.label}
                    onChange={(e) =>
                      setAddressDraft((s) => ({
                        ...s,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Tên địa chỉ (ví dụ: Nhà, Cơ quan)"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <textarea
                    rows={3}
                    value={addressDraft.detail}
                    onChange={(e) =>
                      setAddressDraft((s) => ({
                        ...s,
                        detail: e.target.value,
                      }))
                    }
                    placeholder="Địa chỉ chi tiết ví dụ: 12 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Việt Nam"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    value={addressDraft.phone}
                    onChange={(e) =>
                      setAddressDraft((s) => ({
                        ...s,
                        phone: e.target.value,
                      }))
                    }
                    maxLength="10"
                    placeholder="Số điện thoại"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addressDraft.isDefault}
                        onChange={(e) =>
                          setAddressDraft((s) => ({
                            ...s,
                            isDefault: e.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm">Đặt làm mặc định</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAddress(false);
                          //   setEditingAddressIndex(-1);
                          setAddressDraft({
                            label: "",
                            detail: "",
                            phone: "",
                            isDefault: false,
                          });
                        }}
                        className="px-3 py-2 rounded bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => saveAddress()}
                        className="px-3 py-2 rounded bg-indigo-600 text-white"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AddressManage;
