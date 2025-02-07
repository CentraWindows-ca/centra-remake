"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { Select } from "antd";

import Event from "app/components/organisms/events/productionEvent";
import useCalendarEvents from "app/hooks/useCalendarEvents";
import { ManufacturingFacilities } from "app/utils/constants";

export default function WOSelection(props) {
  const {
    branch,
    workOrders,
    workOrderNumber,
    setWorkOrderNumber,
    handleSelect,
  } = props;

  const { date, department, filters, filterEntry } = useSelector(
    (state) => state.calendar
  );

  const { buildProductionEvents } = useCalendarEvents({
    ...{
      date,
      workOrders,
      departmentParam: department?.key,
    },
  });

  const [woOptions, setWoOptions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let _events = buildProductionEvents(workOrders);
    if (_events) {
      setEvents(_events);
    }
  }, [workOrders, filters, filterEntry, buildProductionEvents]);

  useEffect(() => {
    if (events?.length > 0 && branch) {
      let langleyWorkOrders = events.filter(
        (x) =>
          x.extendedProps.manufacturingFacility ===
            ManufacturingFacilities.langley || x.manufacturingFacility === ""
      );

      let calgaryWorkOrders = events.filter(
        (x) =>
          x.extendedProps.manufacturingFacility ===
          ManufacturingFacilities.calgary
      );

      let allWorkOrders = [...langleyWorkOrders, ...calgaryWorkOrders];

      let _woOptions = [];

      switch (branch) {
        case ManufacturingFacilities.langley:
          _woOptions = langleyWorkOrders.map((w, index) => {
            return { ...w, value: index, label: w.title, emoji: "test" };
          });
          break;
        case ManufacturingFacilities.calgary:
          _woOptions = calgaryWorkOrders.map((w, index) => {
            return { ...w, value: index, label: w.title, emoji: "test" };
          });
          break;
        default:
          _woOptions = allWorkOrders.map((w, index) => {
            return { ...w, value: index, label: w.title, emoji: "test" };
          });
          break;
      }

      setWoOptions(_woOptions);
    }
  }, [events, branch]);

  const EventRender = useCallback((props) => {
    const { optionVal } = props;

    return (
      <Event
        event={optionVal.data}
        style={{
          backgroundColor: optionVal.data.backgroundColor,
          borderRadius: "5px",
          paddingRight: "0.5rem",
          minWidth: "90%",
        }}
        textStyle={{
          fontSize: "0.8rem",
        }}
        isWONFirst={true}
      />
    );
  }, []);

  const handleSearch = useCallback(
    (val) => {
      setWorkOrderNumber(val);
    },
    [setWorkOrderNumber]
  );

  return (
    <Select
      showSearch
      style={{ width: "14.3rem" }}
      placeholder="Select work order"
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? "").includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={woOptions}
      onChange={(key, val) => handleSelect(val)}
      onSearch={handleSearch}
      value={workOrderNumber}
      notFoundContent={null}
      defaultActiveFirstOption={false}
      autoClearSearchValue={true}
      optionRender={(optionVal) => {
        return (
          <div
            style={{ backgroundColor: optionVal.data.backgroundColor }}
            className="font-semibold"
          >
            <EventRender optionVal={optionVal} />
          </div>
        );
      }}
    />
  );
}
