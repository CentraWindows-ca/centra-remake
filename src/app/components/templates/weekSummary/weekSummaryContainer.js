import React, { useState } from "react";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import WeekSummary from "./subComponents/weekSummary/weekSummary";

import Collapse from "@mui/material/Collapse";
import moment from "moment";

export default function WeekSummaryContainer(props) {
  const { weekTotals, date, weekSummaryWorkOrders, updateWeekTotals } = props;

  const [showWeekTable, setShowWeekTable] = useState(false);
  const [propertyLabels, setPropertyLabels] = useState([]);
  const [weekSummaryData, setWeekSummaryData] = useState([]);

  return (
    <CollapsibleGroup
      className="text-gray-500 font-medium"
      expandCollapseCallback={(val) => setShowWeekTable(val)}
      headerStyle={{
        borderRadius: "3px",
        backgroundColor: "#FAF9F6",
        border: "1px dotted lightgrey",
      }}
      style={{ border: "none", paddingTop: "0.5rem" }}
      title={"Week Summary "}
      subTitle={`W: ${weekTotals?.windows} | VD: ${weekTotals?.vinylDoors} | PD: ${weekTotals?.patioDoors} | ED: ${weekTotals?.exteriorDoors}`}
      value={showWeekTable}
      ActionButton={() => {
        return (
          <span className="pr-3">
            {/* <WeekSummaryExport
              data={{ summary: weekSummaryData, dates: weekSummaryWorkOrders.map(d => d.date) }}
              propertyLabels={propertyLabels}
              style={{ paddingTop: "1rem" }}
            /> */}
          </span>
        );
      }}
    >
      <Collapse orientation="vertical" in={showWeekTable}>
        <WeekSummary
          weekStartDate={moment(date).startOf("week")}
          weekEndDate={moment(date).endOf("week")}
          data={weekSummaryWorkOrders}
          setWeekTotals={updateWeekTotals}
          propertyLabels={propertyLabels}
          setPropertyLabels={setPropertyLabels}
          weekSummaryData={weekSummaryData}
          setWeekSummaryData={setWeekSummaryData}
        />
      </Collapse>
    </CollapsibleGroup>
  );
}
