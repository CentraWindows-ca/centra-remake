import styles from "./ordersTable.module.css";

import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import { Pagination } from "antd";
import { Button } from "react-bootstrap";
import TableWithExternalFilters from "app/components/TableWithExternalFilters/TableWithExternalFilters";
//import TableWithFilters from "app/components/TableWithFilters/TableWithFilters";

import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
  openCreateModal
} from "app/redux/orders";

import { useDispatch, useSelector } from "react-redux";

export default function OrdersTable(props) {
  const {
    data,
    columns,
    selectedRows,
    setSelectedRows,
    isLoading,
    onCreateClick,
  } = props;

  const router = useRouter();
  const pathname = usePathname();

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

  const onFilterChange = (filters) => {
    console.log("filters", filters);
    const params = new URLSearchParams(
      Object.entries(filters).filter(
        ([, value]) => value !== '' && value !== undefined && value !== null
      )
    );
    router.push(`${pathname}?${params.toString()}`);
  }
 
  return (
    <div className={"bg-white rounded-sm p-3"}>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center sticky">
          <div className="flex space-x-2 sticky">
            <Button size="sm" className="text-sm" onClick={() => dispatch(openCreateModal())}>
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
        <TableWithExternalFilters 
          columns={columns}
          data={data}
          pagination={false}
          loading={isLoading}
          onChange={onTableChange}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}