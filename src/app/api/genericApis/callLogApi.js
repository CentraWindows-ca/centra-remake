import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL } from "../../../app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchCallLogs(module, moduleId) {
  const url = `${BASE_URL}/Common/GetCallLogs?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveCallLog(module, data) {
  const url = `${BASE_URL}/Common/AddCallLog?module=${module}`;

  try {
    const response = await axios.post(url, data, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error saving call log:", error);
    throw error;
  }
}

export async function deleteCallLog(module, id) {
  const url = `${BASE_URL}/Common/DeleteCallLogById?module=${module}&Id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error deleting call log:", error);
    throw error;
  }
}
