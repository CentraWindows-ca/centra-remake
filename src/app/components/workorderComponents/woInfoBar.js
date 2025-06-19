"use client";
import styles from "./workorderComponents.module.css";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Tooltip from "app/components/tooltip/tooltip";
import EditableLabel from "app/components/editableLabel/editableLabel";
import Title from "app/components/title/title";
import WOStatus from "app/components/woStatus/woStatus";

import { mapProductionStateToKey, getKeyFromVal } from "app/utils/utils";
import { ProductionStates, InstallationStates, Production, Installation } from "app/utils/constants";

import {
  updateProdOrder,
} from 'app/api/productionApis';

export default function WOInfoBar(props) {
  const {
    data,
    statusKey,
    setStatusKey,    
    handleStatusOk,
    updateStatus,
    type
  } = props;

  const { isMobile } = useSelector(state => state.app);

  const { department } = useSelector(state => state.calendar);

  const [statusList, setStatusList] = useState(ProductionStates);

  useEffect(() => {
    if (data && setStatusKey && department) {
      if (data.currentStateName) {
        switch (department.key) {
          case Production:
            setStatusKey(mapProductionStateToKey(data.currentStateName)); // Special function needed due to inconsistent state data
            break;
          case Installation:            
            setStatusKey(getKeyFromVal(InstallationStates, data.currentStateName));
            setStatusList(InstallationStates);
            break;
          default:
            break;
        }        
      }
    }
  }, [data, setStatusKey, department]);

  const handleSave = useCallback((keyVal) => {
    if (data && keyVal) {      
      let updateData = { actionItemId: data.actionItemId, ...keyVal };  
      updateProdOrder(updateData)
    }    
  }, [data]);

  return (
    <div className="flex flex-col flex-start pb-2 mr-8 lg:flex-row">
      <div>
        <Title
          label={""}
          className="inline-block mr-4 pt-1 pb-1"
          Icon={() => { return <i className="fa-solid fa-clipboard-list pr-2" /> }}>
          <span>Work Order #</span>
          <span className="font-semibold pl-2 pr-2">{data?.workOrderNumber}</span>
        </Title>
        {statusKey &&
          <WOStatus
            statusKey={statusKey}
            setStatusKeyCallback={setStatusKey}
            handleStatusOkCallback={handleStatusOk}
            updateStatusCallback={updateStatus}
            handleStatusCancelCallback={() => { }}
            statusList={statusList}
          />
        }
        {false &&
          <span className="pl-2 pt-1 cursor-pointer text-blue-800 hover:text-blue-500">
            <Tooltip title="Communication History">
              <i className="bi bi-chat-left-text mr-2"></i>
            </Tooltip>
          </span>
        }
      </div>

      {type === Production &&
        <div className={`${styles.siteContactContainer} lg:pl-4 lg:pt-1`}>
          <div className={`${styles.customerInfoIcon} pr-1`} style={{ paddingTop: "3px" }}>
            <Tooltip title="Site Contact">
              <i className="fa-solid fa-phone-volume"></i>
            </Tooltip>
          </div>
          <EditableLabel
            key={data?.actionItemId}
            inputKey={"siteContact"}
            title={"Edit Site Contact"}
            value={data?.siteContact}
            onSave={handleSave}
            iconClass="mt-[2px] text-blue-500"
          >
            <div className={`${styles.siteContactText}`}>{data?.siteContact}</div>
          </EditableLabel>
        </div>
      }
    </div>
  )
}