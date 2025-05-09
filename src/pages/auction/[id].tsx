import { useEffect, useState } from "react";
import { Auction } from "~/models/Auction";
import axiosInstance from "../../config/axiosInstance";
import { useRouter } from "next/router";
import { ResponseSuccess } from "~/models/Response";
import { AxiosError } from "axios";
import DashboardLayout from "~/components/layout/DashboardLayout";
import LoadingPage from "~/components/LoadingPage";
import { formatDate } from "../../helper/formatDate";
import { formatRupiah } from "../../helper/formatRupiah";
import Image from "next/image";
import { makeToast } from "~/utils/makeToast";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { MdEmail, MdWhatsapp } from "react-icons/md";

const DetailAuctionPage = () => {
  const { data, setStatus } = useAuction();

  if (!data) {
    return <LoadingPage />;
  }

  return (
    <DashboardLayout title="Detail Auction">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-2/3 bg-neutral-50 p-4 rounded-lg">
          <div className="flex flex-wrap flex-row gap-4">
            {data.images.map((image, index) => (
              <Image
                src={image}
                width={500}
                height={500}
                key={index}
                alt=""
                className="object-cover w-auto h-40"
              />
            ))}
          </div>
          <h3 className="text-2xl font-bold">Product</h3>
          <div className="relative overflow-x-auto mb-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Name</td>
                  <td className="px-6 py-4">{data.name}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Category</td>
                  <td className="px-6 py-4">{data.category}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Description</td>
                  <td className="px-6 py-4">{data.description}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Location</td>
                  <td className="px-6 py-4">{data.location}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-bold">Procedure</h3>
          <div className="relative overflow-x-auto mb-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Opening Price</td>
                  <td className="px-6 py-4">
                    {formatRupiah(data.openingPrice)}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Minimum Increment</td>
                  <td className="px-6 py-4">{formatRupiah(data.minimumBid)}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Buy Now Price</td>
                  <td className="px-6 py-4">
                    {formatRupiah(data.buyNowPrice)}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Start Date</td>
                  <td className="px-6 py-4">{formatDate(data.start, true)}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">End Date</td>
                  <td className="px-6 py-4">{formatDate(data.end, true)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-bold">History Bid</h3>
          <div className="relative overflow-x-auto mb-4">
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
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.bids.map((item, index) => (
                  <tr
                    className="bg-white border-b border-gray-200"
                    key={item.id}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Image
                        src={item.user.image || "/images/profile.png"}
                        alt=""
                        width={400}
                        height={400}
                        className="min-w-16 min-h-16 w-16 h-16 rounded-full object-cover"
                      />
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.user.name}
                    </th>
                    <td className="px-6 py-4">{formatRupiah(item.amount)}</td>
                    <td className="px-6 py-4 text-start">
                      {formatDate(item.createdAt, true, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-1/3 bg-neutral-50 p-4 rounded-lg">
          <h3 className="text-2xl font-bold">About Auction</h3>
          <div className="relative overflow-x-auto mb-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Status</td>
                  <td className="px-6 py-4">{data.status}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Created At</td>
                  <td className="px-6 py-4">
                    {formatDate(data.createdAt, true)}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Phone</td>
                  <td className="px-6 py-4">+{data.seller.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {data.status === "Pending" && (
            <div className="flex flex-row gap-4 items-center -mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer"
                onClick={() => setStatus(true)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer"
                onClick={() => setStatus(false)}
              >
                Reject
              </button>
            </div>
          )}
          <h3 className="text-2xl font-bold flex flex-row items-center gap-2">
            About Seller{" "}            
          </h3>
          <div className="relative overflow-x-auto mb-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Name</td>
                  <td className="px-6 py-4">{data.seller.name}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Email</td>
                  <td className="px-6 py-4">{data.seller.email}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Phone</td>
                  <td className="px-6 py-4">+{data.seller.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-bold flex flex-row items-center gap-2">
            Transaction{" "}
            {data.transaction && (
              <Link href={`/transaction/${data.transaction.id}`}>
                {" "}
                <FiExternalLink className="w-6 h-6 cursor-pointer" />
              </Link>
            )}
          </h3>
          {data.transaction ? (
            <div className="relative overflow-x-auto mb-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <tbody>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Buyer Name</td>
                    <td className="px-6 py-4 flex flex-row items-center gap-2">
                      {data.transaction?.buyer.name}                      
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Buyer Email</td>
                    <td className="px-6 py-4 flex flex-row items-center gap-2" >
                      {data.transaction?.buyer.email}
                      <Link href={`mailto:${data.transaction?.buyer.email}`} target="_blank">
                        <MdEmail className="w-4 h-4 cursor-pointer" />
                      </Link>
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Buyer Phone</td>
                    <td className="px-6 py-4 flex flex-row items-center gap-2">
                      +{data.transaction?.buyer.phone}
                      <Link href={`https://wa.me/${data.transaction?.buyer.phone}`} target="_blank">
                        <MdWhatsapp className="w-4 h-4 cursor-pointer" />
                      </Link>
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Buyer Location</td>
                    <td className="px-6 py-4">
                      {data.transaction?.location || "Not inputted yet"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Status</td>
                    <td className="px-6 py-4">{data.transaction?.status}</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Amount</td>
                    <td className="px-6 py-4">
                      {formatRupiah(data.transaction?.amount)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Received by Seller</td>
                    <td className="px-6 py-4">
                      {formatRupiah(data.transaction?.amount * 100 / 105)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold">Fee</td>
                    <td className="px-6 py-4">
                      {formatRupiah(data.transaction?.amount * 5 / 105)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">No information yet</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const useAuction = () => {
  const [data, setData] = useState<Auction>();
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResponseSuccess<Auction>>(
        `/auctions/${router.query.id}`
      );
      setData(res.data.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        router.push("/auction");
      }
    }
  };

  const setStatus = async (status: boolean) => {
    try {
      if (pendingStatus) return;
      setPendingStatus(true);
      makeToast("info");
      const res = await axiosInstance.patch<ResponseSuccess<Auction>>(
        `/auctions/${router.query.id}`,
        { status }
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
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  return { data, setStatus };
};

export default DetailAuctionPage;
