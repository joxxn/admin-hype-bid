import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../helper/formatDate";
import { Transaction, TransactionStatus } from "~/models/Transaction";

const TransactionPage = () => {
  const { data, getColorStatus } = useTransactions();

  return (
    <DashboardLayout title="Transaction">
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
                Auction
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Issued Seller
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
                    src={item.buyer.image || "/images/profile.png"}
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
                  {item.buyer.name}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.auction.name}
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
                  <div className="max-w-20">
                    {item.auction.seller.name} at {formatDate(item.createdAt, true)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/auction/${item.auction.id}`}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

const useTransactions = () => {
  const [data, setData] = useState<Transaction[]>([]);

  const fetchData = async () => {
    const res = await axiosInstance.get<ResponseSuccess<Transaction[]>>(
      "/transactions"
    );
    setData(res.data.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getColorStatus = (status: TransactionStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";
      case "Completed":
        return "bg-black";
      case "Delivered":
        return "bg-blue-500";
      case "Paid":
        return "bg-green-500";
      case "Expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return { data, getColorStatus };
};

export default AuthPage(TransactionPage);
