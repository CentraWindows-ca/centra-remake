"use client";
import styles from "./ordersHeader.module.css";
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { Provinces } from "app/utils/constants";
import {
  updateStatusView,
  updateLocation,
  updateShowMessage,
} from "app/redux/orders";

import QuickSearch from "app/components/templates/quickSearch/quickSearch";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import RootHeader from "app/components/organisms/rootHeader/rootHeader";

import { SearchIcon } from "app/utils/icons";
import { Collapse } from "@mui/material";

import { Button, Segmented, Breadcrumb, Badge, Popover } from "antd";
import { getIcon } from "app/utils/utils";
import Filters from "app/components/templates/filters/filters";
import UserAvatar from "app/components/organisms/users/userAvatar";
import { useAuthData } from "context/authContext";

export default function OrdersHeader(props) {
  const [show, setShow] = useState(false);
  const { selectedStatus, states, refetch } = props;
  const {
    department,
    appliedFilteredWorkOrders,
    filters,
    location,
    assignedToMe,
  } = useSelector((state) => state.orders);
  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loggedInUser } = useAuthData();

  const handleProvinceChange = useCallback(
    (val) => {
      if (val) {
        switch (val) {
          case Provinces.bc:
            dispatch(updateLocation(Provinces.bc));
            break;
          case Provinces.ab:
            dispatch(updateLocation(Provinces.ab));
            break;
          case Provinces.all:
            dispatch(updateLocation(Provinces.all));
            break;
          default:
            break;
        }
      }
    },
    [dispatch]
  );

  const getDepartmentIcon = (department) => {
    const _icon = getIcon(department);

    return _icon && <> {_icon}</>;
  };

  const handleForceRefresh = useCallback(() => {
    if (refetch) {
      dispatch(
        updateShowMessage({ value: true, message: "Refreshing data..." })
      );
      refetch();
      setTimeout(() => dispatch(updateShowMessage({ value: false })), 1000);
    }
  }, [dispatch, refetch]);

  const handleFilterClick = useCallback(
    (e) => {
      setShowFilter(!showFilter);
    },
    [showFilter]
  );

  const isAFilterApplied = useCallback(() => {
    let result = false;

    filters.forEach((filterCategory) => {
      if (!result && filterCategory.key !== "provinceFilter") {
        result = !!filterCategory.fields.find((x) => x.value === false);
      }
    });

    return result;
  }, [filters]);

  return (
    <RootHeader>
      <div className="flex flex-row justify-between">
        <Breadcrumb
          separator={`/`}
          className="flex items-center"
          items={[
            {
              title: (
                <div className="flex space-x-2 items-center cursor-pointer pl-1">
                  <span className="text-sm font-medium hover:underline">
                    {`${department}s`}
                  </span>
                </div>
              ),
              onClick: () => {
                dispatch(updateStatusView(""));
                router.push(`/${department.toLowerCase(0)}`);
              },
            },
            {
              title: (
                <div className="flex space-x-2 items-center">
                  {assignedToMe ? (
                    <>
                      <UserAvatar username={loggedInUser?.name ?? "test"} />
                      <span className="text-sm pr-3 font-medium">
                        Assigned To Me
                      </span>
                    </>
                  ) : (
                    <>
                      {selectedStatus ? (
                        <>
                          <i
                            className={`${states[selectedStatus]?.icon} pl-2`}
                            style={{
                              color: `${states[selectedStatus]?.color}`,
                            }}
                          ></i>
                          <span className="text-sm pr-3 font-medium">
                            {states[selectedStatus]?.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm pr-3 font-medium">
                          All Records
                        </span>
                      )}
                    </>
                  )}
                </div>
              ),
            },
          ]}
        ></Breadcrumb>

        <div className="flex">
          <div className="mr-4 mt-2">
            <Tooltip title="Refresh Data">
              <i
                className="fa-solid fa-arrows-rotate text-gray-500 hover:text-blue-500 hover:cursor-pointer"
                onClick={handleForceRefresh}
              />
            </Tooltip>
          </div>
          <div
            className="flex flex-row bg-white pl-4 pr-2"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex gap-2 items-center">
              <div className="">{getDepartmentIcon(department)}</div>
              <span className="text-sm text-bold text-centraBlue">
                {department}
              </span>
            </div>
            <div
              style={{ borderRight: "1px solid lightgrey" }}
              className="ml-4 mr-2"
            ></div>
            <div className="flex gap-2 items-center">
              <Segmented
                options={[Provinces.bc, Provinces.ab, Provinces.all]}
                onChange={handleProvinceChange}
                value={location}
              />
            </div>
          </div>
          <div>
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
          </div>
        </div>

        <div
          className={`${styles.calendarMonthWeekDayViewContainer} flex flex-row justify-end items-center`}
        >
          <Collapse in={show} orientation={"horizontal"}>
            <QuickSearch />
          </Collapse>

          <span
            onClick={() => {
              setShow(!show);
            }}
            className={`mr-4 ml-3 hover:cursor:pointer hover:text-blue-500 ${
              show ? "text-blue-700" : "text-gray-500"
            }`}
          >
            <SearchIcon />
          </span>
        </div>
      </div>
    </RootHeader>
  );
}
