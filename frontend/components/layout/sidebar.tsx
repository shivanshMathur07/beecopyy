"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import Category from "@/components/sections/sidebar/category";
import DailyQuiz from "@/components/sections/sidebar/daily-quiz";
import Articles from "@/components/sections/sidebar/articles";
import { Button } from "../ui/button";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { Program } from "@/types";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import router from "next/router";
import { usePathname } from "next/navigation";

import { ApplyJobDialog } from "../dialog/applyjob-dialog";
import JobPostingDialog from "../dialog/jobposting-dialog";
import { fetchSettings } from "@/store/reducers/settingSlice";

interface SidebarProps {
  isSidebarOpen: boolean;
  expandedCategories: string[];
  toggleCategory: (name: string) => void;
  onSelectProgram: (program: Program) => void;
  onShowJobPosting: () => void;
  onShowApplyJob: () => void;
  onCloseSidebar?: () => void; // <-- added
}

const Sidebar = ({
  isSidebarOpen,
  onSelectProgram,
  onShowJobPosting,
  onShowApplyJob,
  onCloseSidebar,
}: SidebarProps) => {
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [programNotFound, setProgramNotFound] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPrograms());
    dispatch(fetchCategories());
    dispatch(fetchSettings());
  }, [dispatch]);

  const categoriesState = useAppSelector((state) => state.categories);
  const categories = categoriesState.items;
  const programsState = useAppSelector((state) => state.programs);
  const settingsState = useAppSelector((state) => state.settings);
  const programs = programsState.items;
  const settings = settingsState.item;

  const [postJobDialogOpen, setPostJobdialogOpen] = useState(false);
  const [applyJobDialogOpen, setApplyJobDialogOpen] = useState(false);

  // const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.length > 0 ? [categories[0].name] : []
  );

  // useEffect(() => {
  //   if (categories.length > 0 && expandedCategories.length === 0) {
  //     toggleCategory(categories[0]._id);
  //   }
  // }, [categories, expandedCategories, toggleCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      // Match programs by query
      const matchingPrograms = programs.filter((program) =>
        program.name.toLowerCase().includes(query.toLowerCase())
      );

      // Extract matching category names from those programs
      const matchingCategoryNames = Array.from(
        new Set(matchingPrograms.map((p) => p.category))
      );

      // Expand only matching categories
      matchingCategoryNames.forEach((categoryName) => {
        if (!expandedCategories.includes(categoryName)) {
          toggleCategory(categoryName);
        }
      });

      // Optionally: collapse non-matching categories
      expandedCategories.forEach((name) => {
        if (!matchingCategoryNames.includes(name)) {
          toggleCategory(name);
        }
      });
    }
  };

  return (
    <div
      className={`
        fixed xl:fixed inset-y-0 left-0  overflow-y-auto
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 z-30 ease-in-out 
        top-12 xl:top-12
        h-[calc(100vh-3rem)]
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }
      `}
    >
      {/* Mobile Top Tabs */}
      <ul className="xl:hidden flex flex-col justify-center space-y-1 p-4 pb-0">
        <li>
          <button
            onClick={() => {
              if (pathname === "/categories" && onCloseSidebar) {
                onCloseSidebar();
              } else {
                router.push("../../categories");
              }
            }}
            style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
            className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
          >
            Codes
          </button>
        </li>

        {settings?.isJobs && (
          <li>
            <button
              onClick={() => {
                if (pathname === "/jobs" && onCloseSidebar) {
                  onCloseSidebar();
                } else {
                  router.push("../../jobs");
                }
              }}
              style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
              className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
            >
              Jobs
            </button>
          </li>
        )}

        <li>
          <button
            onClick={() => {
              if (pathname === "/quiz" && onCloseSidebar) {
                onCloseSidebar();
              } else {
                router.push("../../quiz");
              }
            }}
            style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
            className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
          >
            Quiz
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              if (pathname === "/quiz" && onCloseSidebar) {
                onCloseSidebar();
              } else {
                router.push("../../quiz");
              }
            }}
            style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
            className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
          >
            Start Quiz
          </button>
        </li>

        {settings?.isApplyJob && (
          <li>
            <button
              onClick={() => setApplyJobDialogOpen((prev) => !prev)}
              style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
              className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
            >
              Apply Job
            </button>
          </li>
        )}

        {settings.isPostJob && (
          <li>
            <button
              onClick={() => setPostJobdialogOpen((prev) => !prev)}
              style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
              className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
            >
              Post Job
            </button>
          </li>
        )}

        <li>
          <button
            style={{ color: "rgb(2 132 218 / var(--tw-bg-opacity))" }}
            className="w-full text-white font-medium text-sm p-1 rounded-lg text-left"
            onClick={() => {
              if (pathname === "/contact" && onCloseSidebar) {
                onCloseSidebar();
              } else {
                router.push("../../contact");
              }
            }}
          >
            Contact Us
          </button>
        </li>
      </ul>

      {/* Search Input */}
      <div
        className={`${
          isMobile
            ? "pt-2 px-4 shrink-0"
            : "shrink-0 p-4 border-b border-gray-200"
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search programs..."
            className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      {programNotFound && (
        <p className="my-2 text-center text-gray-500">No Result found</p>
      )}
      {/* {programNotFound && (
        <div
          className={`${
            isMobile ? "max-h-[350px] min-h-[292px]" : "min-h-[300px]"
          }`}
        >
          <p className="my-2 text-center text-gray-500">No Result found</p>
        </div>
      )} */}

      <Category
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        onSelectProgram={onSelectProgram}
        searchQuery={searchQuery}
        setProgramNotFound={setProgramNotFound}
      />

      {!isMobile && (
        <>
          <div className="flex justify-center border-t border-gray-200 py-2">
            <button
              onClick={() => {
                router.push("/categories");
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-[#0284DA] outline-hidden bg-white hover:bg-white hover:text-[#0284FF]"
            >
              View All Programms
            </button>
          </div>
          <div className="px-4 flex flex-col gap-y-[11px]">
            <DailyQuiz router={router} />

            {settings?.isJobs && settings?.isPostJob && (
              <Articles
                router={router}
                onShowJobPosting={onShowJobPosting}
                onShowApplyJob={onShowApplyJob}
              />
            )}
          </div>
        </>
      )}

      <ApplyJobDialog
        open={applyJobDialogOpen}
        onOpenChange={setApplyJobDialogOpen}
      />
      <JobPostingDialog
        open={postJobDialogOpen}
        onOpenChange={setPostJobdialogOpen}
      />

      {/* Bottom Fixed Button */}

      {isMobile && (
        <>
          <div className="mt-auto border-t border-gray-200">
            <div className="flex justify-center">
              <Button
                className="w-full text-[#0284DA] outline-hidden bg-white hover:bg-white hover:text-[#0284FF]"
                onClick={() => window.location.assign("/categories")}
              >
                View All Programms
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
