import moment from "moment";
import {
  CalendarTypes,
  InstallationStates,
  DepartmentIcons,
  RemakeRowStates,
  ServiceStates,
  OrderFilters,
  Installation,
} from "app/utils/constants";

export const openBlob = (base64, mimeType) => {
  if (base64 && mimeType) {
    let byteCharacters = atob(base64);
    if (byteCharacters) {
      let byteNumbers = new Array(byteCharacters.length);
      if (byteNumbers) {
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        if (byteArray) {
          let file = new Blob([byteArray], { type: mimeType + ";base64" });
          if (file) {
            let fileURL = URL.createObjectURL(file);
            if (fileURL) {
              window.open(fileURL);
            }
          }
        }
      }
    }
  }
};

export const convertBase64ToFile = (base64String, fileName) => {
  let arr = base64String.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let uint8Array = new Uint8Array(n);
  while (n--) {
    uint8Array[n] = bstr.charCodeAt(n);
  }
  let file = new File([uint8Array], fileName, { type: mime });
  return file;
};

export const scrollToElement = (id) => {
  let header = document.getElementById(id);
  setTimeout(() => header.scrollIntoView({ top: 0, behavior: "smooth" }), 400);
};

// Note: Duplicates are necessary
export const mapProductionStateToKey = (name) => {
  let result = "inProgress";

  switch (name) {
    case "Draft Work Order":
    case "Draft":
      result = "draft";
      break;
    case "Shipped ": //TODO: Fix value from API, remove space after
      result = "shipped";
      break;
    case "Scheduled Work Order":
    case "Scheduled":
      result = "scheduled";
      break;
    case "In-Progress":
      result = "inProgress";
      break;
    case "Ready To Ship ": // Also has trailing space
    case "Ready To Ship":
      result = "readyToShip";
      break;
    case "On Hold":
      result = "onHold";
      break;
    default:
      break;
  }

  return result;
};

export const mapServiceEventStateToKey = (name) => {
  let result = "inProgress";

  switch (name) {
    case "New Service Draft":
      result = "newDraft";
      break;
    case "Scheduled Service":
      result = "scheduled";
      break;
    case "Service In Progress":
      result = "inProgress";
      break;
    case "Rejected Service Draft":
      result = "rejectedDraft";
      break;
    case "Rejected Service Costing":
      result = "rejectedCosting";
      break;
    case "Rejected Service":
      result = "rejectedService";
      break;
    case "Ready To Invoice":
      result = "readyToInvoice";
      break;
    case "Closed Service Quote":
      result = "closedQuote";
      break;
    case "Service Complete":
      result = "complete";
      break;
    case "Closed Service":
      result = "closed";
      break;
    case "Cancelled Service":
      result = "cancelled";
      break;
    case "Manager Review":
      result = "managerReview";
      break;
    case "Confirmed Service":
      result = "confirmed";
      break;
    default:
      break;
  }

  return result;
};

export const mapServiceTypeOfWorkToKey = (name) => {
  let result = "supplyOnlyWarranty";

  switch (name) {
    case "Supply and Install Warranty":
      result = "supplyInsWarranty";
      break;
    case "Chargeable Service":
      result = "chrgService";
      break;
    case "Warrantly & Chargeable":
      result = "warr&Chrg";
      break;
    case "New Sale":
      result = "newSale";
      break;
    case "Window Testing":
      result = "windowTesting";
      break;
    case "Supply Only Service":
      result = "supplyOnlyService";
      break;
    case "3rd Party Warranty":
      result = "3rdPartyWarranty";
      break;
    default:
      break;
  }

  return result;
};

export const getStatusOptions = (department) => {
  let _states = null;

  switch (department) {
    case "Remake":
      _states = RemakeRowStates;
      break;
    case "Service":
      _states = ServiceStates;
      break;
  }

  return Object.entries(_states).map((e) => {
    return {
      key: e[0],
      value: e[1].label,
      color: e[1].color,
      icon: e[1].icon,
    };
  });
};

export const getIcon = (department) => {
  if (DepartmentIcons.hasOwnProperty(department)) {
    return DepartmentIcons[department];
  } else {
    return null;
  }
};

export const mapRemakeRowStateToKey = (name) => {
  let result = "newOrder";

  switch (name) {
    case "In Progress":
      result = "inProgress";
      break;
    case "Completed":
      result = "completed";
      break;
    case "On Hold":
      result = "onHold";
      break;
    default:
      break;
  }

  return result;
};

