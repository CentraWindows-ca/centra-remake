"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { Pages } from "app/utils/constants";

export default function MobileMenu(props) {
  const router = useRouter();
  const pathname = usePathname();
  const { department } = useSelector((state) => state.orders);

  return (
    <div
      className="fixed bottom-0 w-100 flex flex-row justify-around h-10 items-center text-xl"
      style={{ backgroundColor: "var(--centrablue)", color: "#F5F5F5" }}
    >
      <i
        className={`fa-regular fa-calendar-days`}
        onClick={() => {
          router.push(`/?department=${department.key}`);
        }}
        style={{
          color: !(
            pathname?.includes(Pages.searchResults) ||
            pathname?.includes(Pages.settings) ||
            pathname?.includes(Pages.tools)
          )
            ? "darkgrey"
            : "#F5F5F5",
        }}
      />
      <i
        className="fa-solid fa-gear"
        onClick={() => {
          console.log("options");
        }}
      />
      <i
        className="fa-solid fa-screwdriver-wrench"
        onClick={() => {
          console.log("tools");
        }}
      />
      <i
        className="fa-solid fa-magnifying-glass"
        onClick={() => {
          router.push(`${Pages.searchResults}?department=${department.key}`);
        }}
        style={{
          color: pathname?.includes(Pages.searchResults)
            ? "darkgrey"
            : "#F5F5F5",
        }}
      />
    </div>
  );
}
