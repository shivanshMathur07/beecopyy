"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import { authService } from "@/lib/services/authService";
import applyJob from "../../utils/applyJob";
import useQueryParams from "@/hooks/useQueryParams";
import addPost from "@/utils/addCode";
import { useAppDispatch } from "@/store/hooks";
import { newjob } from "@/store/reducers/jobSlice";
import { toast } from "@/hooks/use-toast";
import Sidebar from "../layout/sidebar";
import { useMediaQuery } from "react-responsive";
import { Program } from "@/types";

type AuthMode = "login" | "register";
type UserType = "user" | "recruiter";
type Country = "UK" | "CA" | "US" | "AU" | "Europe";

interface FormData {
  name: string;
  email: string;
  profileLink: string;
  country: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  phoneNumber: string;
  description: string;
}

function validateLinkedInUrl(url: string): boolean {
  const regex =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?(?:\?.*)?$/;
  return regex.test(url);
}

export default function RecruiterAuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("recruiter");
  const [country, setCountry] = useState<Country>("UK");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    profileLink: "",
    country: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: "",
    phoneNumber: "",
    description: "",
  });

  const [error, setError] = useState<string>("");
  const [validLinked, setValidLinkedin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState(false);

  const { fromPostJob } = useQueryParams() as { fromPostJob?: string };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        let isValidLinkedin = validateLinkedInUrl(formData.profileLink);
        if (!isValidLinkedin) return setValidLinkedin(isValidLinkedin);
        const { data, user, success } = await authService.register({
          ...formData,
          userType,
          country,
        });

        if (success) {
          if (fromPostJob === "true") {
            let postJobDataString = localStorage.getItem("postJobData");
            let postJobData = postJobDataString
              ? JSON.parse(postJobDataString)
              : {};
            postJobData.recruiter = data.id;

            let jobPostRes = await dispatch(newjob(postJobData));

            if (jobPostRes.payload.data.status) {
              setRedirecting(true);
              toast({
                title: "Successfully added the job!",
                variant: "success",
              });
              localStorage.removeItem("postJobData");
            } else {
              toast({
                title: "Failed to post the job!",
                variant: "success",
              });
            }

            localStorage.removeItem("postJobData");

            if (user?.isEmailVerified !== true) {
              setRedirecting(true);

              setTimeout(() => {
                return router.push(`/verifyEmail?email=${user.email}`);
              }, 3000);
            } else {
              return router.push("/login");
            }
          } else {
            if (user?.isEmailVerified !== true) {
              return router.push(`/verifyEmail?email=${user.email}`);
            } else {
              return router.push("/login");
            }
          }
        }
      } else {
        const data = await authService.login({
          ...formData,
          userType,
        });

        if (data.success) {
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userData", JSON.stringify(data.user));
            localStorage.setItem("userType", userType);
          }

          if (fromPostJob === "true") {
            let postJobDataString = localStorage.getItem("postJobData");
            let postJobData = postJobDataString
              ? JSON.parse(postJobDataString)
              : {};
            postJobData.recruiter = data?.user?.id;

            let jobPostRes = await dispatch(newjob(postJobData));

            if (jobPostRes.payload.status) {
              setRedirecting(true);

              toast({
                title: "Successfully added the job!",
                variant: "success",
              });
              localStorage.removeItem("postJobData");
            } else {
              toast({
                title: "Failed to post the job!",
                variant: "success",
              });
            }

            setTimeout(() => {
              if (data?.user?.isEmailVerified !== true) {
                return router.push(`/verifyEmail?email=${data?.user.email}`);
              } else {
                if (data.token) {
                  return (window.location.href = "/");
                }
              }
            }, 3000);
          } else {
            if (data?.user?.isEmailVerified !== true) {
              return router.push(`/verifyEmail?email=${data?.user.email}`);
            } else {
              if (data.token) {
                return (window.location.href = "/");
              }
            }
          }
        }
      }
    } catch (error: any) {
      setError(
        error.error ||
          error.message ||
          error.data.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const gotoResetPass = () => {
    router.push("/forgotPass");
  };

  const changeProfileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, profileLink: val });
    setValidLinkedin(validateLinkedInUrl(val));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (redirecting) {
    return <p className="text-green text-center">Redirecting...</p>;
  }

  const isMobile = useMediaQuery({ maxWidth: 768 });
  let onSelectProgram = (program: Program) => {
    window.location.assign(`/?programId=${program._id}`);
  };

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
                {mode === "login" ? "Login" : "Register"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* <Select
                value={userType}
                onValueChange={(value: "user" | "recruiter") => setUserType(value)}
              >
                <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select> */}

                {mode === "register" && (
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                )}

                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />

                {mode === "login" && (
                  <Button
                    variant="link"
                    onClick={gotoResetPass}
                    className="text-blue-500 hover:text-blue-600 pt-0 m-[0px]"
                    style={{ marginTop: 0, paddingLeft: 5 }}
                  >
                    Forgot Password?
                  </Button>
                )}

                {mode === "register" && (
                  <>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                    />
                    <Select
                      value={country}
                      onValueChange={(
                        value: "UK" | "CA" | "US" | "AU" | "Europe"
                      ) => setCountry(value)}
                    >
                      <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="AU">AU</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Profile Link"
                      value={formData.profileLink}
                      onChange={changeProfileInput}
                      required
                      className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                    />

                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}
                    {userType === "recruiter" && (
                      <>
                        <Input
                          placeholder="Company Name"
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyName: e.target.value,
                            })
                          }
                          required
                          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                        />
                        <Input
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                          required
                          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                        />
                        <Input
                          placeholder="Company Website"
                          value={formData.companyWebsite}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyWebsite: e.target.value,
                            })
                          }
                          required
                          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                        />
                        <Input
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          required
                          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                        />
                      </>
                    )}
                  </>
                )}

                {!validLinked && (
                  <div className="text-red-500 text-sm text-center">
                    Please enter a valid linkedin url
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF] text-white"
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : mode === "login"
                    ? "Login"
                    : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-blue-500 hover:text-blue-600"
              >
                {mode === "login"
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
