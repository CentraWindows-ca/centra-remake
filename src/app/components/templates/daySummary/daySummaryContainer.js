import React, { useState } from "react";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import DaySummary from "./subComponents/daySummary/daySummary";

import Collapse from "@mui/material/Collapse";

export default function DaySummaryContainer(props) {
  const { dayTotals, date, daySummaryWorkOrders } = props;

  const [showDayTable, setShowDayTable] = useState(false);

  return (
    <CollapsibleGroup
      className="text-gray-500 font-medium"
      expandCollapseCallback={(val) => setShowDayTable(val)}
      headerStyle={{
        borderRadius: "3px",
        backgroundColor: "#FAF9F6",
        border: "1px dotted lightgrey",
      }}
      style={{ border: "none", paddingTop: "0.5rem" }}
      title={"Day Summary"}
      subTitle={`W: ${dayTotals?.windows} | VD: ${dayTotals?.vinylDoors} | PD: ${dayTotals?.patioDoors} | ED: ${dayTotals?.exteriorDoors}`}
      value={showDayTable}
      ActionButton={() => {
        return (
          <span className="pr-3">
            {/* <DaySummaryExport
              date={date}
              style={{ paddingBottom: "1rem" }}
            /> */}
          </span>
        );
      }}
    >
      <Collapse in={showDayTable}>
        <DaySummary
          style={{ padding: "1rem" }}
          date={date}
          data={daySummaryWorkOrders}
        />
      </Collapse>
    </CollapsibleGroup>
  );
}
