import { YMDDateFormat } from "./utils";

export const routeToPage = (router, page) => {
    if (router && page) {
        router.push(`?page=${page}`, undefined, { shallow: true });
    }
}

export const routeToCalendarView = (router, page, department, date) => {
    if (router && page && department) { 
        router.push(`?department=${department?.key}&page=${page}&date=${YMDDateFormat(date)}`, undefined, { shallow: true });
    }
}

export const routeToWorkOrder = (router, workOrderNumber) => {
    if (router && workOrderNumber) {
        router.push(`workorder/?work-order-number=${workOrderNumber}`, undefined, { shallow: true });
    }
}