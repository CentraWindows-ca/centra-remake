import styles from "./ordersTable.module.css";

import React, { useEffect  } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
    noOfPages,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const pageParam = searchParams.get("page") ?? "";

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
    //dispatch(updatePageNumber(page));
    //dispatch(updatePageSize(pageSize));
    console.log("page ", page)
    console.log("pageSize ", pageSize)

    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!noOfPages) return;

    const currentPage = Number.parseInt(pageParam ?? '1', 10);

    if (currentPage > noOfPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [noOfPages, pageParam, searchParams, pathname, router]);

  return (
    <div className={"bg-white rounded-sm p-3"}>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center sticky">
          <div className="flex space-x-2 sticky">
            <Button size="sm" className="text-sm" onClick={() => dispatch(openCreateModal())}>
              <span>Create</span>
            </Button>
          </div>         
          <div className="flex justify-end items-center">
            <Pagination
              onChange={onChangeProps}
              total={noOfPages}
              //showTotal={(total) => (
              //  <div className="text-sm font-semibold mt-2">{` ${total.toLocaleString()} Total`}</div>
              //)}
              current={Number.parseInt(pageParam || 1, 10) || 1}
              pageSize={1}
            />
          </div>          
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