"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { Input, Space } from "antd";
import { updateSearchEntry } from "app/redux/orders";

export default function QuickSearch(props) {
  const [searchDisabled, setSearchDisabled] = useState(true);
  const [searchEntry, setSearchEntry] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchDisabled(searchEntry?.length < 2);
  }, [searchEntry]);

  const handleSearchInputChange = (e) => {
    setSearchEntry(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      dispatch(updateSearchEntry(searchEntry));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, searchEntry]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        let searchButton = document.getElementById("button-search");

        if (searchButton) {
          searchButton.click();
        }
      }
    };

    document.addEventListener("keyup", handleKeyUp, true);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div>
      <Space.Compact>
        <Input
          placeholder="Search"
          onChange={handleSearchInputChange}
          style={{ width: "12rem" }}
          allowClear
        />
      </Space.Compact>
    </div>
  );
}
