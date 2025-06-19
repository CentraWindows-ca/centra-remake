"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Popconfirm } from "antd";
import styles from "./home.module.css";

import { updateAppMode, updateDrawerOpen } from "app/redux/app";
import { useQuery } from "react-query";

import {
  updateDepartment,
  updateStatusView,
  openCreateModal,
  openOrderModal,
  closeModal,
  updateOrders,
  updateStatusCount,
  updateTotal,
} from "app/redux/orders";

import { updateResult } from "app/redux/orders";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AppModes, RemakeRowStates } from "app/utils/constants";
import OrdersHeader from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeader";
import OrdersTable from "app/components/atoms/orderManagementComponents/ordersTable/ordersTable";
import UserSelectField from "app/components/organisms/users/userSelect";
import OrderStatus from "app/components/remake/orderStatus";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import OrderModal from "app/components/remake/orderModal";
import CreateRemakeOrder from "app/components/remake/createRemakeOrder";
import EditRemakeOrder from "app/components/remake/editRemakeOrder";
import {
  fetchAllRemakeWorkOrders,
  fetchRemakeCountByStatus,
  fetchRemakeWorkOrders,
  updateRemakeWorkOrderState,
  deleteRemakeWorkOrder,
} from "app/api/remakeApis";

import {
  getStatusOptions,
  mapRemakeRowStateToKey,
  openWOLink,
} from "app/utils/utils";

import { useAuthData } from "context/authContext";

