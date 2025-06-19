"use client";
import styles from '../productionWorkorder.module.css';
import React, { useMemo } from "react";

import Group from "app/components/workorderComponents/group";
import CheckboxItem from "app/components/workorderComponents/checkboxItem";

import Tooltip from "app/components/tooltip/tooltip";

import {
  ShapesIcon,
  PaintIcon,
  RushIcon,
  GridIcon,
  CapStockIcon,
  EngineeredIcon,
  MiniBlindIcon,
  WaterResistanceIcon,
  CustomerPickupIcon
} from "app/utils/icons";

const yes = "yes";

export default function OrderOptions(props) {

  const {
    inputData,
    handleCheckboxChange,
    handleInputChange,
    orderChangeItems,
    isSearchView
  } = props;

  let wprEdited = useMemo(() => orderChangeItems?.find(x => x.key === "waterPenetrationResistance"), [orderChangeItems]);

  return (
    <Group
      title={"Order Options"}
      style={{ minWidth: isSearchView ? "10rem" : "15rem" }}
      contentStyle={{
        paddingTop: "0.5rem"
      }}
      className={styles.groupOptions}
    >
      <CheckboxItem
        label={"Rush Order"}
        value={(inputData?.flagOrder === 1 || inputData?.flagOrder === "Yes")}
        name={"flagOrder"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <RushIcon
          style={{ marginLeft: "-5px", width: "20px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Engineered"}
        value={inputData?.m2000Icon?.toLowerCase() === yes}
        name={"m2000Icon"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <EngineeredIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Capstock"}
        value={inputData?.capstockIcon?.toLowerCase() === yes}
        name={"capstockIcon"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <CapStockIcon
          style={{ marginLeft: "-3px", width: "18px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Paint"}
        value={inputData?.paintIcon?.toLowerCase() === yes}
        name={"paintIcon"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <PaintIcon
          style={{ marginLeft: "-5px", width: "20px" }}
        />
      </CheckboxItem>
    
      <CheckboxItem
        label={"Grids"}
        value={inputData?.gridsRequired?.toLowerCase() === yes}
        icon={"grid-3x3"}
        name={"gridsRequired"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <GridIcon
          style={{ marginLeft: "-3px", width: "17px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Shapes"}
        value={inputData?.shapesRequires?.toLowerCase() === yes}
        icon={"heptagon"}
        name={"shapesRequires"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <ShapesIcon
          style={{ marginLeft: "-3px", width: "18px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Miniblind"}
        value={inputData?.miniblindIcon?.toLowerCase() === yes}
        icon={"calendar2"}
        name={"miniblindIcon"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <MiniBlindIcon
          style={{ marginLeft: "-4px", width: "17px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Water Testing"}
        value={inputData?.waterTestingRequired?.toLowerCase() === yes}
        icon={"droplet-half"}
        name={"waterTestingRequired"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <WaterResistanceIcon
          style={{ marginLeft: "-4px", width: "18px" }}
        />
      </CheckboxItem>
   
      <CheckboxItem
        label={"Customer Pickup"}
        value={inputData?.customerPickup?.toLowerCase() === yes}
        name={"customerPickup"}
        onChange={handleCheckboxChange}
        changeItems={orderChangeItems}
      >
        <CustomerPickupIcon
          style={{ marginLeft: "-4px", width: "17px" }}
        />
      </CheckboxItem>
    
      {inputData?.waterTestingRequired?.toLowerCase() === yes &&
        <div className="pl-2 flex flex-row space-between pb-2">
          <Tooltip title="Water Penetration Resistance" style={{ maxWidth: "60%" }}>
            <div>
              <span>Water Penetration Resistance</span>
              {wprEdited && <span className="pl-1 text-amber-500">*</span>}
            </div>
          </Tooltip>
          <div className="relative">
            <input
              name={"waterPenetrationResistance"}
              value={inputData?.waterPenetrationResistance}
              type="text"
              className="absolute bottom-0 ml-2 mr-1 w-12 border border-gray-200 border-solid pl-1"
              onChange={handleInputChange}
            />
          </div>
        </div>
      }
    </Group>
  )
}