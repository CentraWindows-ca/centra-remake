"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateDrawerOpen } from "app/redux/app";

import { Button } from "antd";
import Tooltip from "app/components/tooltip/tooltip";
export default function CalendarHeader(props) {
  const { drawerOpen, isMobile } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const handleToggleDrawer = useCallback(
    (val) => {
      dispatch(updateDrawerOpen(val));
    },
    [dispatch]
  );

  return (
    <span className="w-100 pb-3 flex flex-row justify-start">
      <div className={`flex flex-row ${isMobile ? "justify-center pt-2" : ""}`}>
        <span className="hidden md:inline-block">
          <Tooltip title={`${drawerOpen ? "Minimize" : "Expand"} Orders Menu`}>
            {drawerOpen ? (
              <Button
                className="mr-4 mt-1 w-[12px] rounded-full hover:bg-blue-500 hover:text-red-400 bg-white text-gray-600 z-10"
                style={{ marginLeft: "-30px" }}
                onClick={() => handleToggleDrawer(false)}
              >
                <i className="fa-solid fa-chevron-left ml-[-4px]"></i>
              </Button>
            ) : (
              <Button
                className="mr-4 mt-1 w-[12px] rounded-full hover:bg-blue-500 hover:text-red-400 bg-white text-gray-600 z-10"
                style={{ marginLeft: "-30px" }}
                onClick={() => handleToggleDrawer(true)}
              >
                <i className="fa-solid fa-chevron-right ml-[-4px]"></i>
              </Button>
            )}
          </Tooltip>
        </span>
      </div>
      <div className="w-100">{props.children}</div>
    </span>
  );
}
