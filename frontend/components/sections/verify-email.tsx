"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useQueryParams from "@/hooks/useQueryParams";
import { authService } from "@/lib/services/authService";

import Header from "@/components/layout/header";
import Sidebar from "../layout/sidebar";
import { useMediaQuery } from "react-responsive";
import { Program } from "@/types";

type resetMode = "sendEmail" | "verify" | "linkSent";

export default function VerifyEmail() {
  const [mode, setMode] = useState<resetMode>("sendEmail");
  const [formData, setFormData] = useState({
    email: "",
    code: 0,
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  let router = useRouter();

  const { token, email } = useQueryParams();

  useEffect(() => {
    if (token) {
      setIsRedirecting(true);
    }
    if (!token || !email) return;

    authService.verifyEmail({ email, token }).then((data) => {
      if (data) {
        let isEmailVerified = data?.data?.isEmailVerified;
        if (isEmailVerified) {
          router.push("/userauth");
        }
      }
    });
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "sendEmail") {
        if (!email) return;
        let data = await authService.sendVerificationEmail({ email });
        if (data) {
          setMode("linkSent");
        }
      }
    } catch (error) {
      console.log("err", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isMobile = useMediaQuery({ maxWidth: 768 });
  let onSelectProgram = (program: Program) => {
    window.location.assign(`/?programId=${program._id}`);
  };

  return (
    <>
      <Header isSidebarOpen={false} toggleSidebar={toggleSidebar} />

      {isMobile && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onSelectProgram={onSelectProgram}
          onCloseSidebar={() => {
            setIsSidebarOpen(false);
          }}
        />
      )}
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-[#0284DA]">
                Verify Your Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRedirecting && (
                <p className="text-green-500 text-center">Redirecting...</p>
              )}
              {!isRedirecting && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}
                  {mode === "linkSent" && (
                    <div className="text-green-500 text-sm text-center">
                      {"We've"} Sent a verification link to your email.
                    </div>
                  )}

                  {mode !== "linkSent" && (
                    <>
                      <Button
                        type="submit"
                        className="w-full w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF] text-white"
                        disabled={loading}
                      >
                        {loading
                          ? "Loading..."
                          : email && mode === "sendEmail" && "Send Verify Link"}
                      </Button>
                    </>
                  )}
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center"></CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
