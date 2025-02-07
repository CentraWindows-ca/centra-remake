import React from "react";
import styles from './daySummary.module.css';

import DayTable from "../dayTable/dayTable";
import { generateDaySummaryData } from "app/utils/utils";

export default function DaySummary(props) {
  const { data } = props;

  const daySummaryData = generateDaySummaryData(data);

  /*-----------------*/

  let windowData = {
    header: {
      key: "windows",
      value: "",
      label: "Windows"
    },
    items: [
      { key: "26ca", value: daySummaryData?.f26CA, label: "26CA" },
      { key: "29ca", value: daySummaryData?.f29CA, label: "29CA" },
      { key: "29cm", value: daySummaryData?.f29CM, label: "29CM" },
      { key: "68sl", value: daySummaryData?.f68SL, label: "68SL" },
      { key: "68vs", value: daySummaryData?.f68VS, label: "68VS" },
      { key: "casements", value: daySummaryData?.casements, label: "Casements" },
      { key: "casementMinutes", value: daySummaryData?.casementsMin, label: "Casement Minutes" },
      { key: "slider", value: daySummaryData?.sliders, label: "Sliders" },
      { key: "sliderMinutes", value: daySummaryData?.slidersMin, label: "Slider Minutes" },
    ]
  }

  /*-----------------*/

  let vinylDoorData = {
    header: {
      key: "vinylDoors",
      value: "",
      label: "Vinyl Doors"
    },
    items: [
      { key: "27ds", value: daySummaryData?.f27DS, label: "27DS" },
      { key: "61dr", value: daySummaryData?.f61DR, label: "61DR" },
      { key: "vinylDoorMinutes", value: daySummaryData?.vinylDoorsMin, label: "Vinyl Door Minutes" },
    ]
  }

  let patioDoorData = {
    header: {
      key: "patioDoors",
      value: "",
      label: "Patio Doors"
    },
    items: [
      { key: "52pd", value: daySummaryData?.f52PD, label: "52PD" },
      { key: "patioDoorMinutes", value: daySummaryData?.f52PDMin, label: "Patio Door Minutes" }
    ]
  }

  /*-----------------*/

  let glassData = {
    header: {
      key: "glass",
      value: daySummaryData?.glass,
      label: "Glass"
    },
    items: [
      { key: "pfg", value: daySummaryData?.pfg, label: "PFG" },
      { key: "cardinal", value: daySummaryData?.cardinal, label: "Cardinal" },
      { key: "centraCalgary", value: daySummaryData?.centraCalgary, label: "Centra Calgary" }
    ]
  }

  let exteriorDoorsData = {
    header: {
      key: "exteriorDoors",
      value: "",
      label: "Exterior Doors"
    },
    items: [
      { key: "cdld", value: daySummaryData?.exteriorDoors, label: "CDLD" },
      /*{ key: "exteriorDoorMinutes", value: "0.00", label: "Exterior Door Minutes" }*/
      { key: "spacer", value: "", label: "" },
    ]
  }

  /*-----------------*/

  let boxData = {
    header: {
      key: "totalBoxes",
      value: daySummaryData?.boxes,
      label: "Total Boxes"
    },
    items: [
      { key: "spacer", value: "", label: "" },
      { key: "windows", value: daySummaryData?.windows, label: "Windows" },
      { key: "vinylDoors", value: daySummaryData?.vinylDoors, label: "Vinyl Doors" },
      { key: "patioDoors", value: daySummaryData?.f52PD, label: "Patio Doors" },
      { key: "exteriorDoors", value: daySummaryData?.exteriorDoors, label: "Exterior Doors" }
    ]
  }

  let rushData = {
    header: {
      key: "rushOrders",
      value: daySummaryData?.rush,
      label: "Rush Orders"
    },
    items: [
      { key: "spacer", value: "", label: "" },
      { key: "spacer", value: "", label: "" },
      { key: "spacer", value: "", label: "" }
    ]
  }

  let timeResourcesData = {
    header: {
      key: "timeResources",
      value: "",
      label: "Time/Resources"
    },
    items: [
      { key: "availableStaff", value: "0.00", label: "Available Staff" },
      { key: "availableTime", value: -1 * daySummaryData?.min, label: "Available Time" },
      { key: "min", value: daySummaryData?.min, label: "Min" },
      { key: "max", value: "0.00", label: "Max" },
      { key: "spacer", value: "", label: "" }
    ]
  }

  return (
    <div style={{ ...props.style }}>
      <div className={`${styles.gridContainer}`}>
        <div className={`${styles.gridItem}`}>
          <DayTable data={windowData} />
        </div>
        <div className={`${styles.gridItem}`}>
          <DayTable data={vinylDoorData} />
          <DayTable data={patioDoorData} style={{ paddingTop: "4px" }} />
          <DayTable data={exteriorDoorsData} style={{ paddingTop: "3px" }} />
        </div>
        <div className={`${styles.gridItem}`}>
          <DayTable data={glassData} />
          <DayTable data={boxData} propertyStyle={{ fontWeight: 600 }} valueStyle={{ fontWeight: 600, color: "var(--centrablue)" }} style={{ paddingTop: "3px" }} />
        </div>
        <div className={`${styles.gridItem}`}>
          <DayTable data={timeResourcesData} />
          <DayTable data={rushData} style={{ paddingTop: "3px" }} />
        </div>
      </div>
    </div>
  );
}
