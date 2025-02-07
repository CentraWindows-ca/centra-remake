"use client"
import React from "react";
import { useSelector } from "react-redux";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { Popconfirm } from "antd";

export default function ActionModal(props) {
  const { isReadOnly } = useSelector(state => state.app);

  const {
    cancelLabel,
    okLabel,
    id,
    key,
    leftButton,
    leftButtonLabel,
    leftButtonType,
    okDisabled,
    onCancel,
    onLeftButton,
    onOk,
    open,
    popConfirmOkTitle,
    popConfirmOkDescription,
    popConfirmCancelTitle,
    popConfirnCancelDescription,
    showCancel,
    style,
    title,
    disableOkPopConfirm,
    disableCancelPopConfirm

  } = props;

  const {
    isMobile
  } = useSelector(state => state.app);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: "3px"
      }}>
        <div
          style={{ ...style, fontFamily: "inherit" }}
          key={key}
        >
          <div style={{ borderRadius: "3px", padding: "20px 20px 0 20px" }} className="flex flex-row justify-between">
            <div style={{ fontFamily: "inherit", fontWeight: 500, fontSize: "1.1rem", marginTop: "-7px" }}>
              {title}
            </div>
            {!isReadOnly &&
            <Popconfirm
              placement="bottom"
              title={popConfirmCancelTitle}
              description={popConfirnCancelDescription}
              onConfirm={onCancel}
              okText="Ok"
              cancelText="Cancel"
            >
              <i
                className="bi bi-x hover:cursor-pointer"
                style={{ fontSize: "2rem", marginTop: "-1.2rem", marginRight: "-0.5rem", color: "darkgrey" }}
              />
            </Popconfirm>
          }
           {isReadOnly &&
                  <button
                    className=" btn bi bi-x hover:cursor-pointer"
                    style={{ fontSize: "2rem", marginTop: "-1.2rem", marginRight: "-0.5rem", color: "darkgrey" }}

                    onClick={onCancel}
                  >
                  </button>
                }
          </div>  

          <div style={{ minWidth: isMobile ? "20rem" : "30rem", minHeight: "10rem" }}>
            {props.children}
          </div>
          <div className="pt-3 pb-3 relative">
            <div className="flex flex-row justify-between pr-4 pl-4 pt-3">
              <div>
                {leftButton && <button className={`btn btn-${leftButtonType} mr-2`} style={{ fontSize: "0.9rem" }} onClick={onLeftButton}>{leftButtonLabel}</button>}
              </div>
              <div className="flex flex-row justify-end">
                {showCancel &&
                  <button className="btn btn-secondary mr-2" style={{ fontSize: "0.9rem" }} onClick={onCancel}>{cancelLabel}</button>
                }

                {!disableOkPopConfirm &&
                  <Popconfirm
                    placement="bottom"
                    title={popConfirmOkTitle}
                    description={popConfirmOkDescription}
                    onConfirm={onOk}
                    okText="Ok"
                    cancelText="Cancel"
                  >
                    <button
                      className="btn btn-primary"
                      disabled={okDisabled}
                      style={{ fontSize: "0.9rem" }}
                    >
                      {okLabel || "Save"}
                    </button>
                  </Popconfirm>
                }

                {disableOkPopConfirm &&
                  <button
                    className="btn btn-primary"
                    disabled={okDisabled}
                    style={{ fontSize: "0.9rem" }}
                    onClick={onOk}
                  >
                    {okLabel || "Save"}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}
