"use client";
import styles from "./remakeWorkorder.module.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import Group from "../../workorderComponents/group";
import LabelItem from "../../workorderComponents/labelItem";
import { Pages } from "app/utils/constants";
import { ProductionEventStates } from "app/utils/constants";

import DocumentRow from "app/components/atoms/documentRow/documentRow";

export default function Remake(props) {
  const [showPhoto, setShowPhoto] = useState(false);
  const { setShowRemakeWorkorder } = props;

  const router = useRouter();

  // TODO: Convert to component
  const Tooltip = (props) => {
    const { title } = props;
    return (
      <div
        data-toggle="tooltip"
        data-placement="right"
        title={title}
        data-html="true"
        className="inline"
      >
        {props.children}
      </div>
    );
  };

  const handleCloseWorkOrder = (e, router, view) => {
    setShowRemakeWorkorder(false);
    router.push(`?view=return`, undefined, { shallow: true });
  };

  return (
    <div
      className={`${styles.root}`}
      style={{ ...props.style }}
      id={"title-main"}
    >
      <div className="flex flex-row justify-between">
        <div className={`${styles.workOrderText}`}>
          {/*<span>{selectedCalendar?.value} Work Order</span>*/}
          <span>Remake Work Order</span>
          {/*<span className={styles.workOrderValue}>{inputData?.workOrderNumber}</span>*/}
          <span className={`${styles.workOrderValue}`}>111222333</span>
          <span
            className={styles.workOrderStatus}
            style={{
              //backgroundColor: EventStates[data?.state]?.color,
              backgroundColor: "#A5D6A7",
              //color: data?.state === "readyToShip" ? "var(--darkgray)" : "#FFF"
              borderRadius: "2px",
            }}
          >
            {/*{EventStates[data?.state]?.label}*/}
            <span style={{ padding: "0 5px" }}>In Progress</span>
          </span>
        </div>
        <Tooltip title={"Close"}>
          <FontAwesomeIcon
            icon={faXmark}
            size="xl"
            className="text-slate-500 cursor-pointer"
            onClick={(e) => {
              handleCloseWorkOrder(e, router, Pages.month);
            }}
          />
        </Tooltip>
        {false && (
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              handleCloseWorkOrder(e, router, Pages.month);
            }}
          >
            <i className="bi bi-chevron-left" style={{ paddingRight: "6px" }} />
            Back to Calendar
          </button>
        )}
      </div>
      <hr style={{ margin: "15px 0 5px 0" }} />
      <div className="flex flex-row justify-between">
        <Group
          title={"Order Details"}
          style={{ minWidth: "28rem", marginRight: "1rem" }}
          contentStyle={{
            padding: "0.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateColumns: "3fr 3fr",
            rowGap: "0.3rem",
          }}
          className={styles.groupSchedule}
        >
          <LabelItem name={"Item Number"} value={"5"} />
          <LabelItem name={"Product"} value={"Sealed Unit"} />
          <LabelItem name={"Job Type"} value={"SI"} />
          <LabelItem name={"Department Responsible"} value={"Manufacturing"} />
          <LabelItem name={"Requested By"} value={"Christian"} />
          <LabelItem name={"Reason"} value={"Broken/Cracked/Chipped"} />
          <LabelItem name={"Schedule Date"} value={"2023-07-31"} />
          <LabelItem name={"Notes"} value={"Broken by 6800 line"} />
          <LabelItem name={"Date Completed"} value={"2023-07-31"} />
        </Group>
        <div className="flex flex-column justify-between">
          <Group
            title={"Photos"}
            style={{ minWidth: "21rem", height: "100%" }}
            contentStyle={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
            className={styles.groupSchedule}
          >
            <Image
              src="/remake-demo.jfif"
              alt="remake-photo-filename1"
              width={500} // Properties for resolution, not size
              height={500}
              priority
              style={{
                width: "65px",
                height: "auto",
                margin: "10px 5px 5px 5px",
              }}
              className="cursor-pointer"
              onClick={() => setShowPhoto(true)}
            />
            <Image
              src="/remake-demo.jfif"
              alt="remake-photo-filename2"
              width={500} // Properties for resolution, not size
              height={500}
              priority
              style={{
                width: "65px",
                height: "auto",
                margin: "10px 5px 5px 5px",
              }}
              className="cursor-pointer"
            />
          </Group>
          <Group
            title={"Documents"}
            style={{ minWidth: "21rem", height: "100%" }}
            contentStyle={{
              padding: "0.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateColumns: "2fr 3fr",
              rowGap: "0.3rem",
            }}
            className={styles.groupSchedule}
          >
            <table>
              <tbody>
                <tr>
                  <DocumentRow
                    filename="test.txt"
                    base64={
                      "data:text/plain;base64,aW5zdGFsbGF0aW9uDQpyZW1lYXN1cmUNCnJlbWFrZQ0KDQo="
                    }
                    type={"text/plain"}
                  />
                </tr>
              </tbody>
            </table>
          </Group>
        </div>
        <Modal
          open={showPhoto}
          onClose={() => {
            setShowPhoto(false);
          }}
          aria-labelledby="remake-photo-modal-title"
          aria-describedby="remake-photo-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "3px",
            }}
            className={styles.mapModal}
          >
            <Image
              src="/remake-demo.jfif"
              alt="remake filename"
              width={500} // Properties for resolution, not size
              height={500}
              priority
              style={{ width: "auto", height: "auto" }}
              onClick={() => setShowPhoto(true)}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}
