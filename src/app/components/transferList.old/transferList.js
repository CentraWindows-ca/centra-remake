"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Checkbox } from "antd";
import Event from "app/components/events/productionEvent";

import { Empty } from "antd";

import Tooltip from "app/components/tooltip/tooltip";

export default function TransferList(props) {
  const { listItems, setListItems } = props;

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [sortByKey, setSortByKey] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedSourceListItems, setSortedSourceListItems] = useState([]);
  const [sortInfo, setSortInfo] = useState({
    key: "id",
    direction: "asc",
  });

  const checkedEventCount = listItems.filter((x) => x.checked).length;
  const indeterminate =
    listItems.length > 0 &&
    checkedEventCount > 0 &&
    listItems.length > checkedEventCount;

  useEffect(() => {
    setSelectAllChecked(
      checkedEventCount > 0 && listItems.length === checkedEventCount
    );
  }, [checkedEventCount, listItems, setSelectAllChecked]);

  const handleCheckboxChange = (eventId) => {
    setListItems((fe) => {
      let _fe = [...fe];
      let index = _fe.findIndex((x) => x.id === eventId);
      if (index > -1) {
        _fe[index].checked = !_fe[index].checked;
      }
      return _fe;
    });
  };

  const handleSelectAllChange = (e) => {
    if (e) {
      setSelectAllChecked(e.target.checked);
      setListItems((le) => {
        let _le = [...le];

        _le.forEach((x) => {
          x.checked = e.target.checked;
        });

        return _le;
      });
    }
  };

  const compareAsc = useCallback(
    (a, b) => {
      if (a[sortByKey] < b[sortByKey]) {
        return -1;
      }

      if (a[sortByKey] > b[sortByKey]) {
        return 1;
      }

      return 0;
    },
    [sortByKey]
  );

  const compareDesc = useCallback(
    (a, b) => {
      if (a[sortByKey] < b[sortByKey]) {
        return 1;
      }

      if (a[sortByKey] > b[sortByKey]) {
        return -1;
      }

      return 0;
    },
    [sortByKey]
  );

  const handleSort = (key) => {
    setSortByKey(key);

    setSortDirection((d) => {
      let _d = d;
      if (_d === "asc") {
        _d = "desc";
      } else {
        _d = "asc";
      }

      return _d;
    });
  };

  useEffect(() => {
    if (listItems) {
      let _listItems = [...listItems];
      if (sortDirection === "asc") {
        _listItems.sort(compareAsc);
      } else {
        _listItems.sort(compareDesc);
      }

      setSortedSourceListItems([..._listItems]);
      setSortInfo({
        key: sortByKey,
        direction: sortDirection,
      });
    }
  }, [listItems, compareAsc, compareDesc, sortDirection, sortByKey]);

  return (
    <div>
      <div
        style={{
          width: "30rem",
          border: "1px solid lightgrey",
          borderRadius: "5px",
        }}
        className="mt-3"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row pt-1 pb-1">
            <Checkbox
              className="pl-2"
              onChange={handleSelectAllChange}
              indeterminate={indeterminate}
              checked={selectAllChecked}
            />
            <div className="text-sm pl-2 pt-1 pb-1 text-centraBlue">{`${checkedEventCount}/${listItems.length} Items selected`}</div>
          </div>
          <div className="flex flex-row text-sm pt-2 pr-1 text-centraBlue">
            <Tooltip title={"Sort by Work Order"}>
              <div
                className="pr-2 hover:cursor-pointer text-right"
                onClick={() => handleSort("id")}
                style={{ width: "4rem" }}
              >
                <span className="text-green-500">
                  {sortInfo.key === "id" ? (
                    sortInfo.direction === "asc" ? (
                      <i className="fa-solid fa-arrow-up"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-down"></i>
                    )
                  ) : (
                    ""
                  )}
                </span>
                <span className="pl-1">WO #</span>
              </div>
            </Tooltip>
            <Tooltip title={"Sort by Status"}>
              <div
                className="pr-2 hover:cursor-pointer text-right"
                onClick={() => handleSort("state")}
                style={{ width: "5rem" }}
              >
                <span className="text-green-500">
                  {sortInfo.key !== "id" ? (
                    sortInfo.direction === "asc" ? (
                      <i className="fa-solid fa-arrow-up"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-down"></i>
                    )
                  ) : (
                    ""
                  )}
                </span>
                <span className="pl-1">Status</span>
              </div>
            </Tooltip>
          </div>
        </div>
        {sortedSourceListItems?.length > 0 && (
          <div
            style={{
              overflow: "hidden",
              overflowY: "auto",
              minHeight: "10rem",
              height: "calc(100vh - 23.5rem)",
              borderTop: "1px solid lightgrey",
            }}
            className="pt-1"
          >
            {sortedSourceListItems.map((fe, index) => {
              return (
                <div
                  className="text-sm cursor-pointer flex flex-row"
                  onClick={() => {
                    handleCheckboxChange(fe.id);
                  }}
                  key={index}
                  style={{
                    paddingTop: "2px",
                    fontSize: "0.7rem",
                  }}
                >
                  <Checkbox
                    name={fe.id}
                    checked={fe.checked}
                    className="ml-2"
                  />
                  <Event
                    event={fe}
                    style={{
                      backgroundColor: fe.backgroundColor,
                      borderRadius: "5px",
                      paddingLeft: "3px",
                      paddingRight: "0.5rem",
                      marginLeft: "0.5rem",
                      minWidth: "90%",
                    }}
                    textStyle={{
                      fontWeight: "600",
                      fontSize: "0.7rem",
                    }}
                    className={"hover:brightness-90"}
                    isWONFirst={true}
                  />
                </div>
              );
            })}
          </div>
        )}
        {listItems?.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "10rem",
              height: "calc(100vh - 23.5rem)",
            }}
          >
            <div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
