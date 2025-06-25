"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import styled from "styled-components";

import { LoadingOutlined } from "@ant-design/icons";
import { Popconfirm, Popover, Modal, Form } from "antd";
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
  updateTotal
} from "app/redux/orders";

import { updateResult } from "app/redux/orders";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AppModes, RemakeRowStates } from "app/utils/constants";
import OrdersHeader from "app/components/ordersHeader/ordersHeader";
import OrdersTable from "app/components/ordersTable/ordersTable";
import UserSelectField from "app/components/users/userSelect";
import OrderStatus from "app/components/remake/orderStatus";
import Tooltip from "app/components/tooltip/tooltip";
import CreateRemakeOrder from "app/features/remake/createRemakeOrder";
import EditRemakeOrder from "app/features/remake/editRemakeOrder";
import {
  fetchAllRemakeWorkOrders,
  fetchRemakeCountByStatus,
  fetchRemakeWorkOrders,
  updateRemakeWorkOrderState,
  deleteRemakeWorkOrder,
  updateRemakeWorkOrder
} from "app/api/remakeApis";

import {
  getStatusOptions,
  mapRemakeRowStateToKey,
  openWOLink,
} from "app/utils/utils";

import { useAuthData } from "context/authContext";

const CustomModal = styled(Modal).attrs({
  motion: {
    motionName: 'custom-fade',
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500, // fade duration in ms
  },
  maskMotion: {
    motionName: 'custom-fade',
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500,
  },
})`
  .custom-fade-appear,
  .custom-fade-enter {
    @apply opacity-0;
  }

  .custom-fade-appear-active,
  .custom-fade-enter-active {
    @apply transition-opacity duration-500 ease-in-out opacity-100;
  }

  .custom-fade-leave {
    @apply opacity-100;
  }

  .custom-fade-leave-active {
    @apply transition-opacity duration-500 ease-in-out opacity-0;
  }
`;

