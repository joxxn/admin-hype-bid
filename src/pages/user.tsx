import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AuthPage from "~/utils/AuthPage";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Image from "next/image";
import { formatDate } from "../helper/formatDate";
import { User, Kyc, KycStatus } from "~/models/User";
import { makeToast } from "~/utils/makeToast";

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  kyc: Kyc | null;
  userId: string;
  onUpdateKyc: (userId: string, status: KycStatus) => Promise<void>;
}

const KycModal = ({ isOpen, onClose, kyc, userId, onUpdateKyc }: KycModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !kyc) return null;

  const handleUpdateKyc = async (status: KycStatus) => {
    setIsLoading(true);
    try {
      await onUpdateKyc(userId, status);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">KYC Verification</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* KYC Image */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">KYC Document Image</p>
            <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={kyc.image}
                alt="KYC Document"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* KYC Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-amber-600">{kyc.status}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Submitted At</p>
              <p className="font-semibold text-gray-800">
                {formatDate(kyc.createdAt, true)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleUpdateKyc("Rejected")}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="mr-2">✕</span> Reject
                </>
              )}
            </button>
            <button
              onClick={() => handleUpdateKyc("Accepted")}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="mr-2">✓</span> Accept
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getKycStatusBadge = (kycs: Kyc[] | undefined) => {
  if (!kycs || kycs.length === 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        No KYC
      </span>
    );
  }

  const latestKyc = kycs[0];

  switch (latestKyc.status) {
    case "Pending":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse" />
          Pending
        </span>
      );
    case "Accepted":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Accepted
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Unknown
        </span>
      );
  }
};

const UserPage = () => {
  const { data, updateKycStatus, refetch } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenKycModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateKyc = async (userId: string, status: KycStatus) => {
    await updateKycStatus(userId, status);
    refetch();
  };

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
                KYC Status
              </th>
              <th scope="col" className="px-6 py-3">
                Registered At
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const latestKyc = item.kycs?.[0];
              const isPending = latestKyc?.status === "Pending";

              return (
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
                      className={`${item.banned ? "bg-red-500" : "bg-green-500"
                        }  text-white text-center rounded-lg px-2 py-1`}
                    >
                      {item.banned ? "Banned" : "Active"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getKycStatusBadge(item.kycs)}
                      {isPending && (
                        <button
                          onClick={() => handleOpenKycModal(item)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Review
                        </button>
                      )}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* KYC Modal */}
      <KycModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        kyc={selectedUser?.kyc || null}
        userId={selectedUser?.id || ""}
        onUpdateKyc={handleUpdateKyc}
      />
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

  const updateKycStatus = async (userId: string, status: KycStatus) => {
    try {
      makeToast("info", "Updating KYC status...");
      const res = await axiosInstance.patch<ResponseSuccess<User>>(
        `/users/${userId}/kyc`,
        { status }
      );
      makeToast("success", res.data.message);
    } catch (error) {
      makeToast("error", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, setStatus, updateKycStatus, refetch: fetchData };
};

export default AuthPage(UserPage);
