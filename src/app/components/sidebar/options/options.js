"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./options.module.css";

import IconSwitch from "app/components/atoms/iconSwitch/iconSwitch";
import {
  EventsShownOptions,
  CalendarFontSizeOptions,
} from "app/utils/constants";
import { useCookies } from "react-cookie";

import { updateIsReadOnly, updateHasWritePermission } from "app/redux/app";

import { Select } from "antd";

export default function Options() {
  const [cookies, setCookie] = useCookies(["options"]);
  const [isClient, setIsClient] = useState(false); // Hydration Fix

  const { isReadOnly, userData, canEdit } = useSelector((state) => state.app);
  const { department } = useSelector((state) => state.calendar);

  const dispatch = useDispatch();

  const updateCookie = useCallback(
    (name, val) => {
      if (cookies && name) {
        let _options = { ...cookies.options };
        _options[name] = val;
        setCookie("options", _options, {
          path: "/",
          expires: new Date(Date.now() + 2592000),
          maxAge: 2592000,
        });
      }
    },
    [cookies, setCookie]
  );

  const handleReadOnlyChange = useCallback(
    (e) => {
      if (e) {
        dispatch(updateIsReadOnly(e.target.checked));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // TODO: move to redux
  useEffect(() => {
    if (userData && department && true) {
      let _departmentPermissions = null;
      const _userPermissions = userData.permissions?.find(
        (x) => x.displayName === "Orders"
      )?.applicationFeatures;

      if (userData.defaultPermissions?.length > 0) {
        _departmentPermissions =
          userData.defaultPermissions[0]?.permissions?.find(
            (x) => x.displayName === "Orders"
          )?.applicationFeatures;
      }

      let permissionName = `${capitalizeFirstLetter(
        department.value
      )} Calendar`;
      let myPermission = {
        userEdit: _userPermissions
          ? _userPermissions?.find((x) => x.name === permissionName)?.canEdit
          : null,
        departmentEdit: _departmentPermissions
          ? _departmentPermissions?.find((x) => x.name === permissionName)
              ?.canEdit
          : null,
      };

      console.log("myPermission", myPermission);

      if (myPermission) {
        let _canEdit = false;

        if (myPermission?.userEdit) {
          // user permission is assigned, doesn't matter what the department permission is anymore
          _canEdit = true;
        } else if (myPermission?.userEdit === false) {
          _canEdit = false;
        } else if (myPermission?.userEdit === null) {
          // user permission not assigned. need to rely on department permission
          _canEdit = myPermission.departmentEdit;
        }

        dispatch(updateIsReadOnly(!_canEdit));
        dispatch(updateHasWritePermission(_canEdit));
        //dispatch(updateIsReadOnly(true));
        //dispatch(updateCanEdit(true));
      }
    }
  }, [dispatch, userData, department]);

  return (
    <div className={styles.root}>
      {isClient && (
        <table className="w-100">
          <tbody>
            <tr>
              <td>
                <i className="fa-solid fa-calendar-day pr-2 text-slate-400" />
                <span>Hide weekends</span>
              </td>
              <td>
                <IconSwitch
                  onChange={(e) => {
                    updateCookie("hideWeekends", e.target.checked);
                  }}
                  checked={cookies?.options?.hideWeekends || false}
                  style={{ paddingLeft: "0.5rem" }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa-solid fa-maximize pr-2 text-slate-400" />
                <span>Expand events</span>
              </td>
              <td>
                <IconSwitch
                  onChange={(e) => {
                    updateCookie("expandEvents", e.target.checked);
                  }}
                  checked={cookies?.options?.expandEvents || false}
                  style={{ paddingLeft: "0.5rem" }}
                />
              </td>
            </tr>
            <tr>
              <td>
                {isReadOnly && (
                  <i className="fa-solid fa-lock pr-2 text-slate-400" />
                )}
                {!isReadOnly && (
                  <i className="fa-solid fa-lock-open pr-2 text-slate-400"></i>
                )}
                <span>Read-only mode</span>
              </td>
              <td>
                <IconSwitch
                  onChange={handleReadOnlyChange}
                  checked={isReadOnly}
                  style={{ paddingLeft: "0.5rem" }}
                  disabled={!canEdit}
                />
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa-solid fa-list-ol pr-2 text-slate-400" />
                <span className="text-sm">Events shown</span>
              </td>
              <td>
                <Select
                  options={EventsShownOptions}
                  style={{ width: "4rem" }}
                  value={cookies?.options?.dayMaxEvents || 100}
                  onChange={(val) => {
                    updateCookie("dayMaxEvents", val);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa-solid fa-font pr-2 text-slate-400" />
                <span className="text-sm">
                  <span>Calendar font size</span>
                </span>
              </td>
              <td>
                <Select
                  options={CalendarFontSizeOptions}
                  style={{ width: "4rem" }}
                  value={cookies?.options?.calendarFontSize || 0.8}
                  onChange={(val) => {
                    updateCookie("calendarFontSize", val);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
