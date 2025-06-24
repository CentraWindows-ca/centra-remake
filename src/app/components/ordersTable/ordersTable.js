import React, { useState } from "react";
import { Pagination, Table, Input } from "antd";
import styles from "./ordersTable.module.css";
import { Button } from "react-bootstrap";

import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
} from "app/redux/orders";
import { useDispatch, useSelector } from "react-redux";

export default function OrdersTable(props) {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (dataIndex, value) => {
    setFilters((prev) => ({
      ...prev,
      [dataIndex]: value,
    }));
  };

  const {
    data,
    columns,
    selectedRows,
    setSelectedRows,
    isLoading,
    onCreateClick,
  } = props;

  const dispatch = useDispatch();

  const { pageNumber, pageSize, total } = useSelector((state) => state.orders);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRows(newSelectedRowKeys);
  };

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

  // Build filter row
  const filterRow = columns.reduce(
    (row, col) => {
      const colKey = col.dataIndex || col.key;
      row[colKey] = (
        <Input
          placeholder={"--"}
          size="small"
          value={filters[colKey] || ""}
          onChange={(e) =>
            handleFilterChange(colKey, e.target.value)
          }
          bordered={false}
          style={{ textAlign: "left", padding: 0 }}
        />
      );
      return row;
    },
    { key: "filter-row" }
  );

  // Apply filtering to data
  const filteredData = data.filter((row) =>
    columns.every((col) => {
      const value = filters[col.dataIndex];
      if (!value) return true; // no filter on this column

      const rowValue = row[col.dataIndex];
      return (
        rowValue != null &&
        rowValue.toString().toLowerCase().includes(value.toLowerCase())
      );
    })
  );

  const displayData = [filterRow, ...filteredData];

  return (
    <div className={"bg-white rounded-sm p-3"}>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center sticky">
          <div className="flex space-x-2 sticky">
            <Button size="sm" className="text-sm" onClick={onCreateClick}>
              <span>Create</span>
            </Button>
          </div>

          {false && // This will be added back when custom filter/search api is available
            <div className="flex justify-end items-center">
              <Pagination
                onChange={onChangeProps}
                total={total}
                showTotal={(total) => (
                  <div className="text-sm font-semibold mt-2">{` ${total.toLocaleString()} Total`}</div>
                )}
                current={pageNumber}
                pageSize={pageSize}
              />
            </div>
          }

        </div>
        <Table
          className="
              my-custom-table
              [&_.ant-table]:!text-[12px]
              [&_.ant-table-tbody_tr_td]:!text-[12px]
              [&_.ant-table-tbody_tr_td]:!p-[0_8px]
              [&_.ant-table-thead_tr_th]:!text-[12px]
              [&_.ant-table-thead_tr_th]:!p-[4_8px]
              [&_tr[data-row-key='filter-row']_td]:sticky
              [&_tr[data-row-key='filter-row']_td]:top-[0px]
              [&_tr[data-row-key='filter-row']_td]:bg-white
              [&_tr[data-row-key='filter-row']_td]:z-[1]
              [&_tr[data-row-key='filter-row']_td.ant-table-cell-fix-left]:z-[11]
              [&_tr[data-row-key='filter-row']_td.ant-table-cell-fix-right]:z-[11]
            "
          columns={columns}
          dataSource={displayData}
          size="small"
          pagination={false}
          loading={isLoading}
          //rowSelection={rowSelection}
          onChange={onTableChange}
          sticky
          tableLayout="fixed"
          scroll={{
            x: "max-content",
            y: "calc(100vh - 250px)", // Adjust height as needed
          }}
        />
      </div>
    </div>
  );
}