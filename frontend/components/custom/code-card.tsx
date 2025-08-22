"use client";

import { Copy, Flag, ExternalLink, Lightbulb, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useRef, useEffect, useCallback } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import * as shiki from "shiki";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";

interface CodeCardProps {
  code: string;
  defaultCode: string;
  language: string;
  title: string;
  isDashboard: boolean;
  clickFunc: (lang: string) => void;
  copyCode: () => void;
  showDialog: (open: boolean) => void;
  copiedNumber: number;
  viewedNumber: number;
  sharedNumber: number;
  onShowFeedback: (type: "bug" | "suggestion") => void;
  hasButtons: boolean;
  bgColor: string;
  footerBgColor: string;
  fontSize: string;
}

const CodeCard = ({
  code,
  language,
  title,
  showDialog,
  clickFunc,
  isDashboard,
  copyCode,
  onShowFeedback,
  copiedNumber,
  viewedNumber,
  sharedNumber,
  defaultCode,
  hasButtons = true,
  bgColor,
  footerBgColor,
  fontSize,
}: CodeCardProps) => {
  const [mouseDownPosition, setMouseDownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };
  const isHomePage = pathname === "/";
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId") || null; // e.g., ?name=ikram

  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  const onShowCode = () => {
    clickFunc(language);
    showDialog(true);
  };
  const formatCode = (code: string) => {
    if (typeof code !== "string") return "";
    return code.replaceAll("    ", "  ");
  };
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Code cannot be copied from localhost");
      console.error("Failed to copy: ", err);
    }
    await copyCode();
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDashboard) {
      if (mouseDownPosition) {
        const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
        const deltaY = Math.abs(e.clientY - mouseDownPosition.y);

        // If the mouse hasn't moved more than 0 pixels, consider it a click
        if (deltaX < 1 && deltaY < 1) {
          const selection = window.getSelection();
          if (!selection || selection.toString().length === 0) {
            clickFunc(language);
            showDialog(true);
          }
        }

        setMouseDownPosition(null);
      }
    }
  };
  useEffect(() => {
    const highlight = async () => {
      const highlighter = await shiki.createHighlighter({
        themes: ["light-plus", "monokai"],
        langs: ["javascript", "python", "java", "html"],
      });

      const highlighted = highlighter.codeToHtml(formatCode(code), {
        lang: language,
        theme: isDashboard ? "monokai" : "light-plus",
      });
      setHighlightedCode(highlighted);
    };

    highlight();
  }, [code, language, isDashboard]);

  let handleShareClick = useCallback(
    async (e: any) => {
      if (!language && navigator.share === undefined) return;
      try {
        await navigator.share({
          title: "Check out this code",
          text: `${code}`,
          url: window.location.href,
        });

        console.log("code shared successfully");
      } catch (error) {
        console.log("error", error);
      }
    },
    [language, code]
  );

  if (programId !== null && code.length === 0) {
    return (
      <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
        <p className="text-green-700">Loading Code...</p>
      </div>
    );
  }
  return (
    <Card
      style={{ backgroundColor: isDashboard ? bgColor : "initial" }}
      className={`h-full hover:cursor-pointer shadow-lg lounded-lg ${
        isDashboard ? "bg-[" + bgColor + "]" : "bg-white"
      }`}
    >
      <CardHeader className="ps-2 pe-2 pt-0 pb-2 border-b border-[#c8c8c8] grid grid-cols-12 w-full">
        <div className="col-span-3 pt-2 justify-start w-full items-top">
          <span className={`${isDashboard ? "text-white" : "text-gray-500"}`}>
            {language.toString().slice(0, 1).toUpperCase() +
              language.toString().slice(1)}
          </span>
        </div>
        <div className="col-span-6 w-full pt-4 justify-center flex flex-wrap">
          <CardTitle
            className={`${
              isDashboard ? "text-white" : "text-gray-500"
            } text-lg md:text-1xl lg:text-2xl whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {title}
          </CardTitle>
        </div>

        {isDashboard && (
          <div className="col-span-3 flex flex-inline pt-2 justify-end w-full">
            <div className="flex space-x-2">
              <button className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <button className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <button className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
          </div>
        )}

        {!isDashboard && (
          <div
            className="col-span-3 flex"
            style={{ justifyContent: "end", alignItems: "flex-start" }}
          >
            {/* <div className="flex space-x-2">
            <button className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <button className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <button className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div> */}

            <div
              className="text-gray-800 text-md flex"
              style={{ columnGap: "11px" }}
            >
              <div
                className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600"
                style={{ columnGap: "3px" }}
              >
                <Eye className="w-4 h-4" /> {viewedNumber}
              </div>
              <div
                className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600"
                style={{ columnGap: "3px" }}
              >
                <Copy className="w-4 h-4" /> {copiedNumber}
              </div>
              <div
                className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600"
                style={{ columnGap: "3px" }}
              >
                <ExternalLink className="w-4 h-4" /> {sharedNumber}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 font-display">
        <ScrollArea
          ref={scrollAreaRef}
          className={
            "h-[200px] sm:h-[230px] lg:h-[230px] w-full p-4 text-sm md:text-md"
          }
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: code.length === 0 ? defaultCode : highlightedCode,
            }}
            className="shiki"
            style={{ backgroundColor: "transparent", fontSize: fontSize }}
          />
        </ScrollArea>
      </CardContent>
      <CardFooter
        style={{ backgroundColor: isDashboard ? footerBgColor : "initial" }}
        className={`${
          isDashboard ? "bg-[" + footerBgColor + "]" : "bg-white"
        } min-h-[50px] p-2 sm:p-4 border-t border-[#c8c8c8] relative flex items-center rounded-lg `}
      >
        {/* {!isDashboard && (
          <div
            className="grid grid-cols-6 text-gray-800 text-md gap-1"
            style={{ columnGap: "10px" }}
          >
            <div className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600" style={{columnGap: "3px"}}>
              <Eye className="w-4 h-4" /> {viewedNumber}
            </div>
            <div className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600" style={{columnGap: "3px"}}>
              <Copy className="w-4 h-4" /> {copiedNumber}
            </div>
            <div className="col-span-1 w-fit-content flex items-center transition-colors text-gray-600" style={{columnGap: "3px"}}>
              <ExternalLink className="w-4 h-4" /> {sharedNumber}
            </div>
          </div>
        )} */}

        {/* Centered group of buttons */}

        {hasButtons && (
          <>
            <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-4">
              <RadixTooltip.Provider>
                <RadixTooltip.Root open={copied}>
                  <RadixTooltip.Trigger asChild>
                    <button
                      className={`hover:text-gray-600 transition-colors ${
                        copied ? "text-gray-600" : "text-gray-400"
                      }`}
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </RadixTooltip.Trigger>
                  <RadixTooltip.Content
                    side="top"
                    sideOffset={5}
                    className="bg-black text-white px-2 py-1 rounded text-xs shadow-md animate-fadeIn"
                  >
                    Code copied
                    <RadixTooltip.Arrow className="fill-black" />
                  </RadixTooltip.Content>
                </RadixTooltip.Root>
              </RadixTooltip.Provider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => (isDashboard ? null : onShowCode())}
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() =>
                            isDashboard ? null : onShowFeedback("bug")
                          }
                        >
                          <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bug</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() =>
                            isDashboard ? null : onShowFeedback("suggestion")
                          }
                        >
                          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Suggestion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              }
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={handleShareClick}
                    >
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CodeCard;
