import { Pagination, Table } from "antd";
import styles from "./ordersTable.module.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
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
  const dispatch = useDispatch();
  const onSelectChange = (newSelectedRowKeys) => {
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

  const CustomTable = styled(Table)`
    .ant-table {      
      font-size: 13px !important;
    }
    .ant-table-tbody > tr > td {
      font-size: 12px !important;
      padding: 0px 8px !important;
    }    
    .ant-table-thead > tr > th {
      font-size: 13px !important;
      padding: 4px !important;
      background-color: #fafafa; /* example background */
      font-weight: 600; /* example font weight */
  }
  `;

  return (
    <div className={"bg-white rounded-sm p-3"}>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center sticky">
          <div className="flex space-x-2 sticky">
            <Button size="sm" className="text-sm" onClick={onCreateClick}>
              {/* <i className="fa-solid fa-plus pr-2" /> */}
              <span>Create</span>
            </Button> 
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
        <div style={{ height: "calc(100vh - 195px)" }} className="overflow-auto text-xs">
          <CustomTable
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false}
            //rowSelection={rowSelection}
            loading={isLoading}            
            onChange={onTableChange}
            sticky
            bordered
            tableLayout="fixed"
            scroll={{
              x: 'max-content'
            }}
          />
        </div>
      </div>
    </div>
  );
}