export const getKeyFromVal = (states, val) => {
  let result = null;

  if (states) {
    Object.entries(states).forEach(([key, value]) => {
      if (val === value || val === value?.label) {
        result = key;
      }
    });
  }

  return result;
};

//export const mapGlassRowStateToKey = (name) => {
//  let result = "notOrdered";

//  switch (name) {
//    case "Not Ordered":
//      result = "notOrdered";
//      break;
//    case "Ordered":
//      result = "ordered";
//      break;
//    case "Received":
//      result = "received";
//      break;
//    default:
//      break;
//  }

//  return result;
//};

export const mapNoteCategoryToKey = (name) => {
  let result = "admin";

  switch (name) {
    case "Admin":
      result = "admin";
      break;
    case "General":
      result = "general";
      break;
    case "Installation":
      result = "installation";
      break;
    case "High Risk":
      result = "highrisk";
      break;
    case "Remeasure":
      result = "remeasure";
      break;
    case "Customer":
      result = "customer";
      break;
    default:
      break;
  }

  return result;
};

export const mapCallMessageTypeToKey = (name) => {
  let result = "leftMessage";

  switch (name) {
    case "No Answering Machine":
      result = "noAns";
      break;
    case "Spoke with Customer":
      result = "spokeWithCust";
      break;
    default:
      break;
  }

  return result;
};

export const generateEmptyTableMessage = (type) => {
  return `*This order does not contain any ${type}.`;
};

export const downloadFile = (url, filename) => {
  const anchorElement = document.createElement("a");

  document.body.appendChild(anchorElement);
  anchorElement.style.display = "none";
  anchorElement.href = url;
  anchorElement.download = filename;

  anchorElement.click();
};

export const textEllipsis = (
  str,
  maxLength,
  { side = "end", ellipsis = "..." } = {}
) => {
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
};

export const YMDDateFormat = (date) => {
  let result = "";

  if (date) {
    if (moment(date).isValid()) {
      result = moment(date).format("YYYY-MM-DD");
    }
  }

  return result;
};

export const YMDDateTimeFormat = (date) => {
  let result = "";

  if (date) {
    if (moment(date).isValid()) {
      result = moment(date).format("YYYY-MM-DD hh:mm A");
    }
  }

  return result;
};

export const TimeFormat = (date) => {
  let result = "";

  if (date) {
    if (moment(date).isValid()) {
      result = moment(date).format("hh:mm A");
    }
  }

  return result;
};

