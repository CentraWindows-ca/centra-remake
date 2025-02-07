"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import moment from "moment";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import OrdersHeader from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeader";

import { ServiceStates, AppModes } from "../../utils/constants";
import {
  getStatusOptions,
  mapServiceEventStateToKey,
  openWOLink,
} from "app/utils/utils";

import {
  fetchServiceCountByStatus,
  fetchServiceCountByAssignee,
  fetchServiceWorkOrdersWithPagination,
  scheduleService,
  updateServiceWorkOrderState,
} from "app/api/serviceApis";

import styles from "../work-order-management.module.css";

// Redux
import {
  updateDepartment,
  updateStatusView,
  openCreateModal,
  openOrderModal,
  closeModal,
  updateOrders,
  updateStatusCount,
  updateTotal,
  updateAssignedToMe,
  updateAssignedToMeCount,
  updateShowMessage,
  updateSortOrder,
  updatePageNumber,
  updateSearchEntry,
} from "../../redux/orders";

import { updateAppMode, updateDrawerOpen } from "../../redux/app";

import OrderStatus from "../shared/orderStatus";
import CreateServiceOrder from "./subComponents/createServiceOrder";

import EditServiceOrder from "./subComponents/editServiceOrder";
import UserSelectField from "app/components/organisms/users/userSelect";
import OrdersTable from "app/components/atoms/orderManagementComponents/ordersTable/ordersTable";
import OrderModal from "../shared/orderModal";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthData } from "context/authContext";
import {
  convertToLocaleDateTimell,
  convertToLocaleDateTimelll,
} from "app/utils/date";

