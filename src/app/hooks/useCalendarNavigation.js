import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Pages } from "app/utils/constants";

import moment from "moment";

const useCalendarNavigation = ({ setDate, calendarRef, date, calendarApi, refetch }) => {
  const dispatch = useDispatch();

  const {
    page,
    markedWorkOrderId
  } = useSelector((state) => state.calendar);

  // Scroll to searched item
  useEffect(() => {
    if (calendarRef && date && markedWorkOrderId) {
      setTimeout(() => {
        let dayElements = document.getElementsByClassName(
          "fc-daygrid-day-number"
        );
        let dateElement = null;
        if (dayElements?.length > 0) {
          let startIndex = -1;

          for (let i = 0; i < dayElements.length; i++) {
            if (dayElements[i].innerHTML == "1") { // Find first instance of 1 in order to skip dates of the previous month
              startIndex = i;
              break;
            }
          }

          for (let i = startIndex; i < dayElements.length; i++) {
            if (dayElements[i].innerHTML == moment(date).format("DD")) {
              dateElement = dayElements[i];
              break;
            }
          }

          if (dateElement) {
            dateElement.scrollIntoView({ top: 0, behavior: "smooth" });
          }
        }
      }, 2500);
    }
  }, [calendarRef, date, markedWorkOrderId]);

  const moveDateBack = useCallback(() => {
    setDate(x => {
      let _x = x.clone();
      let _p = "M";

      if (page === Pages.month) {
        
      } else if (page === Pages.week) {
        _p = "weeks";
      } else if (page === Pages.day) {
        _p = "days";
      }

      _x.subtract(1, _p);
      return _x;
    });

    setTimeout(() => refetch(), 2000);
  }, [page, setDate, refetch]);

  const moveDateForward = useCallback(() => {
    setDate(x => {
      let _x = x.clone();
      let _p = "M";

      if (page === Pages.month) {
        
      } else if (page === Pages.week) {
        _p = "weeks";
      } else if (page === Pages.day) {
        _p = "days";
      }

      _x.add(1, _p);

      return _x;
    });

    setTimeout(() => refetch(), 2000);
  }, [page, setDate, refetch]);

  const handleTodayButtonClick = useCallback(() => {
    if (calendarRef && date) {
      if (page === Pages.month || page === "returnUrl") {
        // Only reload work orders if not in the current month
        if (moment(date).year() !== moment().year() || moment(date).month() !== moment().month()) {
          setDate(moment());
        }

        setTimeout(() => {
          let dayElements = document.getElementsByClassName(
            "fc-daygrid-day-number"
          );

          let todayElement = null;
          if (dayElements?.length > 0) {
            let startIndex = -1;

            for (let i = 0; i < dayElements.length; i++) {
              if (dayElements[i].innerHTML == "1") { // Find first instance of 1 in order to skip dates of the previous month
                startIndex = i;
                break;
              }
            }

            for (let i = startIndex; i < dayElements.length; i++) {
              if (dayElements[i].innerHTML == moment().format("D")) { // Comparing today's date here             
                todayElement = dayElements[i];
                break;
              }
            }

            if (todayElement) {
              todayElement.scrollIntoView({ top: 0, behavior: "smooth" });
            }
          }
        }, 2000);
      }

      if (page === Pages.week || page === Pages.day) {
        setDate(moment())
      }
    }
  }, [calendarRef, setDate, date, page]);

  const goToDateCallback = useCallback(
    (date) => {
      if (calendarRef?.current && date && calendarApi) {
        calendarApi.gotoDate(moment(date).toISOString());
      }
    },
    [calendarRef, calendarApi]
  );

  return {
    moveDateBack,
    moveDateForward,
    handleTodayButtonClick,
    goToDateCallback
  }
};

export default useCalendarNavigation;