import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import moment from "moment";

import WOSelection from "app/components/woSelection/woSelection";

import { Space, Typography } from "antd";

import { fetchProductionWorkOrders } from "app/api/productionApis";
const { Text } = Typography;
import { updateWorkOrderData } from "app/redux/orders";

export default function CreateRemakeOrder(props) {
  const dispatch = useDispatch();
  const department = "remake";
  const action = "remake";

  const workOrderNumberParam = props.orderId;

  const [workOrderNumber, setWorkOrderNumber] = useState("");

  const [date, setDate] = useState(moment());

  //const { branch } = useSelector((state) => state.calendar);

  const HEADER_HEIGHT_OFFSET = 140;

  const {
    isFetching,
    data: workOrders,
    refetch,
  } = useQuery(
    "workorders",
    () => {
      const daysInMonth = moment(date).daysInMonth();
      const year = moment(date).format("YYYY");
      const month = moment(date).format("M");

      if (daysInMonth && month && year) {
        return fetchProductionWorkOrders(
          `${year}-${month}-01T00:00:00`,
          `${year}-${month}-${daysInMonth}T23:59:59`
        );
      }
    },
    { enabled: false }
  );

  useEffect(() => {
    if (date) {
      refetch();
      setWorkOrderNumber(null);
    }
  }, [date, refetch]);

  useEffect(() => {
    if (workOrderNumberParam) {
      setWorkOrderNumber(workOrderNumberParam);
    }
  }, [workOrderNumberParam]);

  const handleSelect = useCallback(
    (value) => {
      setWorkOrderNumber(value.id);
      dispatch(
        updateWorkOrderData({ workOrderNumber: value.id, branch: value.branch })
      );
    },
    [dispatch]
  );

  const handleDateChange = (e) => {
    if (e) {
      setDate(moment(e));
    }
  };

  return (
    <div
      className={`border w-full rounded bg-white pr-2 pl-2 pb-2`}
      style={{
        height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px`,
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      <div
        className="flex flex-row justify-center pb-3 sticky z-10 bg-white pt-3"
        style={{ borderBottom: "1px dotted lightgrey", top: 0 }}
      >
        <Space.Compact>
          <div>Date Picker</div>
          <WOSelection
            branch={branch}
            onChange={() => {}}
            workOrders={workOrders?.data || []}
            handleSelect={handleSelect}
            workOrderNumber={workOrderNumber}
            setWorkOrderNumber={setWorkOrderNumber}
          />
        </Space.Compact>
      </div>
      <div className="w-full pl-2 pr-2 pb-2">
        {!workOrderNumber && (
          <div
            className="flex w-100 justify-center items-center"
            style={{ height: "70vh" }}
          >
            <div className="text-sm">
              <Text type="secondary">
                Find a work order from the selection menu above.
              </Text>
            </div>
          </div>
        )}
        {workOrderNumber && (
          <div className="pt-3">
            Production WO
          </div>
        )}
      </div>
    </div>
  );
}
