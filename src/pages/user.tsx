import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Image from "next/image";
import { formatDate } from "../helper/formatDate";
import { User } from "~/models/User";
import { makeToast } from "~/utils/makeToast";

const UserPage = () => {
  const { data, setStatus } = useUsers();

  return (
    <DashboardLayout title="User">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Contact
              </th>
              <th scope="col" className="px-6 py-3">
                Bid and Run
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Registered At
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr className="bg-white border-b border-gray-200" key={item.id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item.image || "/images/profile.png"}
                    alt=""
                    width={400}
                    height={400}
                    className="min-w-20 min-h-20 w-20 h-20 rounded-lg object-cover"
                  />
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.name}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  <div className="flex flex-col">
                    <div className="font-semibold">{item.email}</div>
                    <div className="text-neutral-800">+{item.phone}</div>
                  </div>
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {
                    item.transactions.filter(
                      (item) => item.status === "Expired"
                    ).length
                  }
                </th>
                <td className="px-6 py-4">
                  <div
                    className={`${
                      item.banned ? "bg-red-500" : "bg-green-500"
                    }  text-white text-center rounded-lg px-2 py-1`}
                  >
                    {item.banned ? "Banned" : "Active"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {formatDate(item.createdAt, true)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    {item.banned ? (
                      <button
                        onClick={() => setStatus(`/${item.id}`)}
                        className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 cursor-pointer w-full"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(`/${item.id}`)}
                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 cursor-pointer w-full"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

const useUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  const fetchData = async () => {
    const res = await axiosInstance.get<ResponseSuccess<User[]>>("/users");
    setData(res.data.data);
  };

  const setStatus = async (id: string) => {
    try {
      if (pendingStatus) return;
      makeToast("info");
      setPendingStatus(true);
      const res = await axiosInstance.patch<ResponseSuccess<User>>(
        "/users" + id
      );
      await fetchData();
      makeToast("success", res.data.message);
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPendingStatus(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, setStatus };
};

export default AuthPage(UserPage);
