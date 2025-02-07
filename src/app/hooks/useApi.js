"use client";
import { useSearchParams } from "next/navigation";

import moment from "moment";

// -- Constants
import {
  Production,
  Service,
  Installation
} from "app/utils/constants";

// -- Production API
import {
  fetchProductionWorkOrders
} from "app/api/productionApis";

// -- Installation API
import {
  fetchInstallationWorkOrders,
} from "app/api/installationApis";

// -- Service API
import {
  fetchServiceWorkOrders
} from "app/api/serviceApis";

import { useCookies } from "react-cookie";
import { useQuery } from "react-query";

const useApi = ({
  date,
  type
}) => {
  const [cookies, ] = useCookies(["options"]);  
  const searchParams = useSearchParams();
  const departmentParam = searchParams.get("department") || cookies?.options?.defaultCalendar || Production; // Department value heirarchy = query param -> cookie  -> const

  let fetchWorkordersEnabled = false;

  if (type === "workorders") {
    fetchWorkordersEnabled = true;
  }

  const {
    isFetching,
    data: workOrders,
    refetch,
  } = useQuery(
    "workorders",
    () => {
      const daysInMonth = moment(date).daysInMonth();
      const year = moment(date).format("YYYY");
      const month = moment(date).format("M");

      const bufferInMonths = 2;

      const startMonth = moment(date).subtract(bufferInMonths, "months").format("M");
      const endMonth = moment(date).add(bufferInMonths, "months").format("M");
      const endMonthDays = moment(date).add(bufferInMonths, "months").daysInMonth();
      const startMonthDays = moment(date).subtract(bufferInMonths, "months").daysInMonth();
      const startYear = moment(date).subtract(bufferInMonths, "months").format("YYYY");
      const endYear = moment(date).add(bufferInMonths, "months").format("YYYY");
      const _token = cookies["c.token"]?.token;

      if (daysInMonth && month && year) {
        switch (departmentParam) {
          case Production:
            // Get data starting from last month's final week and ending to next month's first week
            return fetchProductionWorkOrders(`${startYear}-${startMonth}-${1}T00:00:00`, `${endYear}-${endMonth}-${endMonthDays}T23:59:59`, _token);
          case Installation:
            return fetchInstallationWorkOrders(`${startYear}-${startMonth}-${startMonthDays - 7}T00:00:00`, `${endYear}-${endMonth}-${7}T23:59:59`); // Fix for draggging long events to the next month
          case Service:
            return fetchServiceWorkOrders(
              `${year}-${month}-01T00:00:00`,
              `${year}-${month}-${daysInMonth}T23:59:59`
            );
          default:
            break;
        }
      }
    },
    {
      enabled: fetchWorkordersEnabled,
      //refetchInterval: 30000,
      //staleTime: Infinity
    }
  );

  return {
    workOrders,
    refetch
  }
}

export default useApi;
