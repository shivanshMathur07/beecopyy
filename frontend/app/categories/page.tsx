"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Search, Menu, Trophy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CategorySidebar from "@/components/layout/category-sidebar";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { fetchContributors } from "@/store/reducers/contributorSlice";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "react-responsive";
import Sidebar from "@/components/layout/sidebar";

export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.categories);
  const programsState = useAppSelector((state) => state.programs);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [programNotFound, setProgramNotFound] = useState(false);
  const [displayPrograms, setDisplayPrograms] = useState([]);
  const { items, loading, error } = useAppSelector(
    (state) => state.contributors
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  useEffect(() => {
    if (isAuthenticated && user?.country) setSelectedCountry(user.country);
    else setSelectedCountry("all");
  }, [isAuthenticated, user]);

  // Filter contributors based on selected country
  const filteredContributors =
    selectedCountry === "all"
      ? items
      : items.filter((c) => c.country === selectedCountry);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPrograms());
    dispatch(fetchContributors());
  }, []);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [categories, setCategories] = useState(
    isMobile ? categoriesState.items.slice(0, 4) : categoriesState.items
  );

  const programs = programsState.items;

  useEffect(() => {
    if (categoriesState.items.length > 0) {
      setCategories(
        isMobile ? categoriesState.items.slice(0, 4) : categoriesState.items
      );
    }
  }, [categoriesState.items, isMobile]);

  // useEffect(() => {
  //   if(programsState.items.length > 0) {
  //     setDisplayPrograms(programsState.items)
  //   }
  // }, [programsState.items])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleContentClick = () => {
    // Implementation of handleContentClick
  };

  // useEffect(() => {
  //   if (selectedCategory) {
  //     let filteredPrograms = programs?.filter(program => program.category == selectedCategory)
  //     setDisplayPrograms(filteredPrograms)
  //   }
  // }, [selectedCategory])

  let handleSelectCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      let selectedCategoryObj = categories.filter(
        (cat) => cat._id === categoryId
      );
      let filteredPrograms =
        programs?.filter((program) => program.category == categoryId) || [];
      // console.log(programs.length, filteredPrograms.length, displayPrograms.length)
      setDisplayPrograms(filteredPrograms);

      setSelectedCategoryName(selectedCategoryObj[0].name);
    },
    [programs, selectedCategory, setDisplayPrograms]
  );

  let handleSearchPrograms = (query: string) => {
    if (query == "") {
      setProgramNotFound(false);
      let allCatsPrograms = programs.filter(
        (program) => program.category == selectedCategory
      );
      return setDisplayPrograms(allCatsPrograms);
    }

    let filteredPrograms;

    if (selectedCategory) {
      filteredPrograms = programs.filter(
        (program) =>
          program.category == selectedCategory &&
          program.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      filteredPrograms = programs.filter((program) =>
        program.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filteredPrograms.length === 0) {
      setProgramNotFound(true);
    } else {
      setProgramNotFound(false);
    }
    setDisplayPrograms(filteredPrograms);
  };

  let handleProgramClick = (programId: string) => {
    window.location.assign(`/?programId=${programId}`);
  };

  const handleCategorySearch = (searchValue: string) => {
    if (searchValue == "") {
      setCategoryNotFound(false);
      return setCategories(categoriesState.items);
    }
    // Handle category search here
    console.log(categories);
    let filteredCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setCategories(filteredCategories);
    if (filteredCategories.length === 0) {
      setCategoryNotFound(true);
    } else {
      setCategoryNotFound(false);
    }
  };

  const handleLoadMoreCategories = () => {
    setCategories(categoriesState.items);
    // Handle load more categories here
  };

  let onSelectProgram = (program: Program) => {
    window.location.assign(`/?programId=${program._id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isMobile && (
        <Sidebar
          onCloseSidebar={() => {
            setIsSidebarOpen(false);
          }}
          isSidebarOpen={isSidebarOpen}
          onSelectProgram={onSelectProgram}
        />
      )}

      <div className="pt-20 bg-[#F5F5F5]">
        <div className="flex flex-col w-full relative min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col lg:flex-row flex-1">
            {/* Left Sidebar Placeholder */}
            <aside className="lg:w-[15%] w-full hidden  p-6  lg:block">
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
                          $${
                            isSidebarOpen
                              ? "translate-x-0"
                              : "-translate-x-full xl:translate-x-0"
                          }
                        `}
              >
                <h2 className="text-l font-semibold flex items-center mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> Top 100
                  Contributors
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredContributors?.map((contributor, index) => (
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
                          {contributor?.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" />{" "}
                          {contributor?.contributions} Contributors
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
                <div className="" onClick={handleContentClick}>
                  <div className="max-w-full mx-auto space-y-8 pl-0 lg:pl-8">
                    {/* Categories Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                        <h2 className="text-3xl font-bold">
                          Programming Categories
                        </h2>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search categories..."
                            className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                            onChange={(e) =>
                              handleCategorySearch(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={`grid grid-cols-1 gap-4 ${
                          categoryNotFound
                            ? ""
                            : "  sm:grid-cols-2 lg:grid-cols-4 "
                        }`}
                      >
                        {categories?.map((category) => (
                          <div
                            key={category?.name}
                            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                              category._id === selectedCategory &&
                              "border-[#0284DA]"
                            }`}
                            style={{ borderWidth: 2 }}
                            onClick={() => handleSelectCategory(category._id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                                {category?.name?.[0]}
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {category?.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {category?.description}
                                </p>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        ))}

                        {categoryNotFound && (
                          <div className="bg-red-50 p-4 rounded-lg mb-4 text-center">
                            <p className="text-red-700">No category found</p>
                          </div>
                        )}
                      </div>
                      {/* <div> */}
                      <div className="sm:hidden">
                        <Button
                          className="mt-4 bg-[#0284DA] hover:bg-[#0284FF] text-white flex items-center justify-center space-x-2"
                          onClick={handleLoadMoreCategories}
                        >
                          <span>Load More</span>
                        </Button>
                      </div>
                    </div>

                    {/* Available Programs Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                        <h2 className="text-3xl font-bold">
                          Available Programs
                        </h2>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search programs..."
                            className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                            onChange={(e) =>
                              handleSearchPrograms(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* {selectedCategoryName && (
                        <>
                          <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
                            <p className="text-green-700">
                              Selected Category: {selectedCategoryName}
                            </p>
                          </div>
                        </>
                      )} */}

                      {programNotFound && (
                        <div className="bg-red-50 p-4 rounded-lg mb-4 text-center">
                          <p className="text-red-700">No Programs Found</p>
                        </div>
                      )}

                      {displayPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {displayPrograms.map((program) => (
                            <div
                              onClick={() => handleProgramClick(program?._id)}
                              key={program?._id}
                              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                                  {program?.name?.[0]}
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    {program?.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {program?.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {!programNotFound && (
                            <>
                              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-center">
                                <p className="text-blue-700">
                                  Please select a category to view its programs
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <div className="mt-4 text-center">
                        {/* <Button
                    className="mt-2 bg-[#0284DA] hover:bg-[#0284FF]"
                    size="sm"
                  >
                    Load More
                    <ChevronDown className="h-5 w-5 text-white" />
                  </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          {isMobile && (
            <>
              <div
                className={`
                          z-20 overflow-y-auto
                          w-42 border border-gray-200 rounded-md
                          transform transition-transform duration-300 ease-in-out 
                          top-16 xl:top-16F
                          xl:left-5
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
                  Contributors
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredContributors?.map((contributor, index) => (
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
                          {contributor?.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" />{" "}
                          {contributor?.contributions} Contributors
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
