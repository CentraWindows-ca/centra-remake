import { Pagination, Table } from "antd";
import styles from "./ordersTable.module.css";
import { Button, DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
} from "app/redux/orders";
import { useDispatch, useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";

export default function OrdersTable(props) {
  const {
    data,
    columns,
    selectedRows,
    setSelectedRows,
    isLoading,
    onCreateClick,
  } = props;
  const dispatch = useDispatch();
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRows(newSelectedRowKeys);
  };

  const { pageNumber, pageSize, total } = useSelector((state) => state.orders);

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

  const onChangeProps = (page, pageSize) => {
    dispatch(updatePageNumber(page));
    dispatch(updatePageSize(pageSize));
  };

  const onTableChange = (pagination, filters, sorter) => {
    if (sorter.hasOwnProperty("column")) {
      dispatch(
        updateSortOrder({
          sortBy: sorter.field,
          isDescending: sorter.order === "descend",
        })
      );
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center sticky">
            <div className="flex space-x-2 sticky">
              <Button size="sm" className="text-sm" onClick={onCreateClick}>
                {/* <i className="fa-solid fa-plus pr-2" /> */}
                <span>Create</span>
              </Button>
              {/* <Badge color={"#007BFF"} count={selectedRows.length}>
                <Tooltip title="Actions">
                  <DropdownButton
                    id="dropdown-basic-button-lite"
                    size="md"
                    title={
                      <span className="w-full pr-2 font-semibold">Actions</span>
                    }
                    className="flex justify-between w-full hover:bg-[#f9f9f9] rounded"
                  >
                    <Dropdown.Item
                      onClick={() => {}}
                      disabled={selectedRows.length === 0}
                    >
                      <div className="flex items-center text-sm w-full">
                        <i className="fa-regular fa-calendar"></i>
                        <span className="pl-2">Reschedule</span>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {}}
                      disabled={selectedRows.length === 0}
                    >
                      <div className="flex items-center text-sm w-full">
                        <i className="fa-regular fa-pen-to-square"></i>
                        <span className="pl-2">Update Status</span>
                      </div>
                    </Dropdown.Item>
                  </DropdownButton>
                </Tooltip>
              </Badge> */}
            </div>

            <div className="flex justify-end items-center">
              <Pagination
                //showSizeChanger
                onChange={onChangeProps}
                total={total}
                showTotal={(total) => (
                  <div className="text-sm font-semibold mt-2">{` ${total.toLocaleString()} Total`}</div>
                )}
                current={pageNumber}
                pageSize={pageSize}
                //pageSizeOptions={[20]}
              />
            </div>
          </div>
          <div style={{ height: "calc(100vh - 220px)" }}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={false}
              //rowSelection={rowSelection}
              loading={isLoading}
              scroll={{ y: "calc(100vh - 270px)" }}
              style={{ height: "100%" }}
              onChange={onTableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
