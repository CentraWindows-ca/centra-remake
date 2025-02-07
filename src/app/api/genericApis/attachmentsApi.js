import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL } from "../../../app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchAttachments(module, moduleId) {
  const url = `${BASE_URL}/Common/GetFiles?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveAttachment(module, moduleId, documents) {
  const url = `${BASE_URL}/Common/UploadFiles?module=${module}&parentId=${moduleId}`;

  try {
    const response = await axios.post(url, documents, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error saving document(s):", error);
    throw error;
  }
}

export async function deleteAttachments(module, ids) {
  const url = `${BASE_URL}/Common/DeleteFilesByIds?module=${module}`;

  try {
    const response = await axios.post(url, ids, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error deleting document(s):", error);
    throw error;
  }
}
