import React, { useState } from "react";
import { Table, Input } from "antd";

export default function TableWithFilters(props) {
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
    isLoading,
    onChange,
    rowSelection,
  } = props;

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
      rowSelection={rowSelection}
      onChange={onChange}
      sticky
      tableLayout="fixed"
      scroll={{
        x: "max-content",
        y: "calc(100vh - 250px)", // Adjust height as needed
      }}
    />
  );
}