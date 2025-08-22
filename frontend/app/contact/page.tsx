"use client";

import { useState } from "react";
import { MessageCircle, Send, Headset } from "lucide-react"; // Added Headset icon
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import Sidebar from "@/components/layout/sidebar";

export default function Contact() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {isMobile && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => {
              setIsSidebarOpen(false);
            }}
          />
        )}

        <main className="max-w-7xl mx-auto px-6 pt-16  md:px-12 lg:px-24">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10">
            {/* Left side - Support Icon Illustration */}
            <div
              style={{
                background:
                  "linear-gradient(to bottom, #0284DA,rgb(14, 149, 246))",
              }}
              className="relative  flex flex-col items-center justify-center p-12 md:p-20 text-white"
            >
              {/* Big Support Icon */}
              <Headset className="w-28 h-28 mb-8 opacity-90" />
              <h2 className="text-4xl font-bold mb-4 text-center">
                Need Help?
              </h2>
              <p className="max-w-xs text-center text-blue-100 text-lg leading-relaxed">
                Our support team is here to assist you. Send us a message and
                we’ll get back promptly.
              </p>
            </div>

            {/* Right side - Contact Form */}
            <section className="p-5 md:p-6 flex flex-col justify-center">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-14 h-14 mx-auto mb-4 shadow-inner">
                  <MessageCircle color="rgb(2 132 218)" className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Connect With Us
                </h1>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Have a question or feedback? {"We'd"} love to hear from you!
                  Fill out the form and we will get back to you.
                </p>
              </div>

              <form className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Name
                  </label> */}
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    {/* <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Email
                  </label> */}
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    {/* <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Subject
                  </label> */}
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Message subject"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    {/* <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Category
                  </label> */}
                    <Select name="category">
                      <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  {/* <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Message
                </label> */}
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                  />
                </div>

                {/* CAPTCHA */}
                <div style={{ display: "none" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <p className="text-xs text-red-600 mb-2 font-semibold">
                      This reCAPTCHA is for testing purposes only. Please report
                      to the site admin if you are seeing this.
                    </p>
                    <div className="bg-white h-16 flex items-center justify-center rounded-md text-sm text-gray-500 shadow-inner border border-dashed border-gray-300">
                      [reCAPTCHA Placeholder]
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us prevent spam and automated submissions.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    style={{ backgroundColor: "rgb(2 132 218" }}
                    type="submit"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
