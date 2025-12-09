import axios from "axios";
import store from "../redux/store.js";
import { updateResult } from "../redux/orders";
import { BASE_URL, BASE_URL_OM, Production } from "../utils/constants";

function getConfig(loggedInUserEmail) {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
    "centra-login-email": loggedInUserEmail,
  };
}
function getConfigOM() {
  const token = localStorage.getItem("centra_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'centra-login-email': store?.getState()?.app?.userData?.email
    }
  }
}

export async function fetchAllRemakeWorkOrders() {
  const url = `${BASE_URL}/Remake/GetRemakes`;
  return axios.get(url, getConfig());
}

export async function fetchRemakeCountByStatus(status) {
  const url = `${BASE_URL}/Remake/GetRemakeCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return axios.get(url, getConfig());
}

export async function fetchRemakeWorkOrders(
  pageNumber,
  pageSize,
  status,
  sortBy,
  isDescending
) {
  const url = `${BASE_URL}/Remake/GetRemakesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}&isDescending=${
    isDescending ? "true" : "false"
  }`;
  return axios.get(url, getConfig());
}

export async function updateRemakeWorkOrderState(newStatus, moduleId) {
  const url = `${BASE_URL}/Common/Transit`;
  var data = {
    moduleName: "remake",
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

export async function fetchRemakeWorkOrderById(id) {
  const url = `${BASE_URL}/Remake/GetRemakeById?remakeId=${id}`;
  return axios.get(url, getConfig());
}

export async function updateRemakeWorkOrder(data) {
  const url = `${BASE_URL}/Remake/UpdateRemakes`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: "success",
          message: "Work order updated.",
          source: "Remake Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: "error",
          message: "Work order update failed.",
          source: "Renake Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating remake:", error);
    throw error;
  }
}

export async function deleteRemakeWorkOrder(loggedInUserEmail, data) {
  const url = `${BASE_URL}/Remake/DeleteRemakesByIds?createdBy=${loggedInUserEmail}`;
  try {
    const response = await axios.post(url, data, getConfig(loggedInUserEmail));
    if (response.data) {
      store.dispatch(
        updateResult({
          type: "success",
          message: "Remake deleted.",
          source: "Remake Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: "error",
          message: "Failed to delete Remake.",
          source: "Remake Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting Remake:", error);
    throw error;
  }
}

export async function fetchProductionWindowAvailableForRemake() {
  const url = `${BASE_URL_OM}/ProdData/QueryWorkOrderHeaderWithPrefixAsync`;

  const _payload = {
    filterGroup: {
      conditions: [
        {
          field: "w_Status",
          operator: "NotEquals",
          value: "Shipped"
        },
        {
          field: "w_Status",
          operator: "NotEquals",
          value: "Cancelled"
        },
        {
          field: "w_Status",
          operator: "NotEquals",
          value: "Completed Reservations"
        },
        {
          field: "w_Status",
          operator: "NotEquals",
          value: ""
        }
      ]
    }
  }

  const payload = JSON.stringify(_payload);

  try {
    const response = await axios.post(url, payload, {
      ...getConfigOM()
    });

    return { ...response.data, department: Production };
  } catch (error) {
    //logger.error("error: ", err);
    console.error("Error fetching production windows by WO:", error);
  }
}
