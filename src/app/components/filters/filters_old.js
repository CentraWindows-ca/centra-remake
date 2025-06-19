"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "antd";

import { OrderFilters, ManufacturingFacilityFilter } from "app/utils/constants";

import Title from "app/components/title/title";
import PropertyFilters from "app/components/templates/filters/propertyFilters/propertyFilters";

import {
  updateFilters,
  updateIsFilterClean,
  updateFilteredWorkOrders,
  updateAppliedFilteredWorkOrders,
  updateShowMessage,
} from "app/redux/orders";

export default function Filters(props) {
  const { setShowFilter, style } = props;
  const dispatch = useDispatch();

  const { department, isFilterClean, filteredWorkOrders } = useSelector(
    (state) => state.calendar
  );
  const { userData } = useSelector((state) => state.app);

  const [filters, setFilters] = useState(
    department
      ? [
          ...OrderFilters?.find((_filters) => _filters.key === department?.key)
            ?.values,
          ManufacturingFacilityFilter,
        ]
      : []
  );
  const [applyDisabled, setApplyDisabled] = useState(false);

  const handleApplyClick = useCallback(() => {
    dispatch(
      updateShowMessage({ value: true, message: "Applying filters..." })
    );
    setShowFilter(false);

    setTimeout(() => {
      dispatch(updateFilters(filters));
      dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
    }, 1000);
  }, [dispatch, filters, filteredWorkOrders, setShowFilter]);

  const handleResetClick = useCallback(
    (e) => {
      if (e.target) {
        dispatch(
          updateShowMessage({ value: true, message: "Resetting filters..." })
        );
        setShowFilter(false);

        setTimeout(() => {
          setFilters((fs) => {
            let _filters = JSON.parse(JSON.stringify(fs));
            _filters.forEach((f) => {
              f.fields.forEach((fp) => {
                fp.value = true;
              });
            });

            dispatch(updateFilters(_filters));
            return _filters;
          });

          dispatch(updateFilteredWorkOrders([]));
          dispatch(updateAppliedFilteredWorkOrders([]));
        }, 1000);
      }
    },
    [dispatch, setFilters, setShowFilter]
  );

  useEffect(() => {
    let result = true;

    if (filters) {
      filters.forEach((f) => {
        if (result) {
          // Never overwrite a false value if found
          result = f.fields.every((x) => x.value); // If at least one field is false, disable reset button
        }
      });
    }

    dispatch(updateIsFilterClean(result));
  }, [dispatch, filters]);

  //Filter based on user branch during startup
  //useEffect(() => {
  //  if (userData?.branch) {
  //    setFilters(f => {
  //      const branchIndex = 1;
  //      let _f = JSON.parse(JSON.stringify(f));
  //      _f[branchIndex]?.fields?.forEach((fb) => {
  //        if (fb.label !== userData.branch) {
  //          fb.value = false;
  //        }
  //      });

  //      dispatch(updateFilters(_f));
  //      console.log("Applying default user branch filter...")
  //      return _f;
  //    });
  //  }
  //}, [dispatch, userData]);

  return (
    <div style={{ width: "25rem", ...style }}>
      <div className="flex flex-row justify-between">
        <Title
          label={"Filters"}
          labelClassName="text-sm pr-3 font-medium"
          Icon={() => {
            return <i className="fa-solid fa-filter pr-2" />;
          }}
        />
        <i
          className="fa-solid fa-xmark text-gray-500 hover:cursor-pointer"
          onClick={() => setShowFilter(false)}
        ></i>
      </div>

      <div style={{ borderBottom: "1px dotted lightgrey" }} className="pb-3">
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          setApplyDisabled={setApplyDisabled}
        />
      </div>

      <div className="w-100 flex flex-row justify-between mt-2 pl-1 pr-1">
        <Button
          onClick={handleResetClick}
          className="mt-2"
          disabled={isFilterClean && filteredWorkOrders?.length === 0}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={handleApplyClick}
          className="mt-2"
          disabled={applyDisabled}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
