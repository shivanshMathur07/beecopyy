"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MapPin,
  DollarSign,
  CalendarDays,
  Users,
  Trophy,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchJobs } from "@/store/reducers/jobSlice";
import { format } from "date-fns";
import { fetchRecruiters } from "@/store/reducers/recruiterSlice";
import Sidebar from "@/components/layout/sidebar";
import { useMediaQuery } from "react-responsive";
import { ApplyJobDialog } from "@/components/dialog/applyjob-dialog";
import { Program } from "@/types";

export default function Jobs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showApplyJob, setShowApplyJob] = useState(false);

  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { items, loading, error } = useAppSelector((state) => state.jobs);
  const recruiterItems = useAppSelector((state) => state.recruiters);

  const [expandedJobs, setExpandedJobs] = useState<(string | number)[]>([]);

  const toggleJobDescription = (jobId: string | number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    dispatch(fetchJobs()).catch((err) => console.error("Fetch failed", err));
    dispatch(fetchRecruiters());
  }, [dispatch]);

  const companies = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((job) => job.company))).sort();
  }, [items]);

  const locations = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((job) => job.jobLocation))).sort();
  }, [items]);

  const filteredJobs = useMemo(() => {
    if (!items) return [];
    return items.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany =
        selectedCompany === "" || job.company === selectedCompany;
      const matchesLocation =
        selectedLocation === "" || job.jobLocation === selectedLocation;
      return matchesSearch && matchesCompany && matchesLocation;
    });
  }, [items, searchTerm, selectedCompany, selectedLocation]);

  const pageSize = 10;
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedLocation("");
  };

  const filteredRecruiters =
    selectedLocation === ""
      ? recruiterItems.items
      : recruiterItems.items.filter((c) => c.country === selectedLocation);

      let onSelectProgram = (program: Program) => {
        window.location.assign(`/?programId=${program._id}`);
      }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isMobile && <Sidebar isSidebarOpen={isSidebarOpen} onSelectProgram={onSelectProgram} onCloseSidebar={() => {
              setIsSidebarOpen(false);
            }} />}

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
                  Recruiters
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredRecruiters?.map((recruiter, index) => (
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 xl:p-8" style={{ paddingTop: 0 }}>
              <div className="mx-auto">
                <h1 className="text-3xl font-bold mb-1">Job Opportunities</h1>
                <p className="text-gray-600 mb-6">
                  Find your next role in tech
                </p>

                {/* Filters at the Top */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="border rounded px-4 py-2 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    className="border rounded px-4 py-2 w-full sm:w-48"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations?.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border rounded px-4 py-2 w-full sm:w-48"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">All Companies</option>
                    {companies?.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>

                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>

                {/* Pagination Top */}
                <div className="flex justify-center items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft width={15} />
                    <span className="text-gray-500">Previous</span>
                  </Button>
                  <Button size="sm" className="bg-blue-500 text-white px-4">
                    {page}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    <span className="text-gray-500">Next</span>
                    <ChevronRight width={15} />
                  </Button>
                </div>

                {/* Loading / Error States */}
                {loading && (
                  <p className="text-center text-gray-600">Loading jobs...</p>
                )}
                {error && (
                  <p className="text-center text-red-600">
                    Error loading jobs: {error.toString()}
                  </p>
                )}

                {/* Job Cards */}
                <div className="space-y-4">
                  {paginatedJobs.length === 0 && !loading && (
                    <p className="text-center text-gray-600">No jobs found.</p>
                  )}
                  {paginatedJobs.map((job, index) => (
                    <div
                      key={job?.id ?? index}
                      className="border rounded-xl p-6 shadow-sm relative bg-white flex flex-col md:flex-row items-start sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-8 w-full">
                        <div className="flex-shrink-0 basis-2/12">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-20 w-20 text-gray-500 bg-gray-100 rounded-md p-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 4h6a2 2 0 002-2v-1H7v1a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="text-lg text-black py-2">
                            {job?.company}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {job?.recruiter}
                          </div>
                        </div>

                        <div className="flex-grow basis-6/12">
                          <h2 className="text-lg font-semibold">
                            {job?.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1 mb-6">
                            <span className="flex items-center p-1 rounded-md border text-xs">
                              <MapPin width={16} />
                              {job.jobLocation}
                            </span>
                            <span className="flex items-center p-1 rounded-md border text-xs">
                              <DollarSign width={16} /> {job.salary}
                            </span>
                            <span className="flex items-center p-1 rounded-md border text-xs">
                              <CalendarDays width={16} /> Deadline{" "}
                              {format(new Date(job?.deadline), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm max-w-xl">
                            {expandedJobs.includes(index)
                              ? job.description
                              : job.description?.length > 100
                              ? `${job.description.slice(0, 100)}...`
                              : job.description}
                          </p>
                          <div className="mt-2">
                            <button
                              className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                              onClick={() => toggleJobDescription(index)}
                            >
                              {expandedJobs.includes(index) ? (
                                <>
                                  <ChevronUp width={20} /> Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown width={20} /> Show More Details
                                </>
                              )}
                            </button>

                            <br />
                            <br />
                            <br />
                          </div>
                        </div>
                      </div>

                      {new Date(job?.deadline) < new Date() && (
                        <span className="absolute top-2 md:top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                          ⏱ Expired
                        </span>
                      )}

                      <div className="absolute right-6 bottom-4">
                        <Button
                          onClick={() => setShowApplyJob(true)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Apply Job
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Bottom */}
                <div className="flex justify-center items-center gap-4 my-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft width={15} />
                    <span className="text-gray-500">Previous</span>
                  </Button>
                  <Button size="sm" className="bg-blue-500 text-white px-4">
                    {page}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    <span className="text-gray-500">Next</span>
                    <ChevronRight width={15} />
                  </Button>
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
                  Recruiters
                </h2>
                <ol className="space-y-4" style={{ scrollBehavior: "smooth" }}>
                  {filteredRecruiters?.map((recruiter, index) => (
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
      <ApplyJobDialog open={showApplyJob} onOpenChange={setShowApplyJob} />
    </div>
  );
}
