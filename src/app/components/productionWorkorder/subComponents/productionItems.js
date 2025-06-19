"use client";
import styles from "../productionWorkorder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Badge, Popconfirm, Table, Button } from "antd";

import {
  fetchProductionWindows,
  fetchProductionDoors,
  updateProductionItems,
} from "app/api/productionApis";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import LockButton from "app/components/atoms/lockButton/lockButton";
import CreateRemake from "../subComponents/createRemake";
import CreateBackorder from "../subComponents/createBackorder";
import Modal from "app/components/atoms/modal/modal";

import { getTableColumns } from "../utils/productionUtils";

export default function ProductionItems(props) {
  const {
    workOrderNumber,
    workOrderBranch,
    actionItemId,
    parentState,
    customerName,
    stickyHeader,
    action,
  } = props;

  const [fetchWindows, setFetchWindows] = useState(true);
  const [fetchDoors, setFetchDoors] = useState(true);
  const [windowChangeItems, setWindowChangeItems] = useState([]);
  const [doorChangeItems, setDoorChangeItems] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [showCreateRemakes, setShowCreateRemakes] = useState(false);
  const [showCreateBackorders, setShowCreateBackorders] = useState(false);

  const [selectedRowKeysWindows, setSelectedRowKeysWindows] = useState([]);
  const [selectedRowKeysPatioDoors, setSelectedRowKeysPatioDoors] = useState(
    []
  );
  const [selectedRowKeysVinylDoors, setSelectedRowKeysVinylDoors] = useState(
    []
  );
  const [selectedRowKeysExteriorDoors, setSelectedRowKeysExteriorDoors] =
    useState([]);

  const {
    windows,
    setWindows,
    vinylDoors,
    setVinylDoors,
    patioDoors,
    setPatioDoors,
    exteriorDoors,
    setExteriorDoors,
  } = parentState;

  const [selectedWindows, setSelectedWindows] = useState([]);
  const [selectedPatioDoors, setSelectedPatioDoors] = useState([]);
  const [selectedVinylDoors, setSelectedVinylDoors] = useState([]);
  const [selectedExteriorDoors, setSelectedExteriorDoors] = useState([]);

  const [selected, setSelected] = useState([]);

  const {
    isFetching: isFetchingWindows,
    data: windowItems,
    refetch: refetchWindows,
  } = useQuery(
    "productionWindows",
    () => {
      if (workOrderNumber) {
        setFetchWindows(false);
        return fetchProductionWindows(workOrderNumber);
      }
    },
    { enabled: fetchWindows }
  );

  const {
    isFetching: isFetchingDoors,
    data: doorItems,
    refetch: refetchDoors,
  } = useQuery(
    "productionDoors",
    () => {
      if (workOrderNumber) {
        setFetchDoors(false);
        return fetchProductionDoors(workOrderNumber);
      }
    },
    { enabled: fetchDoors }
  );

  const { isReadOnly, result, isMobile } = useSelector((state) => {
    return { ...state.calendar, ...state.app };
  });

  useEffect(() => {
    if (windowItems?.data) {
      // In old web calendar, only CDLC is categorized as a door, 52PD, 61DR and  27DS all come from fetching windows
      setWindows((x) => {
        let _windows = windowItems.data.filter(
          (x) => x.system !== "52PD" && x.system !== "61DR"
        );

        _windows.forEach((x, index) => {
          x.key = index;
        });

        return _windows;
      });

      setPatioDoors((x) => {
        let _patioDoors = windowItems.data.filter((x) => x.system === "52PD");

        _patioDoors.forEach((x, index) => {
          x.key = index;
        });

        return _patioDoors;
      });

      setVinylDoors((x) => {
        let _vinylDoors = windowItems.data.filter((x) => x.system === "61DR");

        _vinylDoors.forEach((x, index) => {
          x.key = index;
        });

        return _vinylDoors;
      });
    }
  }, [windowItems, setWindows, setPatioDoors, setVinylDoors]);

  useEffect(() => {
    if (doorItems?.data) {
      // In old web calendar, only CDLC is categorized as a door, 52PD, 61DR and  27DS all come from fetching windows

      setExteriorDoors((x) => {
        let _exteriorDoors = doorItems.data.filter((x) => x.system === "CDLD");

        _exteriorDoors.forEach((x, index) => {
          x.key = index;
        });

        return _exteriorDoors;
      });
    }
  }, [doorItems, setExteriorDoors]);

  const handleRowStateChange = useCallback(
    (data) => {
      if (data) {
        const { detailRecordId, status, table } = data;

        if (detailRecordId && status && table) {
          switch (table) {
            case "windows":
              setWindows((w) => {
                let _w = [...w];
                let index = _w.findIndex(
                  (x) => x.detailRecordId === detailRecordId
                );
                if (index > -1) {
                  _w[index].status = status.value;
                }
                return _w;
              });
              break;
            case "patioDoors":
              setPatioDoors((w) => {
                let _w = [...w];
                let index = _w.findIndex(
                  (x) => x.detailRecordId === detailRecordId
                );
                if (index > -1) {
                  _w[index].status = status.value;
                }
                return _w;
              });
              break;
            case "exteriorDoors":
              setExteriorDoors((w) => {
                let _w = [...w];
                let index = _w.findIndex(
                  (x) => x.detailRecordId === detailRecordId
                );
                if (index > -1) {
                  _w[index].status = status.value;
                }
                return _w;
              });
              break;
            case "vinylDoors":
              setVinylDoors((w) => {
                let _w = [...w];
                let index = _w.findIndex(
                  (x) => x.detailRecordId === detailRecordId
                );
                if (index > -1) {
                  _w[index].status = status.value;
                }
                return _w;
              });
              break;
            default:
              break;
          }

          setIsModified(true);
        }
      }
    },
    [setExteriorDoors, setPatioDoors, setVinylDoors, setWindows]
  );

  useEffect(() => {
    setWindowChangeItems([...windows]);
  }, [windows]);

  useEffect(() => {
    setDoorChangeItems([...patioDoors, ...vinylDoors, ...exteriorDoors]);
  }, [patioDoors, vinylDoors, exteriorDoors]);

  const handleSave = useCallback(() => {
    let data = {
      workOrderNumber: workOrderNumber,
      actionItemId: actionItemId,
      winItems: windowChangeItems,
      doorItems: doorChangeItems,
    };

    updateProductionItems(data);

    setIsModified(false);
  }, [workOrderNumber, actionItemId, windowChangeItems, doorChangeItems]);

  useEffect(() => {
    if (result?.source) {
      if (result.source === "Create Remake" && result?.type === "success") {
        setShowCreateRemakes(false);
        // uncheckAllCheckboxes();
      }

      if (result.source === "Create Backorder" && result?.type === "success") {
        setShowCreateBackorders(false);
        // uncheckAllCheckboxes();
      }
    }
  }, [result]);

  const onSelectChange = (newSelectedRowKeys, table) => {
    let _selectedWindows = [];
    let _selectedPatioDoors = [];
    let _selectedVinylDoors = [];

    if (newSelectedRowKeys?.length > 0) {
      newSelectedRowKeys.forEach((srk) => {
        let selectedRow = null;

        switch (table) {
          case "windows":
            selectedRow = windows.find((w) => w.key === srk);
            if (selectedRow) {
              _selectedWindows.push(selectedRow);
              setSelectedRowKeysWindows(newSelectedRowKeys);
            }
            break;
          case "patioDoors":
            selectedRow = patioDoors.find((w) => w.key === srk);
            if (selectedRow) {
              _selectedPatioDoors.push(selectedRow);
              setSelectedRowKeysPatioDoors(newSelectedRowKeys);
            }
            break;
          case "vinylDoors":
            selectedRow = vinylDoors.find((w) => w.key === srk);
            if (selectedRow) {
              _selectedVinylDoors.push(selectedRow);
              setSelectedRowKeysVinylDoors(newSelectedRowKeys);
            }
            break;
          case "exteriorDoors":
            selectedRow = exteriorDoors.find((w) => w.key === srk);
            if (selectedRow) {
              _selectedExteriorDoors.push(selectedRow);
              setSelectedRowKeysExteriorDoors(newSelectedRowKeys);
            }
            break;
          default:
            break;
        }
      });
    }

    if (table === "windows") {
      setSelectedWindows(_selectedWindows);
    }

    if (table === "patioDoors") {
      setSelectedPatioDoors(_selectedPatioDoors);
    }

    if (table === "vinylDoors") {
      setSelectedVinylDoors(_selectedVinylDoors);
    }

    if (table === "exteriorDoors") {
      setSelectedExteriorDoors(_selectedExteriorDoors);
    }
  };

  const getRowSelection = (state, table) => {
    return {
      state,
      onChange: (newSelectedRowKeys) => {
        onSelectChange(newSelectedRowKeys, table);
      },
      type: isMobile ? "radio" : "checkbox",
    };
  };

  useEffect(() => {
    setSelected([
      ...selectedPatioDoors,
      ...selectedWindows,
      ...selectedVinylDoors,
      ...selectedExteriorDoors,
    ]);
  }, [
    selectedWindows,
    selectedPatioDoors,
    selectedVinylDoors,
    selectedExteriorDoors,
  ]);

  useEffect(() => {
    if (result?.type === "success" && result?.source === "Production Items") {
      refetchWindows();
    }
  }, [result, refetchWindows]);

  return (
    <>
      <div
        className="pr-3 pt-3 pb-3 flex flex-row justify-between bg-white z-10"
        style={{
          top: 0,
          borderBottom: "1px solid lightgrey",
          position: stickyHeader ? "sticky" : "relative",
        }}
      >
        <div className="pl-4">
          <Badge color={"#007BFF"} count={selected.length}>
            <div
              style={{
                border: action ? "" : "1px dotted lightgrey",
                width: `${!action ? "15rem" : "100%"}`,
              }}
              className="flex flex-row justify-between p-2 rounded"
            >
              {(action === "remake" || !action) && (
                <Button
                  onClick={() => setShowCreateRemakes(true)}
                  disabled={selected.length === 0}
                >
                  <i className="fa-solid fa-rotate-right pr-1"></i>
                  Remake
                </Button>
              )}
              {(action === "backorder" || !action) && (
                <Button
                  onClick={() => setShowCreateBackorders(true)}
                  disabled={selected.length === 0}
                >
                  <i className="fa-solid fa-angles-left pr-1"></i>
                  Backorder
                </Button>
              )}
            </div>
          </Badge>
        </div>
        <Tooltip
          title="Save Production Items"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Popconfirm
            placement="left"
            title={"Save Confirmation"}
            description={"Do you want to proceed with the state update(s)?"}
            onConfirm={handleSave}
            okText="Ok"
            cancelText="Cancel"
          >
            <LockButton
              tooltip={"Save Production Items"}
              disabled={!isModified || isReadOnly}
              showLockIcon={isReadOnly}
              label={"Save"}
            />
          </Popconfirm>
        </Tooltip>
      </div>

      <div className={`${styles.tableTitle} pt-4`}>Windows</div>

      {windows?.length > 0 ? (
        <>
          <Table
            rowSelection={getRowSelection(selectedRowKeysWindows, "windows")}
            columns={getTableColumns(
              isMobile ? "productionVertical" : "windows",
              windows,
              handleRowStateChange,
              !isReadOnly
            )}
            dataSource={windows}
            pagination={false}
            bordered={false}
          />
        </>
      ) : (
        <div className="pl-6 pt-4 text-red-800">
          *This order does not contain any Windows.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Patio Doors</div>

      {patioDoors?.length > 0 ? (
        <>
          <Table
            rowSelection={getRowSelection(
              selectedRowKeysPatioDoors,
              "patioDoors"
            )}
            columns={getTableColumns(
              isMobile ? "productionVertical" : "patioDoors",
              patioDoors,
              null,
              !isReadOnly
            )}
            dataSource={patioDoors}
            pagination={false}
            bordered={false}
          />
        </>
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Patio doors.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Vinyl Doors</div>

      {vinylDoors?.length > 0 ? (
        <Table
          rowSelection={getRowSelection(
            selectedRowKeysVinylDoors,
            "vinylDoors"
          )}
          columns={getTableColumns(
            isMobile ? "productionVertical" : "vinylDoors",
            vinylDoors,
            null,
            !isReadOnly
          )}
          dataSource={vinylDoors}
          pagination={false}
          bordered={false}
          className="pt-4"
        />
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Vinyl doors.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Exterior Doors</div>

      {exteriorDoors?.length > 0 ? (
        <Table
          rowSelection={getRowSelection(
            selectedRowKeysExteriorDoors,
            "exteriorDoors"
          )}
          columns={getTableColumns(
            isMobile ? "productionVertical" : "exteriorDoors",
            exteriorDoors,
            null,
            !isReadOnly
          )}
          dataSource={exteriorDoors}
          pagination={false}
          bordered={false}
          className="pt-4"
        />
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Exterior doors.
        </div>
      )}

      <Modal open={showCreateRemakes}>
        <CreateRemake
          selected={selected}
          setShowCreateRemakes={setShowCreateRemakes}
          customerName={customerName}
          style={{ maxHeight: "90vh", overflow: "hidden", overflowY: "auto" }}
          branch={workOrderBranch}
        />
      </Modal>
      <Modal open={showCreateBackorders}>
        <CreateBackorder
          selected={selected}
          setShowCreateBackorders={setShowCreateBackorders}
          customerName={customerName}
          style={{ maxHeight: "90vh", overflow: "hidden", overflowY: "auto" }}
        />
      </Modal>
    </>
  );
}