export default function Remakes() {
  const moduleName = "Remake";
  const router = useRouter();
  const dispatch = useDispatch();

  const { loggedInUser } = useAuthData();

  const [filteredOrders, setFilteredOrders] = useState([]);

  // for sorting & filtering & pagination

  const [sort, setSort] = useState({ sortBy: "RemakeId", isDescending: true });
  const [columns, setColumns] = useState([]);
  const [location, setLocation] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  // VGuan-SWD-2270_delete_remake
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedRemakeOrderId, setSelectedOrderId] = useState(null);

  // query params
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";
  const modeParam = searchParams.get("mode") ?? "";
  const orderIdParam = searchParams.get("orderId") ?? "";

  const statusOptions = getStatusOptions("Remake");
  const statusOptionsRef = useRef(statusOptions); //TODO: see if we still need this

  const {
    department,
    statusView,
    showOrderModal,
    showCreateModal,
    editMode,
    selectedOrderId,
    orders,
    pageNumber,
    pageSize,
  } = useSelector((state) => state.orders);

  const fetchOrders = async () => {
    const result = await fetchRemakeWorkOrders(
      pageNumber,
      pageSize,
      statusView ? statusOptions.find((x) => x.key === statusView).value : "",
      sort.sortBy,
      sort.isDescending
    );

    let _statusCountPromises = statusOptions.map(async (_status) => {
      let _count = await fetchStatusCount(_status.value);

      return {
        status: _status.value,
        count: _count,
      };
    });

    // Wait for all promises to resolve
    let _statusCount = await Promise.all(_statusCountPromises);

    dispatch(updateStatusCount(_statusCount));
    dispatch(updateTotal(result.data.totalCount));
    return result.data.data;
  };

  const fetchStatusCount = async (status) => {
    const result = await fetchRemakeCountByStatus(status);
    return result.data;
  };

  const {
    isLoading: isLoadingOrders,
    data: ordersData,
    isFetching: isFetchingOrders,
    refetch: refetchOrders,
  } = useQuery(["remake_workorders", department, statusView], fetchOrders, {
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingOrders || isFetchingOrders;

  // when user updates order status
  const updateStatus = useCallback(
    async (statusKey, orderId) => {
      if (statusKey && orderId && statusOptions) {
        await updateRemakeWorkOrderState(
          statusOptions.find((x) => x.key === statusKey).value,
          orderId
        );
        refetchOrders();
      }
    },
    [refetchOrders, statusOptions]
  );

  // when user clicks on an order
  const onEditClick = useCallback(
    (orderId) => {
      router.push(
        `${statusView.length > 0 ? `?status=${statusView}&` : "?"
        }orderId=${orderId}&mode=edit`,
        undefined,
        { shallow: true }
      );
    },
    [statusView, router]
  );

  // VGuan-SWD-2270_delete_remake
  const onDeleteClick = useCallback((orderId) => {
    setSelectedOrderId(orderId); // Store order ID
    setPopupOpen(true); // Show Popconfirm
  }, []);

  const handlePopupConfirm = useCallback(() => {
    if (selectedRemakeOrderId) {
      deleteRemakeWorkOrder(loggedInUser?.email, [selectedRemakeOrderId]);
    }
    setPopupOpen(false);
    setSelectedOrderId(null);
  }, [selectedRemakeOrderId, deleteRemakeWorkOrder, loggedInUser]);

  const handlePopupCancel = useCallback(() => {
    setPopupOpen(false);
    setSelectedOrderId(null);
  }, []);


  // when user clicks share link
  const onShareLinkClick = useCallback(
    (orderId) => {
      const baseUrl = window.location.origin; // Get the current base URL
      const link = `${baseUrl}/${statusView.length > 0 ? `?status=${statusView}&` : "?"
        }orderId=${orderId}&mode=edit`;

      // Copy the link to the clipboard
      navigator.clipboard
        .writeText(link)
        .then(() => {
          console.log("Link copied to clipboard:", link);
          dispatch(
            updateResult({
              type: "success",
              message: "Link copied.",
            })
          );
        })
        .catch((err) => { });
    },
    [statusView, dispatch]
  );

  // when user closes order modal
  const onCloseClick = useCallback(() => {
    dispatch(closeModal());
    router.push(
      `${statusView.length > 0 ? `?status=${statusView}` : ""}`,
      undefined,
      { shallow: true }
    );
    refetchOrders();
  }, [dispatch, statusView, router, refetchOrders]);

  useEffect(() => {
    dispatch(updateAppMode(AppModes.orders));
    dispatch(updateDrawerOpen(true));
    dispatch(updateDepartment("Remake"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateStatusView(statusParam));
  }, [dispatch, statusParam]);

  // build table columns
  useEffect(() => {
    let _columns = [
      {
        title: `Remake #`,
        dataIndex: `remakeId`,
        key: `id`,
        width: 90,
        render: (remakeId, order) => (
          <DropdownButton
            id="dropdown-basic-button-lite-transparent"
            size="sm"
            title={<span className="w-full">{remakeId}</span>}
            className="flex justify-between w-full"
          >
            <Dropdown.Item onClick={() => onEditClick(order.id)}>
              <div className="text-sm w-full">
                <i className="fa-solid fa-pen"></i>
                <span className="pl-2">{`Edit ${moduleName}`}</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onShareLinkClick(order.id)}>
              <div className="text-sm w-full">
                <i className="fas fa-link"></i>
                <span className="pl-2">Copy Link</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDeleteClick(order.id)}>
              <div className="text-sm w-full">
                <i className="fa fa-trash"></i>
                <span className="pl-2">Delete</span>
              </div>
            </Dropdown.Item>
          </DropdownButton>
        ),
        sorter: (a, b) => parseInt(a.remakeId) - parseInt(b.remakeId),
      },
      {
        title: `WO #`,
        dataIndex: "workOrderNo",
        key: "workOrderNo",
        width: 80,
        render: (originalWorkOrderNo) => (
          <Tooltip title="Open Work Order in New Tab">
            <div
              className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
              onClick={() => openWOLink(originalWorkOrderNo)}
            >
              {originalWorkOrderNo ? originalWorkOrderNo : ""}
            </div>
          </Tooltip>
        ),
      },
      {
        title: `Item`,
        dataIndex: "itemNo",
        key: "itemNo",
        width: 70,
        render: (itemNo, order) => (
          <div
            className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
            onClick={() => onEditClick(order.id)}
          >
            {itemNo}
          </div>
        ),
      },
      {
        title: `SubQty`,
        dataIndex: "subQty",
        key: "subQty",
        width: 70,
      },
      {
        title: `System`,
        dataIndex: "systemValue",
        key: "systemValue",
        width: 70,
      },
      {
        title: `Size`,
        dataIndex: "size",
        key: "size",
        width: 100,
      },
      {
        title: `Description`,
        dataIndex: "description",
        key: "description",
        width: 100,
        ellipsis: true,
      },
      {
        title: `Product`,
        dataIndex: "product",
        key: "product",
        width: 80,
      },
    ];

    if (
      statusView.length > 0 &&
      RemakeRowStates[statusView].columns.includes("City")
    ) {
      _columns.push({
        title: "City",
        dataIndex: "city",
        key: "city",
        width: 150,
        render: (text) => <>{text.toUpperCase()}</>,
      });
    }

    if (
      statusView === "" ||
      RemakeRowStates[statusView].columns.includes("Scheduled Date")
    ) {
      _columns.push({
        title: `Scheduled Date`,
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        width: 100,
        render: (date) => (
          <div className=" text-gray-400">{moment(date).format("ll")}</div>
        ),
        defaultSortOrder: "descend",
        sorter: (a, b) => moment(a.scheduleDate) - moment(b.scheduleDate),
      });
    }

    if (
      statusView === "" ||
      RemakeRowStates[statusView].columns.includes("Assignee")
    ) {
      _columns.push({
        title: "Assigned To",
        key: "assignedTo",
        dataIndex: "assignedTo",
        key: "assignedTo",
        width: 140,
        render: (assignedTo, order) => (
          <UserSelectField style={{ width: 200 }} />
        ),
      });
    }

    _columns.push({
      title: "Status",
      key: "status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status, order) => (
        <div className="text-center">
          <OrderStatus
            statusKey={mapRemakeRowStateToKey(status)}
            statusList={RemakeRowStates}
            style={{ width: "90%" }}
            updateStatusCallback={updateStatus}
            orderId={order.id}
            handleStatusCancelCallback={() => { }}
          />
        </div>
      ),
    });
    setColumns(_columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusView]);

  // handle query param changes
  useEffect(() => {
    switch (modeParam) {
      case "edit":
        if (orderIdParam.length > 0)
          dispatch(openOrderModal({ orderId: orderIdParam, isEdit: true }));

        break;

      case "create":
        dispatch(openCreateModal());
        break;

      default:
        if (orderIdParam.length > 0)
          dispatch(openOrderModal({ orderId: orderIdParam, isEdit: false }));

        break;
    }
  }, [dispatch, modeParam, orderIdParam]);

  // for fetching orders
  useEffect(() => {
    if (ordersData) {
      dispatch(updateOrders(ordersData));
    }
  }, [ordersData, dispatch]);

  // for status filter changes
  useEffect(() => {
    setSelectedRows([]);
    if (orders && statusOptionsRef.current) {
      setFilteredOrders(() => {
        let currentStatus =
          statusView.length > 0
            ? statusOptionsRef.current.find((x) => x.key === statusView)
            : null;

        let _orders = currentStatus
          ? orders
            .map((o, index) => ({
              ...o,
              key: index,
            }))
            .filter((o) => o.status === currentStatus.value)
          : orders.map((o, index) => ({
            ...o,
            key: index,
          }));

        return _orders;
      });
    }
  }, [orders, statusView]);

  // if page and page size are changed
  useEffect(() => {
    refetchOrders();
  }, [pageSize, pageNumber, refetchOrders]);

  const tableLoading = {
    spinning: isLoading,
    indicator: (
      <LoadingOutlined
        style={{
          fontSize: 24,
        }}
        spin
      />
    ),
  };

  return (
    <div className={styles.root}>
      {/*   // VGuan-SWD-2270_delete_remake */}
      <Popconfirm
        title="Are you sure you want to delete this recorder?"
        open={popupOpen}
        onConfirm={handlePopupConfirm}
        onCancel={handlePopupCancel}
        okText="Yes"
        cancelText="No"
      />
      <OrdersHeader
        location={location}
        selectedStatus={statusView}
        states={RemakeRowStates}
      />
      <OrdersTable
        columns={columns}
        data={filteredOrders}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        isLoading={tableLoading}
      />

      <OrderModal
        open={showOrderModal}
        onClose={onCloseClick}
        moduleName={department}
      >
        <EditRemakeOrder
          orderId={selectedOrderId}
          onClose={onCloseClick}
          onShareLinkClick={onShareLinkClick}
        />
      </OrderModal>

      <OrderModal
        open={showCreateModal}
        onClose={onCloseClick}
        moduleName={department}
      >
        <CreateRemakeOrder
          style={{
            height: "80vh",
            width: "90vw",
            overflow: "auto",
            marginTop: "-1px",
            paddingRight: "1rem",
          }}
          orderId={selectedOrderId}
          onClose={onCloseClick}
          isEditMode={editMode}
        />
      </OrderModal>
    </div>
  );
}