export default function Home() {
  const moduleName = "Service";
  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedInUser } = useAuthData();

  // for sorting & filtering & pagination

  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // query params
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";
  const modeParam = searchParams.get("mode") ?? "";
  const orderIdParam = searchParams.get("orderId") ?? "";
  const assignedToMeParam = searchParams.get("assignedToMe") ?? "";

  const statusOptions = getStatusOptions(moduleName);
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
    assignedToMe,
    location,
    filters,
    showMessage,
    sort,
    searchEntry,
  } = useSelector((state) => state.orders);

  const modalStyle = {
    maxHeight: "70vh",
    width: "90vw",
    overflow: "auto",
    marginTop: "-1px",
    scrollMarginRight: "5px",
  };

  const fetchOrders = async () => {
    if (!loggedInUser) return;

    let sosiFilter = filters
      .find((f) => f.key === "sosi")
      .fields.filter((x) => x.value === true);
    let sosiFilterVal = "";

    if (sosiFilter.length === 1) {
      sosiFilterVal = sosiFilter[0].key;
    }

    const result = await fetchServiceWorkOrdersWithPagination(
      pageNumber,
      pageSize,
      statusView ? statusOptions.find((x) => x.key === statusView).value : "",
      sort.sortBy ?? "serviceId",
      sort.isDescending ?? true,
      assignedToMe ? loggedInUser?.email : null,
      location,
      sosiFilterVal,
      searchEntry
    );

    let _statusCountPromises = statusOptions.map(async (_status) => {
      let _count = await fetchStatusCount(_status.value);

      return {
        status: _status.value,
        count: _count,
      };
    });

    let _assigneeServCount = await fetchAssigneeServiceCount(
      loggedInUser?.email
    );

    // Wait for all promises to resolve
    let _statusCount = await Promise.all(_statusCountPromises);

    dispatch(updateStatusCount(_statusCount));
    dispatch(updateTotal(result.data.totalCount));
    dispatch(updateAssignedToMeCount(_assigneeServCount));

    if (showMessage) dispatch(updateShowMessage({ value: false }));
    return result.data.data;
  };

  const fetchStatusCount = async (status) => {
    const result = await fetchServiceCountByStatus(status);
    return result.data;
  };

  const fetchAssigneeServiceCount = async (email) => {
    const result = await fetchServiceCountByAssignee(email);
    return result.data;
  };

  const {
    isLoading: isLoadingOrders,
    data: ordersData,
    isFetching: isFetchingOrders,
    refetch: refetchOrders,
  } = useQuery(
    ["service_workorders", department, statusView, assignedToMe, loggedInUser],
    fetchOrders,
    {
      refetchOnWindowFocus: false,
    }
  );

  //user interaction handlers
  const handleEditClick = useCallback(
    (orderId) => {
      const currentUrl = new URL(window.location.href);

      currentUrl.searchParams.append("orderId", orderId);
      currentUrl.searchParams.append("mode", "edit");

      router.push(currentUrl.toString(), undefined, { shallow: true });
    },
    [router]
  );

  const handleAddClick = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.append("mode", "create");

    router.push(currentUrl.toString(), undefined, { shallow: true });
  };

  const updateStatus = useCallback(
    async (statusKey, orderId, val) => {
      if (statusKey && orderId && statusOptions) {
        let _statusVal = statusOptions.find((x) => x.key === statusKey).value;

        if (_statusVal == ServiceStates.scheduled.label) {
          let data = {
            id: orderId,
            status: _statusVal,
            scheduleDate: val.scheduleDateSS,
            scheduleEndDate: val.scheduleEndDateSS,
            serviceAssignees: val.assignedTechniciansSS,
          };
          await scheduleService(_statusVal, orderId, data);
        } else {
          await updateServiceWorkOrderState(_statusVal, orderId);
        }
        refetchOrders();
      }
    },
    [refetchOrders, statusOptions]
  );

  const getTableColumns = () => {
    let _columns = [
      {
        title: `Service #`,
        dataIndex: `serviceId`,
        key: `serviceId`,
        width: 100,
        render: (orderNumber, order) => (
          <DropdownButton
            id="dropdown-basic-button-lite"
            size="sm"
            title={<span className="w-full">{orderNumber}</span>}
            style={{ width: "100%" }}
            className="flex justify-between w-full"
          >
            <Dropdown.Item onClick={() => handleEditClick(order.serviceId)}>
              <div className="text-sm w-full">
                <i className="fa-solid fa-pen"></i>
                <span className="pl-2">{`Edit ${moduleName}`}</span>
              </div>
            </Dropdown.Item>
          </DropdownButton>
        ),
        sorter: (a, b) => moment(a.id) - moment(b.id),
      },
      {
        title: `Original WO #`,
        dataIndex: "originalWorkOrderNo",
        key: "originalWorkOrderNo",
        width: 120,
        render: (originalWorkOrderNo) => (
          <div
            className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
            onClick={() => openWOLink(originalWorkOrderNo)}
          >
            {originalWorkOrderNo ? originalWorkOrderNo : ""}
          </div>
        ),
      },
      {
        title: `Summary`,
        dataIndex: "summary",
        key: "summary",
        ellipsis: true,
        render: (summary, order) => (
          <div
            className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
            onClick={() => handleEditClick(order.serviceId)}
          >
            {summary ? summary : ""}
          </div>
        ),
      },
    ];

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("City")
    ) {
      _columns.push({
        title: "City",
        dataIndex: "city",
        key: "city",
        width: 140,
        render: (text) => <>{text.toUpperCase()}</>,
      });
    }

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Customer")
    ) {
      _columns.push({
        title: "Customer",
        key: "custName",
        width: 150,
        render: (text, order) => <>{`${order.firstName} ${order.lastName}`}</>,
      });
    }

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Request Date")
    ) {
      _columns.push({
        title: `Request Date`,
        dataIndex: "serviceRequestDate",
        key: "serviceRequestDate",
        width: 130,
        render: (date) =>
          date ? (
            <div className=" text-gray-400">
              {convertToLocaleDateTimell(date)}
            </div>
          ) : (
            <></>
          ),
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      });
    }

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("Scheduled Start")
    ) {
      _columns.push({
        title: `Scheduled Start`,
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        width: 200,
        render: (date) => (
          <div className=" text-gray-400">
            {" "}
            {convertToLocaleDateTimelll(date)}
          </div>
        ),
        sorter: (a, b) => moment(a.scheduleDate) - moment(b.scheduleDate),
      });
    }

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("Scheduled End")
    ) {
      _columns.push({
        title: `Scheduled End`,
        dataIndex: "scheduleEndDate",
        key: "scheduleEndDate",
        width: 200,
        render: (date) => (
          <div className=" text-gray-400">
            {" "}
            {convertToLocaleDateTimelll(date)}
          </div>
        ),
        sorter: (a, b) => moment(a.scheduleEndDate) - moment(b.scheduleEndDate),
      });
    }
    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Created On")
    ) {
      _columns.push({
        title: `Created On`,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        render: (date) => (
          <div className=" text-gray-400">
            {" "}
            {convertToLocaleDateTimell(date)}
          </div>
        ),
        defaultSortOrder: "descend",
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      });
    }
    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Assigned Admin")
    ) {
      _columns.push({
        title: "Assigned Admin",
        key: "assignedAdmin",
        dataIndex: "assignedAdmin",
        key: "assignedAdmin",
        width: 220,
        render: (assignedAdmin, order) => (
          <UserSelectField value={assignedAdmin} />
        ),
      });
    }

    _columns.push({
      title: "Status",
      key: "status",
      dataIndex: "status",
      key: "status",
      width: 220,
      render: (status, order) => (
        <div className="text-center">
          <OrderStatus
            statusKey={mapServiceEventStateToKey(status)}
            statusList={ServiceStates}
            style={{ width: "90%" }}
            updateStatusCallback={updateStatus}
            orderId={order.id}
            handleStatusCancelCallback={() => {}}
          />
        </div>
      ),
    });

    setColumns(_columns);
  };

  // useEffect hooks
  useEffect(() => {
    dispatch(updateStatusView(statusParam));
    dispatch(updateSortOrder({}));
    dispatch(updatePageNumber(1));
    // dispatch(updateSearchEntry(""));
  }, [dispatch, statusParam]);

  useEffect(() => {
    dispatch(
      updateAssignedToMe(assignedToMeParam && assignedToMeParam === "1")
    );
    dispatch(updateSortOrder({}));
    dispatch(updatePageNumber(1));
    // dispatch(updateSearchEntry(""));
  }, [dispatch, assignedToMeParam]);

  useEffect(() => {
    dispatch(updateAppMode(AppModes.orders));
    dispatch(updateDrawerOpen(true));
    dispatch(updateDepartment("Service"));
  }, [dispatch]);

  useEffect(() => {
    if (ordersData) {
      dispatch(updateOrders(ordersData));
    }
  }, [ordersData, dispatch]);

  useEffect(() => {
    getTableColumns(statusView, department);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusView, department]);

  const isLoading = isLoadingOrders || isFetchingOrders;

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

  useEffect(() => {
    dispatch(updateStatusView(statusParam));
  }, [dispatch, statusParam]);

  // for fetching orders, update in store
  useEffect(() => {
    if (ordersData) {
      dispatch(updateOrders(ordersData));
    }
  }, [ordersData, dispatch]);

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

  const onCloseClick = useCallback(
    (isNew = false) => {
      dispatch(closeModal());

      if (isNew) {
        router.push(
          `/service${
            statusView?.length > 0 ? `?status=${statusOptions[0].key}` : ""
          }`,
          undefined,
          { shallow: true }
        );
      } else {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("mode");
        currentUrl.searchParams.delete("orderId");
        router.push(currentUrl.toString(), undefined, { shallow: true });
      }

      refetchOrders();
    },
    [dispatch, refetchOrders, router, statusOptions, statusView]
  );

  // handle other filtering
  useEffect(() => {
    refetchOrders();
  }, [
    pageSize,
    pageNumber,
    location,
    filters,
    searchEntry,
    sort,
    refetchOrders,
    dispatch,
  ]);

  return (
    <div className={styles.root}>
      <OrdersHeader
        selectedStatus={statusView}
        states={ServiceStates}
        refetch={refetchOrders}
      />
      <OrdersTable
        columns={columns}
        data={orders}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        isLoading={tableLoading}
        onCreateClick={handleAddClick}
      />

      <OrderModal
        open={showOrderModal}
        onClose={onCloseClick}
        moduleName={department}
      >
        <EditServiceOrder
          style={modalStyle}
          orderId={selectedOrderId}
          onClose={onCloseClick}
          isEditMode={editMode}
        />
      </OrderModal>

      <OrderModal
        open={showCreateModal}
        onClose={onCloseClick}
        moduleName={department}
      >
        <CreateServiceOrder
          style={modalStyle}
          orderId={selectedOrderId}
          onClose={onCloseClick}
          isEditMode={editMode}
        />
      </OrderModal>
    </div>
  );
}
