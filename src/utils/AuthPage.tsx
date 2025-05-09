import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ResponseFail } from "~/models/Response";
import axios from "axios";
import { makeToast } from "./makeToast";

const AuthPage = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent = (props: Record<string, unknown>) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (router.isReady) {
        const fetchData = async () => {
          const path = router.asPath;
          const accessToken = Cookies.get("ACCESS_TOKEN");
          if (!accessToken) {
            router.push(`/login?redirect=${path}`);
            makeToast("error", "Please login first!");
            return;
          }
          try {
            await axios.get("/api/check-auth", {
              params: {
                auth: accessToken,
              },
            });
            setLoading(false);
          } catch (error) {
            console.log(error);
            const err = error as ResponseFail;
            makeToast("error", "You are not authorized to access this page!");
            if (err?.status === 401) {
              router.push(`/login?redirect=${path}`);
            }
          }
        };

        fetchData();
      }
    }, [router]);

    if (loading) {
      return (
        <div className="flex h-screen w-screens items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    return (
      <>
        <WrappedComponent {...props} />
      </>
    );
  };

  return WithAuthComponent;
};

export default AuthPage;
