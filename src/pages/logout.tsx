import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect } from "react";
import LoadingPage from "~/components/LoadingPage";
const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      Cookies.remove("ACCESS_TOKEN");
      router.push("/login");
    }
  }, [router]);

  return <LoadingPage />;
};

export default LogoutPage;
