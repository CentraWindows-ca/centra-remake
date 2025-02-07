import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL } from "../../../app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchImages(module, moduleId) {
  const url = `${BASE_URL}/Common/GetImages?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveImages(module, moduleId, images) {
  const url = `${BASE_URL}/Common/UploadImages?module=${module}&parentId=${moduleId}`;

  try {
    const response = await axios.post(url, images, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error saving call log:", error);
    throw error;
  }
}

export async function deleteImages(module, ids) {
  const url = `${BASE_URL}/Common/DeleteImagesByIds?module=${module}`;

  try {
    const response = await axios.post(url, ids, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error deleting call log:", error);
    throw error;
  }
}
