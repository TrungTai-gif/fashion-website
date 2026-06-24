import { userService } from "@services";
import { useQuery } from "@tanstack/react-query";

import UserManagement from "@/components/user_component/UserManagement";
import Spinner from "@/components/common/Spinner";
const Customers = () => {
  const { getAllUser } = userService();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  if (isLoading) return <Spinner />;

  return <UserManagement users={users} />;
};

export default Customers;