export default function Remakes() {
  const moduleName = "Remake";
  const router = useRouter();
  const dispatch = useDispatch();

  const [editRemakeForm] = Form.useForm();

  const { loggedInUser } = useAuthData();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // for sorting & filtering & pagination

  const [sort, setSort] = useState({ sortBy: "RemakeId", isDescending: true });
  const [remakeItem, setRemakeItem] = useState(null);

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
    //const result = await fetchRemakeWorkOrders(
    //  pageNumber,
    //  pageSize,
    //  statusView ? statusOptions.find((x) => x.key === statusView).value : "",
    //  sort.sortBy,
    //  sort.isDescending
    //);

    const result = await fetchAllRemakeWorkOrders();

    console.log("result ", result)

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
    //return result.data.data;
    return result.data;
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

  const handlePopoverToggle = (orderId) => {
    setOpenPopoverId(orderId);
  };

  const handleClosePopover = () => {
    setOpenPopoverId(null);
  };

  const PopoverContent = useCallback((order) => {
    return (
      <div className="text-slate-600">
        <div
          className="text-xs w-full hover:underline hover:text-sky-700 p-1 hover:cursor-pointer rounded"
          onClick={() => {
            onEditClick(order.id);            
            handleClosePopover(); // close popover
          }}
        >
          <i className="fa-solid fa-eye text-green-700"></i>
          <span className="pl-3">{`View`}</span>
        </div>
        <div
          className="text-xs w-full hover:underline hover:text-sky-700 p-1 hover:cursor-pointer rounded"
          onClick={() => {
            onEditClick(order.id);
            setRemakeItem(order);
            handleClosePopover(); // close popover
          }}
        >
          <i className="fa-solid fa-pen text-sky-700"></i>
          <span className="pl-3">{`Edit`}</span>
        </div>
        {false &&
          <div
            className="text-xs w-full hover:underline hover:text-sky-700 p-1 hover:cursor-pointer rounded"
            onClick={() => {
              onShareLinkClick(order.id);
              handleClosePopover(); // close popover
            }}
          >
            <i className="fas fa-link"></i>
            <span className="pl-2">Copy Link</span>
          </div>
        }
        <div
          className="text-xs w-full hover:underline hover:text-sky-700 p-1 hover:cursor-pointer rounded"
          onClick={() => {
            onDeleteClick(order.id);
            handleClosePopover(); // close popover
          }}
        >
          <i className="fa fa-trash text-red-700"></i>
          <span className="pl-3">Delete</span>
        </div>
      </div>
    );
  }, [onEditClick, onShareLinkClick, onDeleteClick, handleClosePopover, moduleName]);

  const handleAssignedToChange = useCallback((user, order) => {
    setFilteredOrders((prevOrders) => {
      let _prevOrders = [...prevOrders];
      let orderIndex = _prevOrders.findIndex((o) => o.id === order?.id);
      if (orderIndex !== -1) {
        _prevOrders[orderIndex].assignedTo = user;
      }
      return _prevOrders;
    });

    let orderData = filteredOrders.find((o) => o.id === order?.id);

    if (orderData) {
      orderData.assignedTo = user || "";

      updateRemakeWorkOrder(
        [orderData]
      ).then(() => {
        refetchOrders();
      });
    }
  }, [filteredOrders]);

  const columns = [
    {
      title: `Remake #`,
      dataIndex: `remakeId`,
      key: `id`,
      width: 90,
      fixed: 'left',
      render: (remakeId, order) => (
        <Popover
          placement="right"
          title=""
          content={PopoverContent(order)}
          trigger="click"
          open={openPopoverId === order?.id}
          onOpenChange={(visible) => {
            setOpenPopoverId(visible ? order?.id : null);
          }}
        >
          <span
            className="text-sky-700 hover:underline hover:cursor-pointer"
            onClick={() => handlePopoverToggle(order?.id)}
          >
            {remakeId}
          </span>
        </Popover>
      ),
      sorter: (a, b) => parseInt(a.remakeId) - parseInt(b.remakeId),
    },
    {
      title: `WO #`,
      dataIndex: "workOrderNo",
      key: "workOrderNo",
      width: 120,
      render: (originalWorkOrderNo, order, index) => 
        index === 0
          ? originalWorkOrderNo
          :
        (<Tooltip title={`Open ${originalWorkOrderNo} in New Tab`}>
            <div
              className="flex items-center hover:text-centraBlue cursor-pointer hover:underline min-h-[30px]"
              onClick={() => openWOLink(originalWorkOrderNo)}
            >
              {originalWorkOrderNo || ""}
            </div>
          </Tooltip>
        )
      },    
    {
      title: `Item`,
      dataIndex: "itemNo",
      key: "itemNo",
      width: 120
    },
    {
      title: `SubQty`,
      dataIndex: "subQty",
      key: "subQty",
      width: 70,
      render: (text) => <div className="truncate">{text}</div>,
    },
    {
      title: `System`,
      dataIndex: "systemValue",
      key: "systemValue",
      width: 120,
    },
    {
      title: `Size`,
      dataIndex: "size",
      key: "size",
      width: 200,
    },
    {
      title: `Description`,
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: `Product`,
      dataIndex: "product",
      key: "product",
      width: 150,
    },
    //{
    //  title: "City",
    //  dataIndex: "city",
    //  key: "city",
    //  width: 150      
    //},
    {
      title: `Scheduled Date`,
      dataIndex: "scheduleDate",
      key: "scheduleDate",
      width: 130,
      render: (date, record, index) =>
        index === 0
          ? date
          : (
            <div className="text-gray-400">
              {moment(date).format("ll")}
            </div>
          ),
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        moment(a.scheduleDate).valueOf() - moment(b.scheduleDate).valueOf(),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 180,
      render: (assignedTo, record, index) =>
        index === 0
          ? assignedTo
          : (
            <div className="text-center p-0 m-0">
              <UserSelectField
                value={assignedTo}
                onChange={(user) =>
                  handleAssignedToChange(user, record)
                }
              />
            </div>
          ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      fixed: 'right',
      render: (status, order, index) => {
        if (index === 0) {
          // Just show the raw status text (from data)
          return status;
        }
        return (
          <div className="text-center">
            <OrderStatus
              statusKey={mapRemakeRowStateToKey(status)}
              statusList={RemakeRowStates}
              updateStatusCallback={updateStatus}
              orderId={order?.id}
              handleStatusCancelCallback={() => { }}
              style={{ width: "100%" }}
            />
          </div>
        );
      },
    },
  ];

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

  const handleEditRemakeSave = () => {
    editRemakeForm.submit();
  }

  const handleFinish = useCallback(async (values) => {    
    if (values && remakeItem) {
      let _remakeItem = {...remakeItem}

      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) {
          _remakeItem[key] = values[key];
        }
      });

      updateRemakeWorkOrder([_remakeItem]);
      onCloseClick();
    }
  }, [remakeItem]);

  const handleFinishFailed = () => {
    console.log("Show error message")
  }

  return (
    <div className={styles.root}>
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

      <CustomModal
        open={showOrderModal}
        onCancel={onCloseClick}
        onOk={handleEditRemakeSave}
        moduleName={department}
        width={1200}
        okText="Save"
        cancelText="Cancel"
      >
        <EditRemakeOrder
          form={editRemakeForm}
          orderId={selectedOrderId}
          onClose={onCloseClick}
          onShareLinkClick={onShareLinkClick}
          setRemakeItem={setRemakeItem}
          remakeItem={remakeItem}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        />
      </CustomModal>

      <Modal
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
      </Modal>
    </div>
  );
}
