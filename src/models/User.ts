import { Auction } from "./Auction";
import { Bid } from "./Bid";
import { Transaction } from "./Transaction";
import { Withdraw } from "./Withdraw";

export type KycStatus = "Pending" | "Accepted" | "Rejected";

export interface Kyc {
  id: string;
  userId: string;
  image: string;
  status: KycStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  balance: number;
  disburbedBalance: number;
  pendingBalance: number;
  image: string | null;
  banned: boolean;
  bids: Bid[];
  auctions: Auction[];
  withdraws: Withdraw[];
  transactions: Transaction[];
  kycs: Kyc[];
  kyc: Kyc | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = "Admin" | "User";
