"use client";
import styles from "./installationWorkorder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import LockButton from "app/components/atoms/lockButton/lockButton";
import WOInfoBar from "app/components/atoms/workorderComponents/woInfoBar";
import CustomerInfoBar from "app/components/atoms/workorderComponents/customerInfoBar";
import WORoot from "app/components/atoms/workorderComponents/woRoot";
import Overview from "./subComponents/overview";
import Parameters from "./subComponents/parameters";
import StaffAllocation from "./subComponents/staffAllocation";
import Documents from "./subComponents/documents";
import Summary from "./subComponents/summary";
import Photos from "./subComponents/photos";
import CallLogs from "./subComponents/callLogs";
import Notes from "./subComponents/notes";
import JobReview from "./subComponents/jobReview";
import Remeasure from "./subComponents/remeasure";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import Schedule from "app/components/templates/installationWorkorder/subComponents/schedule";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import Collapse from "@mui/material/Collapse";
import { Tag, Rate, Text, Input } from "antd";
const { TextArea } = Input;
import { useInView, InView } from "react-intersection-observer";
import { useQuery } from "react-query";
import moment from "moment";

import { Installation } from "app/utils/constants";

import {
  fetchInstallationWorkOrder,
  fetchInstallersById,
  fetchInstallationStaff,
} from "app/api/installationApis";

