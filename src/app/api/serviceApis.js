import axios from "axios";
import store from "../redux/store.js";
import { updateResult } from "../redux/orders";
import { BASE_URL } from "app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchServiceWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/Service/GetServicesByRange?startDate=${startDate}&endDate=${endDate}`;
  return axios.get(url, getConfig());
}

export async function fetchAllServiceWorkOrders() {
  const url = `${BASE_URL}/Service/GetServices`;
  return axios.get(url, getConfig());
}

export async function fetchServiceCountByStatus(status) {
  const url = `${BASE_URL}/Service/GetServiceCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return axios.get(url, getConfig());
}

export async function fetchServiceCountByAssignee(email) {
  const url = `${BASE_URL}/Service/GetServiceCountByAssignedToMe?email=${email}`;
  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrdersWithPagination(
  pageNumber,
  pageSize,
  status,
  sortBy,
  isDescending,
  assignedTo = null,
  province,
  sosi = null,
  searchText = ""
) {
  let url = `${BASE_URL}/Service/GetServicesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;

  if (assignedTo) {
    url += `&assignedTo=${assignedTo}`;
  }

  if (sosi) {
    url += `&sosi=${sosi}`;
  }

  if (searchText.length > 0) {
    url += `&searchText=${searchText}`;
  }

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderByWO(workOrderNum) {
  const url = `${BASE_URL}/Service/GetServicesByWO?originalWO=${workOrderNum}`;

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderById(
  serviceEventId,
  includeGenerics = false
) {
  const url = `${BASE_URL}/Service/GetServiceById?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderByServiceId(
  serviceId,
  includeGenerics = false
) {
  const url = `${BASE_URL}/Service/GetServiceByServiceId?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;

  return axios.get(url, getConfig());
}

export async function addServiceWorkOrder(data) {
  const url = `${BASE_URL}/Service/AddService`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: "success",
          message: "Work order created.",
          source: "Service Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: "error",
          message: "Work order creation failed.",
          source: "Service Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateServiceWorkOrder(service) {
  const url = `${BASE_URL}/Service/UpdateService`;

  try {
    const response = await axios.post(url, service, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: "success",
          message: "Work order updated.",
          source: "Service Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: "error",
          message: "Work order update failed.",
          source: "Service Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function updateServiceWorkOrderState(newStatus, moduleId) {
  const url = `${BASE_URL}/Common/Transit`;
  var data = {
    moduleName: "service",
    transitionCode: newStatus,
    id: moduleId,
  };

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: "success", message: "Status updated." })
      );
    } else {
      store.dispatch(
        updateResult({ type: "error", message: "Status update failed." })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function scheduleService(newStatus, moduleId, data) {
  const url = `${BASE_URL}/Service/ScheduleService`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: "success", message: "Status updated." })
      );
    } else {
      store.dispatch(
        updateResult({ type: "error", message: "Status update failed." })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function updateServiceWorkOrderSchedule(data) {
  const url = `${BASE_URL}/Common/UpdateEventSchedule`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: "success", message: "Schedule updated." })
      );
    } else {
      store.dispatch(
        updateResult({ type: "error", message: "Schedule update failed." })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}
