"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sidebar.module.css";
import { AppModes } from "app/utils/constants";

import OrdersMenu from "app/components/atoms/orderManagementComponents/ordersMenu/ordersMenu";

export default function Sidebar(props) {
  const { style } = props;
  const dispatch = useDispatch();

  const { appMode, drawerOpen } = useSelector((state) => state.app);

  return (
    <div
      style={{ ...style }}
      className={`${drawerOpen ? styles.root : ""} flex-col justify-between`}
    >
      <div>
        <div style={{ paddingTop: "1rem" }}>
          {appMode === AppModes.orders && <OrdersMenu />}
        </div>
      </div>
    </div>
  );
}