export default function InstallationWorkOrder(props) {
  const dispatch = useDispatch();

  const {
    onChange,
    onCloseCallback,
    //setShowProductionWorkorder,
    viewConfig,
    action,
    className,
  } = props;

  const { workOrderData: workOrderDataFromParent } = useSelector(
    (state) => state.calendar
  );

  const [inputData, setInputData] = useState(null);
  const [statusKey, setStatusKey] = useState(null);
  const [crew, setCrew] = useState({});
  const [staff, setStaff] = useState([]);

  const [showAttachments, setShowAttachments] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [showJobReview, setShowJobReview] = useState(false);
  const [showRemeasure, setShowRemeasure] = useState(false);
  const [showProductionStatus, setShowProductionStatus] = useState(false);
  const [showInstallationStatus, setShowInstallationStatus] = useState(false);

  const {
    isFetching,
    data: workOrderDataRaw,
    refetch,
    remove,
  } = useQuery(
    "installationWorkorder",
    () => {
      if (workOrderDataFromParent?.workOrderNumber) {
        return fetchInstallationWorkOrder(
          workOrderDataFromParent.workOrderNumber
        );
      }
    },
    { enabled: true }
  );

  const {
    isFetchingInstallers,
    data: installersRaw,
    refetchInstallers,
    removeInstallers,
  } = useQuery(
    "installationInstallers",
    () => {
      if (workOrderDataFromParent?.workOrderNumber) {
        return fetchInstallersById(workOrderDataFromParent.workOrderNumber);
      }
    },
    { enabled: true }
  );

  const {
    isFetchingStaff,
    data: staffRaw,
    refetchStaff,
    removeStaff,
  } = useQuery(
    "installationStaff",
    () => {
      if (workOrderDataFromParent?.workOrderNumber) {
        return fetchInstallationStaff();
      }
    },
    { enabled: true }
  );

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  useEffect(() => {
    if (workOrderDataRaw?.data) {
      setInputData({ ...workOrderDataRaw.data });
    }
  }, [workOrderDataRaw]);

  useEffect(() => {
    if (installersRaw?.data) {
      setCrew((x) => {
        let _x = { ...x };
        _x.seniorInstaller = installersRaw.data?.seniorInstaller;
        _x.installers = installersRaw?.data?.CrewNames
          ? installersRaw.data.CrewNames.replace(/(\r\n|\n|\r)/gm, "")?.split(
              ","
            )
          : [];
        _x.remeasurer = installersRaw.data?.RemeasureName;
        return _x;
      });
    }
  }, [installersRaw]);

  useEffect(() => {
    if (staffRaw?.data) {
      setStaff(staffRaw?.data);
    }
  }, [staffRaw]);

  /* Grouped array (If they prefer the old style)
  useEffect(() => { // Staff selection options
    if (staff?.length > 0) {
      console.log("staff ", staff);
      let groupedArray = [];
      const sortedObject = {};
      const reduced = staff.map(x => {
        return ({
          installerLevel: x.installerLevel,
          label: x.name,
          value: x.userId
        })
      })
      if (reduced) {
        const objectGrouped = Object.groupBy(reduced, s =>
          `Installer Level ${s.installerLevel}`
        );
        const keys = Object.keys(objectGrouped);
        if (keys) {
          keys.sort();
          keys.forEach(key => {
            sortedObject[key] = objectGrouped[key];
          });
          for (const [key, value] of Object.entries(sortedObject)) {
            groupedArray.push({ label: key, options: [...value] });
          }
        }                
        setStaffOptions(groupedArray.reverse());
      }      
    }
  }, [staff]);
  */

  const handleCloseWorkOrder = useCallback(() => {
    //if (!saveDisabled) {
    //setShowExitConfirmation(true);
    //} else {
    //resetWorkOrderState();
    remove();
    onCloseCallback();
    //}
  }, [onCloseCallback, remove]);

  const handleScrollToView = (elName) => {
    if (elName) {
      setShowNotes(false);
      setShowCallLogs(false);
      setShowJobReview(false);
      setShowRemeasure(false);
      setShowProductionStatus(false);
      setShowInstallationStatus(false);

      switch (elName) {
        case "notes":
          setShowNotes(true);
          break;
        case "callLogs":
          setShowCallLogs(true);
          break;
        case "jobReview":
          setShowJobReview(true);
          break;
        case "remeasure":
          setShowRemeasure(true);
          break;
        case "productionStatus":
          setShowProductionStatus(true);
          break;
        case "installationStatus":
          setShowInstallationStatus(true);
          break;
        default:
          break;
      }

      let header = document.getElementById(`title-${elName}`);

      if (header) {
        setTimeout(
          () => header.scrollIntoView({ top: 0, behavior: "smooth" }),
          400
        );
      }
    }
  };

  //const showClosePopup = [...orderChangeItems, ...notesChangeItems, ...dateChangeItems]?.length > 0;
  const showClosePopup = false;

  console.log("workOrderDataRaw.data ", workOrderDataRaw?.data);

  const handleExpandCollapseCallback = useCallback((type) => {
    if (type) {
      switch (type) {
        case "callLogs":
          setShowCallLogs((x) => !x);
          break;
        case "notes":
          setShowNotes((x) => !x);
          break;
        case "jobReview":
          setShowJobReview((x) => !x);
          break;
        case "installationStatus":
          setShowInstallationStatus((x) => !x);
          break;
        case "productionStatus":
          setShowProductionStatus((x) => !x);
          break;
        case "remeasure":
          setShowRemeasure((x) => !x);
          break;
        case "attachments":
          setShowAttachments((x) => !x);
          break;
        default:
          break;
      }
    }
  }, []);

  const handleInputChange = (key, val) => {
    setInputData((x) => {
      let _x = { ...x };
      _x[key] = val;
      return _x;
    });
  };

  const handleCrewInputChange = (type, val) => {
    setCrew((x) => {
      let _x = { ...x };
      _x[type] = val;
      return _x;
    });
  };

  const handleDateRangeChange = useCallback((date, dateString) => {
    if (dateString?.length === 2) {
      setInputData((prev) => {
        let _prev = { ...prev };
        if (
          moment(dateString[0]).format("MM/DD/YYYY HH:mm:ss") !== "Invalid Date"
        ) {
          _prev.scheduledDate = moment(dateString[0]).format(
            "MM/DD/YYYY HH:mm:ss"
          );
        }
        if (
          moment(dateString[1]).format("MM/DD/YYYY HH:mm:ss") !== "Invalid Date"
        ) {
          _prev.endTime = moment(dateString[1]).format("MM/DD/YYYY HH:mm:ss");
        }
        return _prev;
      });
    }
  }, []);

  const handleRadioChange = useCallback((e) => {
    if (e?.target?.value) {
      setInputData((prev) => {
        let _prev = { ...prev };
        _prev.jobDifficulty = e?.target?.value?.toUpperCase();
        return _prev;
      });
    }
  }, []);

  useEffect(() => {
    console.log("workOrderDataFromParent ", workOrderDataFromParent);
  }, [workOrderDataFromParent]);

  useEffect(() => {
    console.log("inputData ", inputData);
  }, [inputData]);

  return (
    <WORoot
      className={className}
      readOnlyData={workOrderDataFromParent}
      inputData={inputData}
      viewConfig={viewConfig}
      showClosePopup={showClosePopup}
      onClose={handleCloseWorkOrder}
      styles={styles}
    >
      {inputData && !workOrderDataFromParent?.error && (
        <div
          className={`flex flex-col`}
          style={{
            zIndex: 0,
            position: viewConfig?.stickyHeader ? "sticky" : "relative",
          }}
        >
          <WOInfoBar
            statusKey={statusKey}
            setStatusKey={setStatusKey}
            viewConfig={viewConfig}
            data={workOrderDataRaw?.data}
            inputData={inputData}
            // handleStatusOk={handleStatusOk} - Implement when  apis are ready
            // updateStatus={updateStatus}
            ref={ref}
          />
          <CustomerInfoBar
            viewConfig={viewConfig}
            data={workOrderDataRaw?.data}
            sections={[
              { key: "notes", label: "Notes" },
              { key: "callLogs", label: "Call Logs" },
              { key: "remeasure", label: "Remeasure" },
              { key: "jobReview", label: "Job Review" },
              { key: "production", label: "Production" },
              { key: "installation", label: "Installation" },
            ]}
            handleScrollToView={handleScrollToView}
            type={Installation}
            sectionsStyle={{ width: "35rem" }}
          />
          <div
            className={""}
            style={{ ...props.style, overflowY: "scroll" }}
            id={"main-body"}
          >
            <div className="border-1 border-dotted border-slate-200 mt-2 pl-2 pr-2 pb-2 rounded mb-3 mr-4">
              <div className={styles.grid}>
                <div>
                  <Schedule
                    {...{
                      inputData,
                      onChange: handleDateRangeChange,
                    }}
                  />
                  <Overview
                    //WorkOrderSelectOptions={WorkOrderSelectOptions}
                    inputData={inputData}
                    //handleInputChange={handleInputChange}
                    //handleSelectChange={handleSelectChange}
                    //orderChangeItems={orderChangeItems}
                    //isSearchView={!viewConfig.stickyHeader}
                    crew={crew}
                    staffOptions={staff}
                    className="min-w-[18rem]"
                    radioChange={handleRadioChange}
                  />
                </div>

                <Parameters
                  //WorkOrderSelectOptions={WorkOrderSelectOptions}
                  inputData={inputData}
                  //handleInputChange={handleInputChange}
                  //handleSelectChange={handleSelectChange}
                  //orderChangeItems={orderChangeItems}
                  //isSearchView={!viewConfig.stickyHeader}
                  crew={crew}
                  staffOptions={staff}
                  style={{ minHeight: "10rem" }}
                  handleInputChange={handleInputChange}
                  className="min-w-[13rem]"
                />
                <StaffAllocation
                  crew={crew}
                  inputData={inputData}
                  staffOptions={staff}
                  handleCrewInputChange={handleCrewInputChange}
                />

                <Summary inputData={inputData} />
              </div>
              <div className="flex flex-row justify-end pt-3">
                <LockButton
                  tooltip={"Save Order Info and Order Options"}
                  onClick={() => {}}
                  //disabled={(orderChangeItems?.length === 0 && dateChangeItems?.length === 0) || isReadOnly}
                  //showLockIcon={isReadOnly}
                  disabled={true}
                  label={"Save"}
                />
              </div>
            </div>

            <div className="border-1 border-dotted border-slate-200 mt-2 pl-2 pr-2 pb-2 rounded mb-3 mr-4 bg-[#FAFAFA]">
              <div className="grid grid-cols-12 gap-[1rem] m-1">
                <Documents
                  {...{
                    inputData,
                    showAttachments,
                    handleExpandCollapseCallback,
                    viewConfig,
                    className,
                    workOrderNumber: workOrderDataFromParent.workOrderNumber,
                  }}
                />

                <Photos
                  {...{
                    inputData,
                    showAttachments,
                    handleExpandCollapseCallback,
                    viewConfig,
                    className,
                    workOrderNumber: workOrderDataFromParent.workOrderNumber,
                  }}
                />
              </div>
            </div>

            <div className="mr-4">
              <div
                className="w-100 h-[1px] mt-3"
                style={{ borderTop: "1px dotted lightgrey" }}
              ></div>
              <CollapsibleGroup
                id={"title-remeasure"}
                title={
                  "Logistics [ Remeasure | Remeasure Return Trip | Return Trip ]"
                }
                //subTitle={`W: ${windowItemCount.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length} | GL: ${windowGlassCount.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("remeasure")
                }
                value={viewConfig?.expanded ? true : showRemeasure}
                style={{ marginTop: "1rem" }}
                ActionButton={() => (
                  <Tooltip title="Add a note">
                    <Tag
                      color="#3B82F6"
                      className="text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <i className="fa-solid fa-plus" />
                    </Tag>
                  </Tooltip>
                )}
              >
                <Collapse
                  in={viewConfig?.expanded ? true : showRemeasure}
                ></Collapse>
              </CollapsibleGroup>

              <Notes
                {...{
                  inputData,
                  viewConfig,
                  showNotes,
                  setShowNotes,
                  className,
                  handleExpandCollapseCallback,
                  recordId: workOrderDataFromParent.recordId, // For fetching notes
                  actionItemId: workOrderDataFromParent.actionItemId, // For updating notes
                }}
              />

              <CallLogs
                {...{
                  inputData,
                  viewConfig,
                  showCallLogs,
                  className,
                  handleExpandCollapseCallback,
                  recordId: workOrderDataFromParent.recordId, // For fetching notes
                  actionItemId: workOrderDataFromParent.actionItemId, // For updating notes
                }}
              />

              <div
                className="w-100 h-[1px] mt-3"
                style={{ borderTop: "1px dotted lightgrey" }}
              ></div>

              <JobReview
                {...{
                  key: workOrderDataFromParent.workOrderNumber,
                  inputData,
                  viewConfig,
                  showJobReview,
                  className,
                  handleExpandCollapseCallback,
                  recordId: workOrderDataFromParent.recordId,
                  actionItemId: workOrderDataFromParent.actionItemId,
                  workOrderNumber: workOrderDataFromParent.workOrderNumber,
                }}
              />

              <CollapsibleGroup
                id={"title-production"}
                title={"Production Status"}
                //subTitle={`W: ${windowItemCount.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length} | GL: ${windowGlassCount.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("productionStatus")
                }
                value={viewConfig?.expanded ? true : showProductionStatus}
                style={{ marginTop: "1rem" }}
              >
                <Collapse
                  in={viewConfig?.expanded ? true : showProductionStatus}
                >
                  <Notes className="p-2" />
                </Collapse>
              </CollapsibleGroup>

              <CollapsibleGroup
                id={"title-installation"}
                title={"Installation Status"}
                //subTitle={`W: ${windowItemCount.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length} | GL: ${windowGlassCount.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("installationStatus")
                }
                value={viewConfig?.expanded ? true : showInstallationStatus}
                style={{ marginTop: "1rem" }}
              >
                <Collapse
                  in={viewConfig?.expanded ? true : showInstallationStatus}
                >
                  <Notes className="p-2" />
                </Collapse>
              </CollapsibleGroup>
            </div>
          </div>
        </div>
      )}
    </WORoot>
  );
}
