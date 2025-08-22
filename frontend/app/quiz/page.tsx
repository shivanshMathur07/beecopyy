"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trophy, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import QuizDialog from "@/components/dialog/quiz-dialog";
import { useMediaQuery } from "react-responsive";
import Sidebar from "@/components/layout/sidebar";
import { Program } from "@/types";

interface Scorer {
  id: string;
  name: string;
  score: number;
  country: string;
  contributions?: string;
}

const mockScorers: Scorer[] = [
  { id: "1", name: "Justin Owens", score: 0, country: "UK" },
  { id: "2", name: "William John", score: 0, country: "UK" },
  { id: "3", name: "James Anderson", score: 0, country: "US" },
  { id: "4", name: "Michael Roberts", score: 0, country: "AU" },
  { id: "5", name: "David Smith", score: 0, country: "Europe" },
];

export default function Quiz() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const filteredScorers =
    selectedCountry === "all"
      ? mockScorers
      : mockScorers.filter((s) => s.country === selectedCountry);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleContentClick = () => {
    // Implementation of handleContentClick
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let onSelectProgram = (program: Program) => {
    window.location.assign(`/?programId=${program._id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
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

      <div className="pt-20 bg-[#F5F5F5]">
        <div className="flex flex-col w-full relative min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col lg:flex-row flex-1">
            {/* Left Sidebar Placeholder */}
            <aside className="lg:w-1/6 w-full  p-6 hidden lg:block">
              <div
                style={{
                  width: "15%",
                  marginTop: "20px",
                }}
                className={`
            fixed xl:fixed inset-y-0 left-0 z-40 overflow-y-auto
            w-42 border border-gray-200 rounded-md
            transform transition-transform duration-300 ease-in-out 
            top-16 xl:top-16
            xl:left-5
            p-6
            h-[calc(100vh-3rem)]
            shadow-md
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full xl:translate-x-0"
            }
          `}
              >
                <h2 className="text-l font-semibold flex items-center mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> Top 100
                  Quiz Rankers
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredScorers?.map((recruiter, index) => (
                    <li
                      style={{ maxWidth: "180px" }}
                      key={index}
                      className="flex items-center space-x-3 space-y-2"
                    >
                      <div className="w-1/5 p-2 bg-blue-100 text-blue-600 text-sm font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>

                      <div className="w-4/5">
                        <p className="font-medium text-sm w-full">
                          {recruiter?.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" />{" "}
                          {recruiter?.contributions} rank
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 xl:p-8" style={{ paddingTop: 0 }}>
              <div className="mx-auto">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-3xl font-bold">Quiz Dashboard</h1>
                      <p className="text-gray-500">
                        Challenge friends or practice your knowledge
                      </p>
                    </div>
                    <Button
                      style={{
                        backgroundColor:
                          "rgb(2 132 218 / var(--tw-bg-opacity))",
                      }}
                      className="bg-blue-500 hover:bg-blue-500"
                      onClick={() => setOpen(true)}
                    >
                      <span className="mr-2">
                        <PlusCircle width={15} />
                      </span>
                      Create Quiz
                    </Button>
                  </div>

                  <Tabs defaultValue="my-quizzes" className="mb-6">
                    <TabsList className="w-full bg-gray-100">
                      <TabsTrigger
                        value="my-quizzes"
                        className="flex-1 text-xs"
                      >
                        <Trophy width={15} className="mr-1" /> My Quizzes
                      </TabsTrigger>
                      <TabsTrigger value="invited" className="flex-1 text-xs">
                        <Users width={15} className="mr-1" /> Invited Quizzes
                      </TabsTrigger>
                      <TabsTrigger
                        value="invitations"
                        className="flex-1 text-xs"
                      >
                        <Bell width={15} className="mr-1" /> Invitations
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="border rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">No Quizzes</h2>
                    <p className="text-gray-500 mb-4">
                      You {"haven't"} created any quizzes yet
                    </p>
                    <Button
                      style={{
                        backgroundColor:
                          "rgb(2 132 218 / var(--tw-bg-opacity))",
                      }}
                      className="bg-blue-500 hover:bg-blue-500"
                      onClick={() => setOpen(true)}
                    >
                      <span className="mr-2 text-white">
                        <PlusCircle width={15} />
                      </span>
                      Create Your First Quiz
                    </Button>
                  </div>
                </div>

                <QuizDialog open={open} setOpen={setOpen} />
              </div>
            </main>
          </div>

          {isMobile && (
            <>
              <div
                className={`
                          overflow-y-auto
                          w-42 border border-gray-200 rounded-md
                          transform transition-transform duration-300 ease-in-out
                          p-6
                          h-[calc(100vh-3rem)]
                          shadow-md
                          $${
                            isSidebarOpen
                              ? "translate-x-0"
                              : "-translate-x-full xl:translate-x-0"
                          }
                        `}
              >
                <h2 className="text-l font-semibold flex items-center mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> Top 100
                  Quiz Scorers
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredScorers?.map((recruiter, index) => (
                    <li
                      style={{ maxWidth: "180px" }}
                      key={index}
                      className="flex items-center space-x-3 space-y-2"
                    >
                      <div className="w-1/5 p-2 bg-blue-100 text-blue-600 text-sm font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>

                      <div className="w-4/5">
                        <p className="font-medium text-sm w-full">
                          {recruiter?.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" />{" "}
                          {recruiter?.contributions} recruiters
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
