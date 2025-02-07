"use client";
import styles from "./calendarHeader.module.css";
import React, { useEffect, useState, useCallback, useId } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Pages } from "app/utils/constants";
import {
  updatePage,
  updateIsLoading,
  updateShowMessage,
} from "app/redux/orders";

import { Collapse } from "@mui/material";

import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import { Button, Segmented, Space, Popover, Badge } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import QuickSearch from "app/components/templates/quickSearch/quickSearch";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import BranchSelection from "app/components/atoms/branchSelection/branchSelection";
import Filters from "app/components/templates/filters/filters_old";
import RootHeader from "app/components/organisms/rootHeader/rootHeader";

import moment from "moment";
import { motion } from "framer-motion";

import { YMDDateFormat } from "app/utils/utils";

import { updateDrawerOpen } from "app/redux/app";

export default function CalendarHeader(props) {
  const [datePickerView, setDatePickerView] = useState(null);
  const [datePickerFormat, setDatePickerFormat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterTooltipText, setFilterTooltipText] = useState("");

  const {
    todayButtonClick,
    /*goToDate, */
    date,
    setDate,
    moveDateForward,
    moveDateBack,
    refetch,
  } = props;

  const { page, department, appliedFilteredWorkOrders, filters } = useSelector(
    (state) => state.calendar
  );

  const { isMobile, drawerOpen } = useSelector((state) => state.app);

  const { isLoading } = useSelector((state) => state.search);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (page) {
      switch (page) {
        case Pages.month:
          setDatePickerFormat("MMMM YYYY");
          setDatePickerView("month");
          break;
        case Pages.week:
          setDatePickerFormat(`MMMM YYYY - [Week] WW`);
          setDatePickerView("week");
          break;
        case Pages.day:
          setDatePickerFormat("MMMM DD, YYYY");
          setDatePickerView("day");
          break;
        case Pages.mobile:
          setDatePickerFormat("MMMM YYYY");
          setDatePickerView("month");
          break;
        default:
          break;
      }
    }
  }, [page]);

  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate && router && page) {
        dispatch(updateIsLoading(true));

        let year = moment(newDate).format("YYYY");
        let month = moment(newDate).format("MM");
        let day = moment(newDate).format("DD");

        if (page === Pages.month) {
          day = "01"; // When navigating months, make sure date always start on the 1st
        }

        let _newDate = `${year}-${month}-${day}`;

        setDate(moment(_newDate));
        //goToDate(date);

        setTimeout(() => refetch(), 1000);

        window.history.pushState(
          `${page}`,
          `${page}`,
          `/?department=${department?.key}&page=${page}&date=${_newDate}`
        ); // workaround to force update the url
        router.push(
          `/?department=${department?.key}&page=${page}&date=${_newDate}`,
          undefined,
          { shallow: true }
        );
      }
    },
    [dispatch, page, router, setDate, department, refetch]
  );

  const disableDates = (current) => {
    return current.year() < 2016 || current.year() > moment().year() + 2; // Only enable dates wherein records exist and 2 years in the future
  };

  let datePickerKey = useId();

  const handleCalendarViewChange = useCallback(
    (page) => {
      if ((page && date, router && department)) {
        dispatch(updatePage(page));
        window.history.pushState(
          `${page}`,
          `${page}`,
          `?department=${department?.key}&page=${page}&date=${YMDDateFormat(
            date
          )}`
        );
      }
    },
    [dispatch, date, department, router]
  );

  const handleFilterClick = useCallback(
    (e) => {
      setShowFilter(!showFilter);
    },
    [showFilter]
  );

  const isAFilterApplied = useCallback(() => {
    let result = false;

    filters.forEach((filterCategory) => {
      if (!result && filterCategory.key !== "manufacturingFacility") {
        result = !!filterCategory.fields.find((x) => x.value === false);
      }
    });

    return result;
  }, [filters]);

  useEffect(() => {
    // Open filters upon load to apply user branch filter but close it as soon as branch filters are applied.
    setShowFilter(false);
  }, []);

  useEffect(() => {
    if (filters) {
      let tooltipPrefix = "";

      filters.forEach((f) => {
        if (f.key !== "manufacturingFacility") {
          if (f.fields.some((x) => !x.value)) {
            tooltipPrefix = `${tooltipPrefix}${tooltipPrefix ? ", " : ""}${
              f.label
            }`;
          }
        }
      });
      setFilterTooltipText(tooltipPrefix);
    }
  }, [filters]);

  const handleForceRefresh = useCallback(() => {
    if (refetch) {
      dispatch(
        updateShowMessage({ value: true, message: "Refreshing data..." })
      );
      refetch();
      setTimeout(() => dispatch(updateShowMessage({ value: false })), 1000);
    }
  }, [dispatch, refetch]);

  useEffect(() => {
    const findNextPage = (currentPage) => {
      let newPage = Pages.week;

      switch (currentPage) {
        case Pages.month:
          newPage = Pages.week;
          break;
        case Pages.week:
          newPage = Pages.day;
          break;
        case Pages.day:
          newPage = Pages.month;
          break;
        default:
          break;
      }
      return newPage;
    };

    const findPreviousPage = (currentPage) => {
      let newPage = Pages.day;

      switch (currentPage) {
        case Pages.month:
          newPage = Pages.day;
          break;
        case Pages.week:
          newPage = Pages.month;
          break;
        case Pages.day:
          newPage = Pages.week;
          break;
        default:
          break;
      }
      return newPage;
    };

    const handleKeyUp = (event) => {
      if (event.shiftKey) {
        // Check for Alt key
        switch (event.key) {
          case "ArrowUp":
            handleCalendarViewChange(findPreviousPage(page));
            break;
          case "ArrowDown":
            handleCalendarViewChange(findNextPage(page));
            break;
          case "ArrowLeft":
            moveDateBack();
            break;
          case "ArrowRight":
            moveDateForward();
            break;
          default:
            break;
        }
      }
      if (event.altKey) {
        // Check for Alt key
        switch (event.key) {
          case "s":
          case "S":
            dispatch(updateDrawerOpen(!drawerOpen));
            break;
          case "r":
          case "R":
            handleForceRefresh();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    dispatch,
    moveDateBack,
    moveDateForward,
    page,
    handleCalendarViewChange,
    drawerOpen,
    handleForceRefresh,
  ]);

  //useEffect(() => {
  //  if (!isMobile) {
  //    dispatch(updateIsLoading(true));
  //  }
  //}, [dispatch, date, isMobile]);

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1, // Adjust the delay between children
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <RootHeader>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={`flex flex-row ${
          isMobile ? "justify-center" : "justify-between"
        }`}
      >
        <motion.div variants={itemVariants}>
          <Tooltip title="Previous">
            <i
              className="fa-solid fa-caret-left text-slate-400 hover:text-blue-500 text-sm mr-1 hover:cursor-pointer"
              onClick={() => moveDateBack()}
            ></i>
          </Tooltip>
          <AntDatePicker
            key={datePickerKey}
            disabledDate={disableDates}
            value={date}
            picker={datePickerView}
            onChange={handleDateChange}
            format={datePickerFormat}
            style={{ height: "2.4rem", border: "none" }}
          />
          <Tooltip title="Next">
            <i
              className="fa-solid fa-caret-right text-slate-400 hover:text-blue-500 text-sm ml-1 hover:cursor-pointer"
              onClick={() => moveDateForward()}
            ></i>
          </Tooltip>
          <span className="pl-4">
            <Button
              type="primary"
              className={`${styles.todayButton}`}
              onClick={todayButtonClick}
            >
              Today
            </Button>
          </span>
        </motion.div>

        {!isMobile && (
          <motion.div variants={itemVariants} className="flex">
            <div className="mr-3 mt-2">
              <Tooltip title="Refresh Data">
                <i
                  className="fa-solid fa-arrows-rotate text-gray-500 hover:text-blue-500 hover:cursor-pointer"
                  onClick={handleForceRefresh}
                />
              </Tooltip>
            </div>
            <BranchSelection faIconName={"fa-calendar"} defaultOption={true} />
            <Popover
              content={() => <Filters setShowFilter={setShowFilter} />}
              trigger="click"
              open={showFilter}
              onOpenChange={handleFilterClick}
              placement="bottomRight"
            >
              <Badge
                title="Some filters have been applied."
                dot={
                  appliedFilteredWorkOrders?.length > 0 || isAFilterApplied()
                }
                className="ml-[8px] mt-[4px]"
              >
                <Tooltip title="Filters">
                  <Button
                    style={{ outline: "none" }}
                    className="pt-0 pb-0 pr-[5px] pl-[5px] border-none"
                    type="secondary"
                  >
                    <i
                      className={`fa-solid fa-filter ${
                        showFilter ? "text-blue-500" : "text-gray-500"
                      } hover:text-blue-500`}
                    ></i>
                  </Button>
                </Tooltip>
              </Badge>
            </Popover>
          </motion.div>
        )}

        {!isMobile && (
          <motion.div
            variants={itemVariants}
            className={`${styles.calendarMonthWeekDayViewContainer} flex flex-row justify-end`}
          >
            <Collapse in={!showSearch} orientation={"horizontal"}>
              <div className="md:w-42">
                <Segmented
                  options={[
                    { label: "Month", value: "month" },
                    { label: "Week", value: "week" },
                    { label: "Day", value: "day" },
                  ]}
                  onChange={handleCalendarViewChange}
                  style={{ padding: "5px" }}
                  value={page}
                  className="hidden md:inline-block"
                />
              </div>
            </Collapse>

            <Space.Compact className={`${showSearch ? "mr-[10px]" : ""} pt-1`}>
              <Button
                style={{
                  backgroundColor: "var(--centrablue)",
                  borderRadius: showSearch ? "5px 0 0 5px" : "5px",
                  width: "10px",
                }}
                onClick={() => {
                  setShowSearch(!showSearch);
                }}
                className={`ml-4 text-white`}
              >
                {isLoading && (
                  <div className="" style={{ marginLeft: "-7px" }}>
                    <LoadingOutlined spin className="text-white" />
                  </div>
                )}

                {!isLoading && (
                  <Tooltip
                    title={`${
                      showSearch ? "Hide Quick Search" : "Show Quick Search"
                    }`}
                    placement="bottom"
                    style={{ paddingTop: "12px" }}
                  >
                    <i
                      className={`fa-solid ${
                        !showSearch
                          ? "fa-magnifying-glass"
                          : "fa-magnifying-glass-arrow-right"
                      } hover:cursor:pointer  mt-[5px] ${
                        showSearch ? "ml-[-7px]" : "ml-[-7px]"
                      }`}
                    />
                  </Tooltip>
                )}
              </Button>

              <Collapse in={showSearch} orientation={"horizontal"}>
                <div style={{ width: "25rem" }}>
                  <QuickSearch />
                </div>
              </Collapse>
            </Space.Compact>
          </motion.div>
        )}
      </motion.div>
      <Filters style={{ display: "none" }} />{" "}
      {/* Force filters to instantiate in order to filter based on user's branch */}
    </RootHeader>
  );
}
