"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ordersMenu.module.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

import { ListCheckIcon } from "app/utils/icons";
import OrdersMenuList from "./ordersMenuList";
import { getStatusOptions } from "app/utils/utils";

export default function OrdersMenu(props) {
  const { style } = props;
  const [expanded, setExpanded] = useState("panel-status");
  const [statusOptions, setStatusOptions] = useState([]);

  const { drawerOpen } = useSelector((state) => state.app);

  const { department, statusView, orders } = useSelector(
    (state) => state.orders
  );

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (department) {
      let _options = getStatusOptions(department);
      setStatusOptions(_options);
    }
  }, [department]);

  return (
    <>
      <div style={{ ...style }} className={styles.ordersMenuContainer}>
        {drawerOpen ? (
          <div className={styles.accordionRoot}>
            <Accordion
              expanded={expanded === "panel-status"}
              onChange={handleChange("panel-status")}
              className={styles.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
                aria-controls="panel-status"
                id="panel-status"
                className={styles.accordionSummary}
              >
                <div className={styles.accordionLabelContainer}>
                  <ListCheckIcon />

                  <Typography
                    sx={{ flexShrink: 0 }}
                    className={styles.accordionLabel}
                  >
                    {department}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "0px" }}>
                <div className="flex flex-col space-y-2 text-sm mt-2 ">
                  <OrdersMenuList
                    selectedStatus={statusView}
                    department={department}
                    orders={orders}
                    statusOptions={statusOptions}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 text-sm">
            <OrdersMenuList
              selectedStatus={statusView}
              department={department}
              orders={orders}
              statusOptions={statusOptions}
            />
          </div>
        )}
      </div>
    </>
  );
}
