"use client"
import React from "react";
import { useSelector } from "react-redux";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Popconfirm } from "antd";
const { Text } = Typography;

export default function WORoot(props) {
  const {
    className,
    styles,
    readOnlyData,
    inputData,
    viewConfig,        
    showClosePopup,
    onClose
  } = props;

  const { isReadOnly } = useSelector(state => state.app);

  return (
    <div className={`${className}`}>
      {!inputData && !viewConfig?.hideLoading &&
        <div className={`${styles?.workOrderOuterContainer} z-0 flex items-center justify-center`} style={{ width: viewConfig?.width ?? "90vw", height: viewConfig?.height ?? "85vh" }}>
          {!readOnlyData?.error &&
            <div className="flex flex-row text-gray-400">
              <div style={{ marginTop: "-3px" }}><LoadingOutlined spin className="mr-2" /></div>
              <div className="text-sm">
                <Text type="secondary">Loading...</Text>
              </div>
            </div>
          }
          {readOnlyData?.error &&
            <div className="text-sm text-red-400">
              <div className="text-center">
                <i className="fa-solid fa-circle-exclamation"></i> <Text type="danger">Unable to load work order, please refresh the page.</Text>
              </div>
              <div className="text-center">
                <Text type="danger">  If the issue persists, kindly report it to support@centra.ca.</Text>
              </div>
            </div>
          }
        </div>
      }
      {inputData && !readOnlyData?.error &&
        <div className="absolute right-0 z-10">
          {viewConfig?.stickyHeader &&
            <Tooltip title={"Close"}>
              {(showClosePopup && !isReadOnly) &&
                <Popconfirm
                  placement="left"
                  title={"Close Work Order"}
                  description={<div className="pt-2">
                    <div>Once you close this workorder all your pending changes will be lost. </div>
                    <div>Proceed anyway?</div>
                  </div>}
                  onConfirm={(e) => {
                    onClose();
                  }}
                  okText="Ok"
                  cancelText="Cancel"
                >
                  <FontAwesomeIcon
                    icon={faXmark} size="xl" className="text-slate-500 cursor-pointer pr-4"
                  />
                </Popconfirm>
              }
              {(!showClosePopup || isReadOnly) &&
                <FontAwesomeIcon
                  icon={faXmark} size="xl" className="text-slate-500 cursor-pointer pr-4"
                  onClick={(e) => {
                    onClose();
                  }}
                />
              }
            </Tooltip>
          }
        </div>
      }
      {inputData && !readOnlyData?.error &&
        <>
          {props.children}
        </>
      }
    </div>
  );
}
