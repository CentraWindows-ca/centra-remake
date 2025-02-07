"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Segmented, Popover, Button } from "antd";

import { ManufacturingFacilities } from "app/utils/constants";
import { updateBranch, updateShowMessage } from "app/redux/orders";

import { useCookies } from "react-cookie";

export default function BranchSelection(props) {
  const [cookies, setCookie] = useCookies(["options"]);
  const [isDefault, setIsDefault] = useState(false);

  const dispatch = useDispatch();
  const { faIconName, defaultOption } = props;
  const { department, branch, markedWorkOrderId } = useSelector(
    (state) => state.calendar
  );
  const { userData } = useSelector((state) => state.app);

  const handleBranchChange = useCallback(
    (val) => {
      if (val) {
        dispatch(
          updateShowMessage({ value: true, message: "Applying filters..." })
        );
        switch (val) {
          case ManufacturingFacilities.langley:
            dispatch(updateBranch(ManufacturingFacilities.langley));
            break;
          case ManufacturingFacilities.calgary:
            dispatch(updateBranch(ManufacturingFacilities.calgary));
            break;
          case ManufacturingFacilities.all:
            dispatch(updateBranch(ManufacturingFacilities.all));
            break;
          default:
            break;
        }
      }
    },
    [dispatch]
  );

  const handleApply = useCallback(() => {
    if (department && cookies?.options?.defaultCookie !== department?.key) {
      let _cookies = { ...cookies.options };
      _cookies.defaultCalendar = department.key;
      setCookie("options", _cookies);
    }
  }, [department, setCookie, cookies]);

  const popoverContent = (
    <div>
      {isDefault && (
        <span className="text-sm">
          <span>This is your default calendar.</span>
        </span>
      )}
      {!isDefault && (
        <span className="text-sm">
          <span className="pr-2">Make this my default calendar.</span>
          <Button size="small" type="primary" onClick={handleApply}>
            Apply
          </Button>
        </span>
      )}
    </div>
  );

  useEffect(() => {
    if (department && cookies) {
      setIsDefault(department?.key === cookies?.options?.defaultCalendar);
    }
  }, [department, cookies]);

  useEffect(() => {
    if (markedWorkOrderId) {
      dispatch(updateBranch(ManufacturingFacilities.all)); // If Go to calendar is triggered, show all work orders
    } else {
      if (userData?.province) {
        if (userData?.province === "BC") {
          dispatch(updateBranch(ManufacturingFacilities.langley));
        } else {
          dispatch(updateBranch(ManufacturingFacilities.calgary));
        }
      }
    }
  }, [dispatch, userData, markedWorkOrderId]);

  return (
    <div
      className="flex flex-row bg-white pl-4 pr-2"
      style={{ borderRadius: "4px" }}
    >
      {!defaultOption && (
        <div
          className="pt-2 pr-4"
          style={{ borderRight: "1px dotted lightgrey" }}
        >
          <i
            className={`fa-regular ${faIconName} pr-2 text-gray-500 text-centraBlue`}
          ></i>
          <span className="text-sm text-bold text-centraBlue">
            {department?.value}
          </span>
        </div>
      )}

      {defaultOption && (
        <Popover content={popoverContent}>
          <div
            className="pt-2 pr-4"
            style={{ borderRight: "1px dotted lightgrey" }}
          >
            {isDefault && (
              <i
                className={`fa-regular fa-calendar-check pr-2 text-gray-500 text-centraBlue`}
              ></i>
            )}
            {!isDefault && (
              <i
                className={`fa-regular fa-calendar pr-2 text-gray-500 text-centraBlue`}
              ></i>
            )}
            <span className="text-sm text-bold text-centraBlue">
              {department?.value}
            </span>
          </div>
        </Popover>
      )}
      {department?.key && (
        <>
          <Segmented
            options={[
              ManufacturingFacilities.langley,
              ManufacturingFacilities.calgary,
              ManufacturingFacilities.all,
            ]}
            onChange={handleBranchChange}
            style={{ padding: "5px 0 5px 10px" }}
            value={branch}
          />
        </>
      )}
    </div>
  );
}
