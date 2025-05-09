import Image from "next/image";
import { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { ResponseSuccess } from "~/models/Response";
import Cookies from "js-cookie";
import { makeToast } from "~/utils/makeToast";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { form, handleLogin, onChange } = useLogin();
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative">
      <Image
        src="/images/bg.jpg"
        alt="bg"
        width={1920}
        height={1080}
        className="fixed top-0 left-0 z-[-1] w-full h-full object-cover"
      />
      <form
        className="border border-gray-200 p-4 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-md bg-white"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold self-start">Dashboard Login</h2>
        <input
          type="email"
          placeholder="admin@example.com"
          className="p-2 border border-gray-200 rounded-md "
          value={form.email}
          onChange={(e) => onChange(e, "email")}
        />
        <input
          type="password"
          placeholder="*********"
          className="p-2 border border-gray-200 rounded"
          value={form.password}
          onChange={(e) => onChange(e, "password")}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md cursor-pointer"
        >
          Login
        </button>
        <p className="text-center text-gray-500 text-xs">
          HypeBid Copyright &copy; 2025 All rights reserved.
        </p>
      </form>
    </div>
  );
};

interface LoginDTO {
  email: string;
  password: string;
}

const initLoginDTO: LoginDTO = {
  email: "",
  password: "",
};

const useLogin = () => {
  const [form, setForm] = useState<LoginDTO>(initLoginDTO);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof LoginDTO
  ) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };
  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log(form);
      if (form.email === "" || form.password === "") {
        makeToast("error", "Please fill all the fields!");
        return
      }      
      if (loading) return;
      makeToast("info");
      setLoading(true);
      const { data } = await axiosInstance.post<
        ResponseSuccess<{ accessToken: string }>
      >("/account/login", form);
      Cookies.set("ACCESS_TOKEN", data.data.accessToken);
      makeToast("success", data.message);
      router.push("/dashboard");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setLoading(false);
    }
  };
  return { onChange, handleLogin, form };
};

export default LoginPage;
