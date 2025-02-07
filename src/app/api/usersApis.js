import axios from "axios";

export async function fetchUsersByDepartment(
  department,
  page = 1,
  pageSize = 500
) {
  const url = `https://permissions-api.centra.ca/permissions/GetAllADUsers?department=${department}&page=${page}&pageSize=${pageSize}`;
  return axios.get(url);
}
