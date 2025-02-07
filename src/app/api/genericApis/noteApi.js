import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL } from "../../../app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchNotes(module, moduleId) {
  const url = `${BASE_URL}/Common/GetGeneralNotes?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveNote(module, data) {
  const url = `${BASE_URL}/Common/AddGeneralNote?module=${module}`;

  try {
    const response = await axios.post(url, data, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
}

export async function deleteNote(module, id) {
  const url = `${BASE_URL}/Common/DeleteGeneralNotesById?module=${module}&Id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());

    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}
