"use client"
import React, { useState, useEffect } from "react";
import { Table, Input, Tag, Typography } from "antd";
const { Text } = Typography;
import { capitalizeWords } from "app/utils/utils";

export default function TableWithExternalFilters(props) {
  const {
    data,
    columns,
    isLoading,
    onChange,
    onFilterChange,
    rowSelection,
  } = props;

  const [filters, setFilters] = useState({});

  const handleFilterChange = (dataIndex, value) => {
    setFilters((prev) => ({
      ...prev,
      [dataIndex]: value,
    }));
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const filterRow = columns.reduce(
    (row, col) => {
      const colKey = col.dataIndex || col.key;
      row[colKey] = (
        <Input
          placeholder={"--"}
          size="small"
          value={filters[colKey] || ""}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleFilterChange(colKey, e.target.value);
          }}
          bordered={false}
          className="text-xs text-blue-700 p-0"
        />
      );
      return row;
    },
    { key: "filter-row" }
  );

  const tableData = [
    filterRow,
    ...(Array.isArray(data) ? data : [])
  ];

  const removeFilter = (key) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const hasFilters = !Object.values(filters).every(v => v == null || v === '' || (Array.isArray(v) && !v.length))

  return (
    <div className={"bg-white rounded-sm flex flex-col justify-between h-[calc(100vh-185px)]"}>
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
        dataSource={tableData}
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
      {hasFilters &&
        <footer className="w-full p-1 text-sm rounded-sm border-t border-b">
          <Text className="pr-2">Filters:</Text>
          {filters &&
            Object.entries(filters)
              .filter(([, value]) => value !== '' && value !== null && value !== undefined)
              .map(([key, value]) => (
                <Tag
                  color="geekblue"
                  key={key}
                  closeIcon={<i className="fa-solid fa-xmark" />}
                  onClose={() => removeFilter(key)}
                >
                  <span className="text-blue-600 pr-1">
                    {capitalizeWords(key)}: {String(value)}
                  </span>
                </Tag>
              ))}
        </footer>
      }
    </div>
  );
}