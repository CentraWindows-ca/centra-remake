"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ordersMenu.module.css";

import OrdersMenuList from "./ordersMenuList";
import { getStatusOptions } from "app/utils/utils";

export default function OrdersMenu(props) {
  const { style } = props;
  const [statusOptions, setStatusOptions] = useState([]);

  const { drawerOpen } = useSelector((state) => state.app);

  const { statusView, orders } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    const _options = getStatusOptions("Remake");
    setStatusOptions(_options);
  }, [])
  

  return (
    <>
      <div style={{ ...style }} className={styles.ordersMenuContainer}>
        {drawerOpen ? (
          <div className={styles.accordionRoot}>
            <div className="flex flex-col space-y-2 text-sm mt-2 ">
              <OrdersMenuList
                selectedStatus={statusView}
                department={"Remake"}
                orders={orders}
                statusOptions={statusOptions}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 text-sm">
            <OrdersMenuList
              selectedStatus={statusView}
                department={"Remake"}
              orders={orders}
              statusOptions={statusOptions}
            />
          </div>
        )}
      </div>
    </>
  );
}
