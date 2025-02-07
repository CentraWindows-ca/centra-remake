"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./menu.module.css";

import { useRouter, usePathname } from "next/navigation";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { LoadingOutlined } from "@ant-design/icons";

import Options from "../options/options";
import GlassImport from "../glassImport/glassImport";

import { Pages, MenuActions, Production } from "app/utils/constants";

import {
  SearchIcon,
  OptionsIcon,
  ToolsIcon,
  RotateRightIcon,
  ClipboardIcon,
} from "app/utils/icons";

import { Button } from "antd";

export default function Menu(props) {
  const { style } = props;
  const [expanded, setExpanded] = useState("panel-tools");
  const [showGlassImport, setShowGlassImport] = useState(false);

  const { department, page, markedWorkOrderId } = useSelector(
    (state) => state.calendar
  );

  const { isLoading, action } = useSelector((state) => state.menu);

  const dispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (panel) => (event, newExpanded) => {
    if (panel !== expanded) {
      setExpanded(newExpanded ? panel : false);
    }
  };

  const ButtonLabel = useCallback(
    (props) => {
      const { label, faIconName, buttonAction } = props;

      return (
        <div className="w-100 flex justify-center">
          <div style={{ width: "9rem" }} className="text-left">
            {isLoading && action === buttonAction && (
              <span style={{ marginTop: "-3px" }}>
                <LoadingOutlined spin className="mr-2" />
              </span>
            )}
            {(!isLoading || (isLoading && action !== buttonAction)) && (
              <i className={`fa-solid ${faIconName} pr-2`}></i>
            )}
            <span className="text-sm">{label}</span>
          </div>
        </div>
      );
    },
    [action, isLoading]
  );

  return (
    <div style={{ ...style }}>
      <div className={styles.accordionRoot}>
        {markedWorkOrderId && (
          <div className="text-center">
            <Button
            // onClick={() => {
            //   router.back();
            //   dispatch(updateMarkedWorkOrderId(null));
            // }}
            >
              <i className="fa-solid fa-magnifying-glass-arrow-right pr-2"></i>
              Previous Search Results
            </Button>
          </div>
        )}
        {pathname.length > 1 && false && (
          <div className="mb-3 text-center">
            <Button
              onClick={() => {
                router.push(`?department=${department.key}&page=${page}`);
              }}
            >
              <i className="fa-solid fa-calendar pr-2"></i>
              <span className="text-sm">Switch to Calendar View</span>
            </Button>
          </div>
        )}

        {/*{false &&*/}
        {/*    <Accordion expanded={expanded === 'panel-dept'} onChange={handleChange('panel-dept')} className={styles.accordion}>*/}
        {/*        <AccordionSummary*/}
        {/*            expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}*/}
        {/*            aria-controls="panel-dept-content"*/}
        {/*            id="panel-dept-header"*/}
        {/*            className={styles.accordionSummary}*/}
        {/*        >*/}
        {/*            <span className="inline-block w-8"><DepartmentIcon /></span>*/}
        {/*            <span className="inline-block">*/}
        {/*                <Typography*/}
        {/*                    sx={{ width: '100%', flexShrink: 0 }}*/}
        {/*                    className={styles.accordionLabel}>*/}
        {/*                    Department{(expanded !== "panel-dept")}*/}
        {/*                </Typography>*/}
        {/*            </span>*/}
        {/*        </AccordionSummary>*/}
        {/*        <AccordionDetails>*/}
        {/*            <div className={styles.calendarTypeSelectionContainer} >*/}
        {/*                <div className="flex flex-row pt-4">*/}
        {/*                    <Select*/}
        {/*                        selected={department}*/}
        {/*                        options={CalendarTypes}*/}
        {/*                        ariaLabel={"calendar-type-selection"}*/}
        {/*                        onChange={(newVal) => {*/}
        {/*                            let _calendarType = CalendarTypes.find(c => c.value === newVal);*/}
        {/*                            dispatch(updateDepartment(_calendarType));*/}
        {/*                        }}*/}
        {/*                        style={{ borderRadius: department?.type === "multi" ? '5px 0 0 5px' : '5px', fontSize: "0.9rem" }}*/}
        {/*                    />*/}
        {/*                    {department?.type === "multi" &&*/}
        {/*                        <Select*/}
        {/*                            options={department?.options}*/}
        {/*                            ariaLabel={"subCalendar-type-selection"}*/}
        {/*                            onChange={() => { }}*/}
        {/*                            style={{ width: "9rem", borderRadius: "0 5px 5px 0", backgroundColor: "#F5F5F5", fontSize: "0.9rem" }}*/}
        {/*                        />*/}
        {/*                    }*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </AccordionDetails>*/}
        {/*    </Accordion>*/}
        {/*}*/}

        <Accordion
          expanded={expanded === "panel-tools"}
          onChange={handleChange("panel-tools")}
          className={styles.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
            aria-controls="panel-tools-content"
            id="panel-tools-header"
            className={styles.accordionSummary}
          >
            <span className="w-7 inline-block">
              <ToolsIcon className="text-centraBlue" />
            </span>
            <span className="inline-block">
              <Typography
                sx={{ flexShrink: 0 }}
                className={styles.accordionLabel}
              >
                Tools
              </Typography>
            </span>
          </AccordionSummary>
          <AccordionDetails style={{ border: "none !important" }}>
            <div className="pt-1">
              <div className="text-center pt-3">
                <Button
                  className="w-full"
                  type="primary"
                  disabled={
                    pathname === `/${Pages.batchUpdate}` &&
                    action === MenuActions.batchReschedule
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/${Pages.batchUpdate}?department=${department?.key}`
                    );
                    // dispatch(menuSlice.actions.updateIsLoading(true));
                    // dispatch(
                    //   menuSlice.actions.updateAction(
                    //     MenuActions.batchReschedule
                    //   )
                    // );
                  }}
                >
                  <ButtonLabel
                    label={"Bulk Reschedule"}
                    faIconName={"fa-calendar-days"}
                    buttonAction={MenuActions.batchReschedule}
                  />
                </Button>
              </div>
            </div>
            <div className="pt-1">
              <div className="text-center pt-3">
                <Button
                  className="w-full"
                  type="primary"
                  disabled={
                    pathname === `/${Pages.batchUpdate}` &&
                    action === MenuActions.batchStatusUpdate
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/${Pages.batchUpdate}?department=${department?.key}`
                    );
                    // dispatch(menuSlice.actions.updateIsLoading(true));
                    // dispatch(
                    //   menuSlice.actions.updateAction(
                    //     MenuActions.batchStatusUpdate
                    //   )
                    // );
                  }}
                >
                  <ButtonLabel
                    label={"Bulk Status Update"}
                    faIconName={"fa-circle-check"}
                    buttonAction={MenuActions.batchStatusUpdate}
                  />
                </Button>
              </div>
            </div>
            {department?.key === "production" && (
              <div className="text-left pt-3">
                <Button
                  className="w-full flex"
                  type="primary"
                  disabled={
                    pathname === `/${Pages.remakeBackorder}` &&
                    action === "remake"
                  }
                  onClick={() => {
                    router.push(
                      `${Pages.remakeBackorder}?department=${department?.key}&action=remake`
                    );
                    // dispatch(menuSlice.actions.updateIsLoading(true));
                    // dispatch(menuSlice.actions.updateAction("remake"));
                  }}
                >
                  <ButtonLabel
                    label={"Create Remake"}
                    faIconName={"fa-rotate-right"}
                    buttonAction={"remake"}
                  />
                </Button>
              </div>
            )}
            {department?.key === Production && (
              <div className="text-center pt-3">
                <Button
                  className="w-full"
                  type="primary"
                  disabled={
                    pathname === `/${Pages.remakeBackorder}` &&
                    action === "backorder"
                  }
                  onClick={() => {
                    router.push(
                      `${Pages.remakeBackorder}?department=${department?.key}&action=backorder`
                    );
                    // dispatch(menuSlice.actions.updateIsLoading(true));
                    // dispatch(menuSlice.actions.updateAction("backorder"));
                  }}
                >
                  <ButtonLabel
                    label={"Create Backorder"}
                    faIconName={"fa-angles-left"}
                    buttonAction={"backorder"}
                  />
                </Button>
              </div>
            )}
            {department?.key === Production && (
              <div className="pt-3">
                <Button
                  className="w-full"
                  type="primary"
                  onClick={() => {
                    setShowGlassImport(!showGlassImport);
                    ///dispatch(menuSlice.actions.updateAction("glassImport"));
                  }}
                >
                  <div className="flex flex-row pl-2">
                    <ButtonLabel
                      label={"Glass Import"}
                      faIconName={`fa-file-import`}
                      buttonAction={"glassImport"}
                    />
                    <i
                      className={`fa-solid fa-angle-${
                        showGlassImport ? "up" : "down"
                      }`}
                      style={{ paddingTop: "0.4rem" }}
                    />
                  </div>
                </Button>
                <div>
                  <Collapse in={showGlassImport}>
                    <GlassImport />
                  </Collapse>
                </div>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
        {process?.env?.NEXT_PUBLIC_ENV !== "production" && (
          <Accordion
            expanded={expanded === "panel-orders"}
            onChange={handleChange("panel-orders")}
            className={styles.accordion}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
              aria-controls="panel-options-content"
              id="panel-options-header"
              className={styles.accordionSummary}
            >
              <span className="w-7 inline-block">
                <ClipboardIcon className="text-centraBlue" />
              </span>
              <span className="inline-block">
                <Typography
                  sx={{ flexShrink: 0 }}
                  className={styles.accordionLabel}
                >
                  Orders
                </Typography>
              </span>
            </AccordionSummary>
            <AccordionDetails>
              {" "}
              <div className="pt-1">
                <div className="text-center pt-3">
                  <Button
                    className="w-full"
                    type="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/remake");
                      //dispatch(menuSlice.actions.updateIsLoading(true));
                    }}
                  >
                    <ButtonLabel
                      label={"Remakes"}
                      faIconName={"fa-rotate-right"}
                      buttonAction={MenuActions.batchReschedule}
                    />
                  </Button>
                </div>
              </div>
              <div className="pt-1">
                <div className="text-center pt-3">
                  <Button
                    className="w-full"
                    type="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/service");
                      //dispatch(menuSlice.actions.updateIsLoading(true));
                    }}
                  >
                    <ButtonLabel
                      label={"Services"}
                      faIconName={"fa-truck-fast"}
                      buttonAction={MenuActions.batchReschedule}
                    />
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )}
        {false && (
          <Accordion
            expanded={expanded === "panel-reports"}
            onChange={handleChange("panel-reports")}
            className={styles.accordion}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
              aria-controls="panel-search-content"
              id="panel-search-header"
              className={styles.accordionSummary}
            >
              <span className="inline-block w-7">
                <SearchIcon className="text-centraBlue" />
              </span>
              <span className="inline-block">
                <Typography
                  sx={{ flexShrink: 0 }}
                  className={styles.accordionLabel}
                >
                  Reports
                </Typography>
              </span>
            </AccordionSummary>
            <AccordionDetails style={{ border: "none !important" }}>
              <div className="pt-4">
                <div className="text-center">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      router.push(
                        `${Pages.dailyReport}/reports/daily/${department.key}`
                      );
                    }}
                  >
                    <i className="fa-solid fa-list-check pr-2"></i>
                    <span className="text-sm">Daily Production Schedule</span>
                  </button>
                </div>
                <div className="pt-3">
                  <button className="btn btn-primary w-full">
                    <i className="fa-solid fa-file-import pr-2"></i>
                    <span className="text-sm">Weekly Stats</span>
                  </button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion
          expanded={expanded === "panel-options"}
          onChange={handleChange("panel-options")}
          className={styles.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
            aria-controls="panel-options-content"
            id="panel-options-header"
            className={styles.accordionSummary}
          >
            <span className="w-7 inline-block">
              <OptionsIcon className="text-centraBlue" />
            </span>
            <span className="inline-block">
              <Typography
                sx={{ flexShrink: 0 }}
                className={styles.accordionLabel}
              >
                Options
              </Typography>
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <Options />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
