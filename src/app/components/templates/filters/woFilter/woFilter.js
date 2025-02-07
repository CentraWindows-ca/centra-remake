"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Empty } from "antd";

import ProductionEvent from "app/components/organisms/events/productionEvent";
import WOSelection from "app/components/organisms/woSelection/woSelection";

import useCalendarEvents from "app/hooks/useCalendarEvents";
import { Pages } from "app/utils/constants";

import { updateFilteredWorkOrders } from "app/redux/orders";

export default function WOFilter(props) {
  const { className } = props;

  const [workOrderNumber, setWorkOrderNumber] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectionWorkOrders, setSelectionWorkOrders] = useState([]);

  const dispatch = useDispatch();

  const {
    date,
    branch,
    department,
    monthWorkOrders,
    weekWorkOrders,
    dayWorkOrders,
    page,
    filteredWorkOrders,
  } = useSelector((state) => state.calendar);

  const { buildProductionEvents } = useCalendarEvents({
    ...{
      date,
      filteredWorkOrders,
      departmentParam: department?.key,
    },
  });

  const handleSelect = useCallback(
    (id) => {
      if (monthWorkOrders?.length > 0) {
        let _workOrder = monthWorkOrders.find((x) => x.workOrderNumber === id);
        if (_workOrder) {
          let isExisting = _filteredWorkOrders.find(
            (w) => w.workOrderNumber === value.id
          );
          if (!isExisting) {
            _filteredWorkOrders.push(_workOrder);
          }

          dispatch(updateFilteredWorkOrders(_filteredWorkOrders));
        }
      }
    },
    [dispatch, monthWorkOrders, filteredWorkOrders]
  );

  useEffect(() => {
    let _events = buildProductionEvents(filteredWorkOrders);
    if (_events) {
      setEvents(_events);
    }
  }, [dispatch, filteredWorkOrders, buildProductionEvents]);

  useEffect(() => {
    if (page) {
      switch (page) {
        case Pages.month:
          setSelectionWorkOrders([...monthWorkOrders]);
          break;
        case Pages.week:
          setSelectionWorkOrders([...weekWorkOrders]);
          break;
        case Pages.day:
          setSelectionWorkOrders([...dayWorkOrders]);
          break;
        default:
          break;
      }
    }
  }, [page, monthWorkOrders, weekWorkOrders, dayWorkOrders]);

  return (
    <div className={className}>
      <div className="mt-2">
        <WOSelection
          branch={branch}
          workOrders={selectionWorkOrders}
          handleSelect={handleSelect}
          workOrderNumber={workOrderNumber}
          setWorkOrderNumber={setWorkOrderNumber}
        />
      </div>
      <div
        style={{ border: "1px dotted lightgrey" }}
        className="w-100 rounded mt-3 p-1 h-[14.2rem]"
      >
        {events?.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
        )}
        {events.length > 0 && (
          <div className="overflow-y-auto">
            {events?.map((e, index) => {
              return (
                <ProductionEvent
                  key={index}
                  event={e}
                  style={{
                    backgroundColor: e.backgroundColor,
                    borderRadius: "5px",
                    paddingRight: "0.5rem",
                    minWidth: "90%",
                    marginBottom: "3px",
                  }}
                  textStyle={{
                    fontSize: "0.8rem",
                  }}
                  isWONFirst={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
