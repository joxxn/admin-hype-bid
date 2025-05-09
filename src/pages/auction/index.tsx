import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Auction, AuctionStatus } from "~/models/Auction";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../../helper/formatDate";

const AuctionPage = () => {
  const { data, getColorStatus } = useAuctions();

  return (
    <DashboardLayout title="Auction">
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
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Posted By
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
                    src={item.images[0] || "/images/placeholder.jpg"}
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
                  {item.category}
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
                  {item.seller.name} at {formatDate(item.createdAt, true)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/auction/${item.id}`}
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

const useAuctions = () => {
  const [data, setData] = useState<Auction[]>([]);

  const fetchData = async () => {
    const res = await axiosInstance.get<ResponseSuccess<Auction[]>>(
      "/auctions"
    );
    setData(res.data.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getColorStatus = (status: AuctionStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return { data, getColorStatus };
};

export default AuthPage(AuctionPage);