export const generateDaySummaryData = (workOrderData) => {
  // Windows
  let windows = 0;
  let f26CA = 0;
  let f29CA = 0;
  let f29CM = 0;
  let f68SL = 0;
  let f68VS = 0;

  // Vinyl Doors
  let vinylDoors = 0;
  let vinylDoorsMin = 0;
  let f27DS = 0;
  let f61DR = 0;
  let f27DSMin = 0;
  let f61DRMin = 0;

  // Patio Doors
  let patioDoors = 0;
  let f52PD = 0;
  let f52PDMin = 0;

  // Exterior Doors
  let exteriorDoors = 0;

  // Casements
  let casements = 0;
  let casementsMin = 0;
  let f29CMMin = 0;
  let f29CAMin = 0;
  let f26CAMin = 0;

  // Sliders
  let sliders = 0;
  let slidersMin = 0;
  let f68SLMin = 0;
  let f68VSMin = 0;

  // Glass
  let glass = 0;
  let pfg = 0;
  let cardinal = 0;
  let glassFab = 0;
  let centraCalgary = 0;

  // Boxes
  let boxes = 0;

  // Rush
  let rush = 0;

  let min = 0;

  if (workOrderData?.length > 0) {
    workOrderData.forEach((d) => {
      // Windows
      f26CA += parseInt(d.f6CA, 10);
      f29CA += parseInt(d.f29CA, 10);
      f29CM += parseInt(d.f29CM, 10);
      f68SL += parseInt(d.f68SL, 10);
      f68VS += parseInt(d.f68VS, 10);

      // Vinyl Doors
      f27DS += parseInt(d.f27DS, 10);
      f61DR += parseInt(d.f61DR, 10);

      // Patio Doors
      f52PD += parseFloat(d.f52PD);

      // Exterior Doors
      exteriorDoors += parseFloat(d.doors);

      // Glass
      pfg += parseFloat(d.pfg);
      cardinal += parseFloat(d.cardinal);
      glassFab += parseFloat(d.glassFab);

      //Boxes
      boxes += parseFloat(d.totalBoxQty);

      // Casement minutes
      f29CMMin += parseFloat(d.f29CMMin);
      f29CAMin += parseFloat(d.f29CAMin);
      f26CAMin += parseFloat(d.f26CAMin);

      // Sliders Minutes
      f68SLMin += parseFloat(d.f68SLMin);
      f68VSMin += parseFloat(d.f68VSMin);

      // Vinyl Door Minutes
      f27DSMin += parseFloat(d.f27DSMin);
      f61DRMin += parseFloat(d.f61DRMin);

      // Patio Door Minutes
      f52PDMin += parseFloat(d.f52PDMin);

      // Rush
      rush += parseFloat(d.flagOrder);

      min += parseFloat(d.totalLBRMin);

      switch (d.glassSupplier?.toLowerCase()) {
        case "pfg":
          pfg += d.totalGlassQty;
          break;
        case "cardinal":
          cardinal += d.totalGlassQty;
          break;
        case "glassfab":
          glassFab += d.totalGlassQty;
          break;
        case "centra calgary":
          centraCalgary += d.totalGlassQty;
          break;
        default:
          break;
      }
    });

    windows = f26CA + f29CA + f29CM + f68SL + f68VS;

    vinylDoors = f27DS + f61DR;
    vinylDoorsMin = f27DSMin + f61DRMin;

    casements = f29CM + f29CA + f26CA;
    casementsMin = f29CMMin + f29CAMin + f26CAMin;

    patioDoors = f52PDMin;

    sliders = f68SL + f68VS;
    slidersMin = f68SLMin + f68VSMin;

    glass = pfg + cardinal + glassFab;

    return {
      windows: windows,
      f26CA: f26CA,
      f29CA: f29CA,
      f29CM: f29CM,
      f68SL: f68SL,
      f68VS: f68VS,
      // Vinyl Doors
      vinylDoors: vinylDoors,
      vinylDoorsMin: vinylDoorsMin,
      f27DS: f27DS,
      f61DR: f61DR,
      f27DSMin: f27DSMin,
      f61DRMin: f61DRMin,
      // Patio Doors
      f52PD: f52PD,
      f52PDMin: f52PDMin,
      exteriorDoors: exteriorDoors,
      // Exterior Doors
      exteriorDoors: exteriorDoors,
      patioDoors: patioDoors,
      // Casements
      casements: casements,
      casementsMin: casementsMin,
      f29CMMin: f29CMMin,
      f29CAMin: f29CAMin,
      sliders: sliders,
      // Sliders
      sliders: sliders,
      slidersMin: slidersMin,
      f68SLMin: f68SLMin,
      f68VSMin: f68VSMin,
      // Glass
      glass: glass,
      pfg: pfg,
      cardinal: cardinal,
      glassFab: glassFab,
      centraCalgary: centraCalgary,
      // Boxes
      boxes: boxes,
      // Rush
      rush: rush,
      min: min,
      max: 0,
      availableTime: -1 * min,
      availableStaff: 0,
    };
  }
};

export const getDepartmentFromPathname = (pathname) => {
  let result = {};

  if (pathname) {
    CalendarTypes.forEach((c) => {
      if (pathname.includes(c.key)) {
        result = c;
      }
    });
  }

  return result;
};

export const sortByColumnName = (arr, columnName, descending = false) => {
  const sortedArray = arr.slice();

  sortedArray.sort((a, b) => {
    const valueA = a[columnName];
    const valueB = b[columnName];

    if (valueA < valueB) {
      return descending ? 1 : -1;
    }
    if (valueA > valueB) {
      return descending ? -1 : 1;
    }
    return 0;
  });

  return sortedArray;
};

