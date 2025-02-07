import moment from "moment";

export const convertToLocaleDateTime = (date) => {
  return moment.utc(date).local().toDate();
};

export const convertToLocaleDateTimeLLL = (date) => {
  return moment.utc(date).local().format("LLL");
};

export const convertToLocaleDateTimell = (date) => {
  return moment.utc(date).local().format("ll");
};

export const convertToLocaleDateTimelll = (date) => {
  return moment.utc(date).local().format("lll");
};
