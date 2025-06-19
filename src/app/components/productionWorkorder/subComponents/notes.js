"use client";
import styles from '../productionWorkorder.module.css';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import Collapse from '@mui/material/Collapse';
import MultilineInputItem from "app/components/atoms/workorderComponents/multilineInputItem";
import MultilineDateInputItem from "app/components/atoms/workorderComponents/multilineDateInputItem";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import LockButton from "app/components/atoms/lockButton/lockButton";

import { Tag } from "antd";

export default function Notes(props) {
  const {
    handleExpandCollapseCallback,
    handleInputChange,
    handleMultilineInputChange,
    inputData,
    notesChangeItems,
    mgmtChangeItems,
    setShowSaveNotesConfirmation,
    showNotes
  } = props;

  const [notes, setNotes] = useState([]);

  const isEdited = (name, changeItems, alias) => {
    let result = false;

    result = changeItems?.find(x => (x.key === name || x.key === alias));

    return result;
  }

  useEffect(() => {
    // TODO: Move values to const

    if (inputData) {
      let _notes = [];

      if (inputData.shippingNotes) {
        _notes.push({
          key: "shipping",
          value: inputData.shippingNotes,
          title: "Shipping",
          isEdited: isEdited("shippingNotes", notesChangeItems),          
          icon: () => <i className="fa fa-truck" />
        });
      }

      if (inputData.officeNotes) {
        _notes.push({
          key: "officeNotes",
          value: inputData.officeNotes,
          title: "Office",
          isEdited: isEdited("officeNotes", notesChangeItems),
          color: "processing",
          icon: () => <i className="fa fa-id-badge" />
        });
      }

      if (inputData.plantNotes) {
        _notes.push({
          key: "plantNotes",
          value: inputData.plantNotes,
          title: "Plant",
          isEdited: isEdited("plantNotes", notesChangeItems),
          color: "green",
          icon: () => <i className="fa fa-building" />
        });
      }

      if (inputData.projectManagementNotes) {
        _notes.push({
          key: "windowPlantNotes",
          value: inputData.projectManagementNotes,
          title: "Project Management",
          isEdited: isEdited("windowPlantNotes", mgmtChangeItems),
          color: "warning",
          icon: () => <i className="fa fa-square-poll-horizontal" />
        });
      }

      if (inputData.doorShopNotes) {
        _notes.push({
          key: "doorShopNotes",
          value: inputData.doorShopNotes,
          title: "Door Shop",
          isEdited: isEdited("doorShopNotes", notesChangeItems),
          color: "magenta",
          icon: () => <i className="fa fa-door-closed" />
        });
      }

      if (inputData.returnTripNotes) {
        _notes.push({
          key: "returnTripNotes",
          value: inputData.returnTripNotes,
          title: "Returned Job",
          isEdited: isEdited("returnTripNotes", mgmtChangeItems),
          color: "error",
          icon: () => <i className="fa fa-rotate-left" />
        });
      }

      if (_notes.length > 0) {
        setNotes([..._notes]);
      }
    }
  }, [inputData, notesChangeItems, mgmtChangeItems]);

  const { isReadOnly } = useSelector(state => state.app);

  const UnSavedIndicator = (props) => {
    return (<Tooltip title="Unsaved changes"><span className="pl-1 text-amber-500">*</span></Tooltip>)
  }

  const isEmpty = !inputData?.shippingNotes && !inputData?.plantNotes && !inputData?.doorShopNotes && !inputData?.officeNotes && !inputData?.projectManagementNotes && !inputData?.returnTripNotes;

  return (
    <CollapsibleGroup
      id={"title-notes"}
      title={"Notes"}
      value={showNotes}
      expandCollapseCallback={() => handleExpandCollapseCallback("notes")}
      headerStyle={{ backgroundColor: "#FCF8E3" }}
      style={{ marginTop: "1rem" }}
    >
      {isEmpty && !showNotes &&
        <div
          className="pt-2 pb-2 text-center cursor-pointer hover:text-blue-400 text-gray-400"
          onClick={() => handleExpandCollapseCallback("notes")}
        >
          <i className="fa-solid fa-note-sticky pr-2"></i>
          Add Note(s)
        </div>
      }

      {!isEmpty &&
        <Collapse in={!showNotes}>
          <Tooltip title="Click to edit">
            <div className="pl-2 pt-2 pb-2 hover:cursor-pointer" onClick={() => handleExpandCollapseCallback("notes")}>
              {false && <>
                {inputData?.shippingNotes && <div className={styles.notesItem}><Tooltip title="Shipping"><i className="fa fa-truck text-blue-500 w-6" /></Tooltip>{inputData.shippingNotes} {isEdited("shippingNotes", notesChangeItems) && <UnSavedIndicator />}</div>}
                {inputData?.plantNotes && <div className={styles.notesItem}><Tooltip title="Plant"><i className="fa fa-building text-blue-500 w-6" /></Tooltip>{inputData.plantNotes} {isEdited("plantNotes", notesChangeItems) && <UnSavedIndicator />}</div>}
                {inputData?.doorShopNotes && <div className={styles.notesItem}><Tooltip title="Door Shop"><i className="fa fa-door-closed text-blue-500 w-6" /></Tooltip>{inputData.doorShopNotes} {isEdited("doorShopNotes", notesChangeItems) && <UnSavedIndicator />}</div>}
                {inputData?.officeNotes && <div className={styles.notesItem}><Tooltip title="Office"><i className="fa fa-id-badge text-blue-500 w-6" /></Tooltip>{inputData.officeNotes} {isEdited("officeNotes", notesChangeItems) && <UnSavedIndicator />}</div>}
                {inputData?.projectManagementNotes && <div className={styles.notesItem}><Tooltip title="Project Management"><i className="fa fa-square-poll-horizontal text-blue-500 w-6" /></Tooltip>{inputData.projectManagementNotes} {isEdited("windowPlantNotes", mgmtChangeItems) && <UnSavedIndicator />}</div>}
                {inputData?.returnTripNotes && <div className={styles.notesItem}><Tooltip title="Returned Job"><i className="fa fa-rotate-left text-blue-500 w-6" /></Tooltip>{inputData.returnTripNotes} {isEdited("returnTripNotes", mgmtChangeItems) && <UnSavedIndicator />}</div>}
              </>}

              {notes?.map((n) => {
                return (
                  <div key={n.key} className={`${styles.notesItem} inline-block pr-4`} style={{ width: "50%", verticalAlign: "top" }}>
                    <Tooltip title={n.title}>
                      <Tag icon={n.icon()} color={n.color} className="text-xs w-[2rem] text-center"/>                        
                    </Tooltip>
                    <span className="text-gray-500">{n.value}</span>
                    {n.isEdited && <UnSavedIndicator />}
                  </div>
                )
              })}
            </div>
          </Tooltip>
        </Collapse>
      }
      <Collapse in={showNotes}>
        <div style={{ padding: "1rem 0 0.5rem 0" }} className={styles.notesBody}>
          <div className={styles.notesInnerContainer}>
            <MultilineInputItem
              icon={<i className="fa fa-truck w-5" />}
              label={"Shipping"}
              name={"shippingNotes"}
              value={inputData?.shippingNotes}
              onChange={handleMultilineInputChange}
              isEdited={isEdited("shippingNotes", notesChangeItems)}              
            />
            <MultilineInputItem
              icon={<i className="fa fa-building w-4"></i>}
              label={"Plant"}
              name={"plantNotes"}
              value={inputData?.plantNotes}
              onChange={handleMultilineInputChange}
              isEdited={isEdited("plantNotes", notesChangeItems)}
              color={"green"}
            />
            <MultilineInputItem
              icon={<i className="fa fa-door-closed w-5"></i>}
              label={"Door Shop"}
              name={"doorShopNotes"}
              value={inputData?.doorShopNotes}
              onChange={handleMultilineInputChange}
              isEdited={isEdited("doorShopNotes", notesChangeItems)}
              color={"magenta"}
            />
          </div>
          <div className={styles.notesInnerContainer}>
            <MultilineInputItem
              icon={<i className="fa fa-id-badge w-4"></i>}
              label={"Office"}
              name={"officeNotes"}
              value={inputData?.officeNotes}
              onChange={handleMultilineInputChange}
              isEdited={isEdited("officeNotes", notesChangeItems)}
              color={"processing"}
            />
            <MultilineInputItem
              icon={<i className="fa fa-square-poll-horizontal w-4"></i>}
              label={"Project Management"}
              name={"projectManagementNotes"}
              alias={"windowPlantNotes"}
              value={inputData?.projectManagementNotes}
              onChange={handleMultilineInputChange}
              isEdited={isEdited("windowPlantNotes", mgmtChangeItems)}
              color={"warning"}
            />
            <MultilineDateInputItem
              icon={<i className="fa fa-rotate-left w-4"/>}
              label={"Returned Job"}
              name={"returnTripNotes"}
              value={inputData?.returnTripNotes}
              onChange={handleMultilineInputChange}
              onDateChange={handleInputChange}
              date={inputData?.returnTripStartDate}
              isEdited={isEdited("returnTripNotes", mgmtChangeItems)}
              mgmtChangeItems={mgmtChangeItems}
              color={"error"}
            />
          </div>
        </div>
        <div className="pr-2 pb-2 pt-2 float-right">
          <LockButton
            tooltip={"Save Notes"}
            onClick={() => { setShowSaveNotesConfirmation(true); }}
            disabled={(notesChangeItems?.length === 0 && mgmtChangeItems?.length === 0) || isReadOnly}
            showLockIcon={isReadOnly}
            label={"Save"}
          />
        </div>
      </Collapse>
    </CollapsibleGroup>
  )
}