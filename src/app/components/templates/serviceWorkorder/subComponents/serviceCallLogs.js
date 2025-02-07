"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import moment from "moment";

import Collapse from "@mui/material/Collapse";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import CallLogs from "app/components/organisms/callLogs/callLog";
import {
  fetchCallLogs,
  saveCallLog,
  deleteCallLog,
} from "app/api/genericApis/callLogApi";
import { CalledMessageTypes } from "app/utils/constants";

export default function ServiceCallLogs(props) {
  const { moduleId, showCallLogs, onExpandCollapse } = props;

  const moduleName = "service";

  const fetchCallLogsAsync = async () => {
    if (moduleId) {
      const result = await fetchCallLogs(moduleName, moduleId);
      return result.data;
    }
  };

  const {
    isLoading: isLoadingCallLogs,
    data: callLogs,
    isFetching: isFetchingCallLogs,
    refetch: refetchCallLogs,
  } = useQuery([`${moduleName}CallLogs`, moduleId], fetchCallLogsAsync, {
    refetchOnWindowFocus: false,
  });

  const handleCallLogSave = useCallback(
    async (callLog) => {
      if (callLog.id === "") {
        if (callLog.calledDate instanceof Date) {
          //special case for new call logs
          callLog.calledDate = moment(callLog.calledDate).format();
        }
      }

      await saveCallLog(moduleName, callLog);
      refetchCallLogs();
    },
    [refetchCallLogs]
  );

  const handleCallLogDelete = useCallback(
    async (id) => {
      await deleteCallLog(moduleName, id);
      refetchCallLogs();
    },
    [refetchCallLogs]
  );

  const isLoading = isLoadingCallLogs || isFetchingCallLogs;

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <>
      <CollapsibleGroup
        id={"title-callLogs"}
        title={"Call Logs"}
        value={showCallLogs}
        expandCollapseCallback={() => onExpandCollapse("callLogs")}
        headerStyle={{ backgroundColor: "#EBEFF3" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full py-4">
            <span>
              <Spin className="pr-2" indicator={antIcon} /> Loading...
            </span>
          </div>
        ) : (
          <>
            <Collapse in={!showCallLogs}>
              <div
                className={`${
                  callLogs && callLogs.length > 0
                    ? "h-28 w-full  flex items-center justify-center overflow-auto"
                    : ""
                }`}
              >
                <CallLogs
                  mode="compact"
                  moduleId={moduleId}
                  callLogs={callLogs}
                  calledMessageTypes={CalledMessageTypes}
                  handleCallLogSave={handleCallLogSave}
                />
              </div>
            </Collapse>
            <Collapse in={showCallLogs}>
              <div
                style={{ minHeight: "112px" }}
                className={`${
                  callLogs && callLogs.length > 0
                    ? "h-80 w-full flex justify-center overflow-auto"
                    : "max-h-64 overflow-auto"
                }`}
              >
                <CallLogs
                  moduleId={moduleId}
                  callLogs={callLogs}
                  calledMessageTypes={CalledMessageTypes}
                  handleCallLogSave={handleCallLogSave}
                  handleCallLogDelete={handleCallLogDelete}
                />
              </div>
            </Collapse>
          </>
        )}
      </CollapsibleGroup>
    </>
  );
}
