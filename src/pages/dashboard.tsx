import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Auction } from "~/models/Auction";
import { User } from "~/models/User";
import { Withdraw } from "~/models/Withdraw";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import {
  MdCurrencyExchange,
  MdHistory,
  MdMoney,
  MdPending,
  MdPendingActions,
  MdPerson,
} from "react-icons/md";
import { formatRupiah } from "../helper/formatRupiah";

const DashboardPage = () => {
  const {
    activeUser,
    pendingAuction,
    pendingWithdrawal,
    pendingAmountWithdrawal,
    paidAmountWithdrawal,
    acceptedAuction,
  } = useDashboard();
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">{activeUser.length}</h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdPerson /> Active User
          </p>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">
            {pendingWithdrawal.length}
          </h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdCurrencyExchange /> Pending Withdrawal
          </p>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">
            {formatRupiah(pendingAmountWithdrawal)}
          </h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdPendingActions /> Pending Amount Withdrawal
          </p>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">
            {formatRupiah(paidAmountWithdrawal)}
          </h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdMoney /> Total Fee Auction
          </p>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">{pendingAuction.length}</h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdPending /> Need Approval Auction
          </p>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold mb-12">{acceptedAuction.length}</h2>
          <p className="text-gray-600 flex flex-row gap-2 items-center">
            <MdHistory /> Total Accepted Auction
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

const useDashboard = () => {
  const [user, setUser] = useState<User[]>([]);
  const [auction, setAuction] = useState<Auction[]>([]);
  const [withdrawal, setWithdrawal] = useState<Withdraw[]>([]);

  const fetchUser = async () => {
    const res = await axiosInstance.get<ResponseSuccess<User[]>>("/users");
    setUser(res.data.data);
  };
  const fetchAuction = async () => {
    const res = await axiosInstance.get<ResponseSuccess<Auction[]>>(
      "/auctions"
    );
    setAuction(res.data.data);
  };
  const fetchWithdrawal = async () => {
    const res = await axiosInstance.get<ResponseSuccess<Withdraw[]>>(
      "/withdraws"
    );
    setWithdrawal(res.data.data);
  };

  useEffect(() => {
    fetchUser();
    fetchAuction();
    fetchWithdrawal();
  }, []);

  const pendingAuction = auction.filter((a) => a.status === "Pending");
  const acceptedAuction = auction.filter((a) => a.status === "Accepted");
  const pendingWithdrawal = withdrawal.filter((w) => w.status === "Pending");
  const pendingAmountWithdrawal = pendingWithdrawal.reduce(
    (acc, w) => acc + w.amount,
    0
  );
  const paidAmountWithdrawal = withdrawal
    .filter((w) => w.status === "Paid")
    .reduce((acc, w) => acc + w.amount, 0);
  const activeUser = user.filter((u) => u.banned === false);

  return {
    user,
    auction,
    withdrawal,
    pendingAuction,
    pendingWithdrawal,
    activeUser,
    pendingAmountWithdrawal,
    paidAmountWithdrawal,
    acceptedAuction,
  };
};

export default AuthPage(DashboardPage);