export const openFile = (base64, mimeType, filename) => {
  var byteCharacters = atob(base64);
  var byteNumbers = new Array(byteCharacters.length);

  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  var byteArray = new Uint8Array(byteNumbers);
  var file = new Blob([byteArray], { type: mimeType + ";base64" });
  var fileURL = URL.createObjectURL(file);

  downloadFile(fileURL, filename);
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const DataURIToBlob = (dataURI) => {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
};

export const buildInstallationEvents = (workOrders) => {
  let result = [];
  // Date range fix, calendar end date will always be +1 but end date displayed on work order will still be original value

  if (workOrders?.length > 0 && InstallationStates) {
    workOrders.forEach((wo, index) => {
      // Based on the old webcalendar, if wo has wo.startScheduleDate, use that if w/o use wo.start
      // let currentMonth = moment().format("MM");
      // let startScheduleDateMonth = moment(wo.startScheduleDate).format("MM");

      let startDate = moment(wo.startScheduleDate || wo.start).format(
        "YYYY-MM-DD"
      );
      let endDate = moment(wo.endScheduleDate || wo.end)
        .add(1, "days")
        .format("YYYY-MM-DD");

      /* But if wo.startScheduleDate is not in the current month, use wo.start instead - Disabled for now
      if (currentMonth !== startScheduleDateMonth) {
        startDate = moment(wo.start).format("YYYY-MM-DD");
        endDate = moment(wo.end).add(1, "days").format("YYYY-MM-DD");
      }
      */

      let _wo = {
        id: wo.workOrderNumber,
        actionItemId: wo.actionItemId,
        start: startDate,
        end: endDate,
        lastName: wo.lastName,
        title: wo.workOrderNumber,
        allDay: true,
        state: wo.currentStateName, // for installation, state values are saved so no need to map values to keys
        backgroundColor:
          InstallationStates[
            getKeyFromVal(InstallationStates, wo.currentStateName)
          ]?.color,
        borderColor:
          InstallationStates[
            getKeyFromVal(InstallationStates, wo.currentStateName)
          ]?.color,
        textColor: "#000",
        type: Installation,
        extendedProps: {
          icons: {},
          index: index,
          jobDifficulty: wo.jobDifficulty,
          installerCount: wo.estInstallerCnt,
          days:
            (new Date(wo.end)?.getTime() - new Date(wo.start)?.getTime()) /
            (24 * 60 * 60 * 1000),
          state: wo.currentStateName,
          city: wo.city,
          windows: wo.totalWindows,
          doors: wo.totalDoors,
          extDoors: wo.totalExtDoors,
          ffiCount: wo.ffiCount,
          ffrCount: wo.ffrCount,
          leadPaint: wo.leadPaint,
          powerDisconnect: wo.powerDisconnect,
          asbestos: wo.totalAsbestos,
          financing: wo.financing,
          financingStartDate: wo.financingStartDate,
          woodDropOff: wo.totalWoodDropOff,
          highRisk: wo.totalHighRisk,
          returnedJob: wo.returnedJob,
          homeDepotJob: wo.homeDepotJob,
          abatement: wo.abatementRequired,
          isTextSent: wo.isTextSent,
          isEmailSent: wo.isEmailSent,
          isInQueue: wo.isInQueue,
          installWindowLbrMin: wo.installationWindowLBRMIN,
          installPatioDoorLbrMin: wo.installationPatioDoorLBRMin,
          installExtDoorLbrMin: wo.installationDoorLBRMin,
          areAllExteriorDoorsShipped: wo.isAllExteriorDoorShipped,
          areAllPatioDoorsShipped: wo.isAllPatioDoorShipped,
          areAllVinylDoorsShipped: wo.isAllVinylDoorShipped,
          areAllWindowsShipped: wo.isAllWindowsShipped,
        },
      };

      // Multi-day event workaround
      let existingWOIndex = result.findIndex(
        (x) => x.id === wo.workOrderNumber
      );

      if (existingWOIndex < 0) {
        result.push(_wo);
      }
    });
  }
  return result;
};

export const setAppDetails = (name) => {
  let appTitleElement = document.getElementById("app-title");
  if (appTitleElement) {
    appTitleElement.textContent = name;
  }
};

export const isValueValid = (value, groupKey, department) => {
  let result = false;

  if (groupKey) {
    let group = OrderFilters.find((x) => x.key === department)?.values?.find(
      (y) => y.key === groupKey
    );
    if (group?.fields?.length > 0) {
      let found = group.fields.find(
        (x) => x.key?.toLowerCase() === value?.toLowerCase()
      );
      if (found) {
        result = true;
      }
    }
  }

  return result;
};

export const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    let result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const generateRow = (label, rgbColor) => {
  let result = [];

  result = [
    {
      columns: [
        {
          title: label,
          style: {
            font: { sz: "10", bold: true, color: { rgb: rgbColor } },
            alignment: { wrapText: false },
          },
        },
      ],
      data: [],
    },
  ];

  return result;
};

export const openWOLink = (workOrderNo) => {
  const url = `/?page=workorder&work-order-number=${workOrderNo}&department=production`;
  window.open(url, "_blank");
};

export const generateOptions = (count) => {
  const options = [];
  for (let i = 1; i <= count; i++) {
    options.push({ value: i, label: `${i}` });
  }
  return options;
};

export const generateFilterOptions = () => {};
