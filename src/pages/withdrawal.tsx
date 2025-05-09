import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Image from "next/image";
import { formatDate } from "../helper/formatDate";
import { Withdraw, WithdrawStatus } from "~/models/Withdraw";
import { formatRupiah } from "../helper/formatRupiah";
import { makeToast } from "~/utils/makeToast";

const WithdrawPage = () => {
  const { data, getColorStatus, setAsPaid } = useWithdraws();

  return (
    <DashboardLayout title="Withdrawal">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Buyer
              </th>
              <th scope="col" className="px-6 py-3">
                Bank Account
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
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
                    src={item.user?.image || "/images/profile.png"}
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
                  {item.user.name}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  <div className="flex flex-col">
                    <div className="font-semibold">{item.bank}</div>
                    <div>{item.account}</div>
                  </div>
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {formatRupiah(item.amount)}
                </th>
                <td className="px-6 py-4">
                  <div
                    className={`${getColorStatus(
                      item.status
                    )} text-white text-center rounded-lg px-2 py-1`}
                  >
                    {item.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {formatDate(item.createdAt, true, true)}
                </td>
                <td className="px-6 py-4">
                  {item.status === "Pending" && (
                    <button
                      className="bg-blue-500 text-white rounded-lg px-2 py-1 cursor-pointer"
                      onClick={() => setAsPaid(item.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

const useWithdraws = () => {
  const [data, setData] = useState<Withdraw[]>([]);
  const [pendingPaid, setPendingPaid] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await axiosInstance.get<ResponseSuccess<Withdraw[]>>(
      "/withdraws"
    );
    setData(res.data.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getColorStatus = (status: WithdrawStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";
      case "Paid":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const setAsPaid = async (id: string) => {
    try {
      if (pendingPaid) return;
      makeToast("info");
      setPendingPaid(true);
      const res = await axiosInstance.patch<ResponseSuccess<Withdraw>>(
        `/withdraws/${id}`
      );
      await fetchData();
      makeToast("success", res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPendingPaid(false);
    }
  };

  return { data, getColorStatus, setAsPaid };
};

export default AuthPage(WithdrawPage);
