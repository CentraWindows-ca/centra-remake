"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./propertyFilters.module.css";

import { OrderFilters, ManufacturingFacilityFilter } from "app/utils/constants";

import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import { Checkbox, Badge } from "antd";

import WOFilter from "../../filters/woFilter/woFilter";

export default function PropertyFilters(props) {
  const { filters, setFilters, setApplyDisabled } = props;

  const { department, filteredWorkOrders } = useSelector(
    (state) => state.orders
  );

  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState();

  useEffect(() => {
    if (filters) {
      setCurrentTab(filters[0]?.key);
    }
  }, [filters]);

  useEffect(() => {
    if (department && setFilters) {
      const _filters = department?.key
        ? [...OrderFilters?.find((x) => x.key === department?.key)?.values]
        : [];
      if (_filters) {
        setFilters(_filters);
      }
    }
  }, [department, setFilters]);

  // On every calendar change, select topmost tab
  useEffect(() => {
    if (department) {
      setTimeout(() => {
        const filterTabs = document.getElementById(
          "filter-button-group"
        )?.children;
        if (filterTabs?.length > 0) {
          filterTabs[0].click();
        }
      }, 100);
    }
  }, [department]);

  //const handleTabChange = (e) => {
  //  if (e?.target?.id) {
  //    let tabKey = e.target.id.replace('btnradiofilter-', '');
  //    if (tabKey) {
  //      setSelectedTab(tabKey);
  //    }
  //  }
  //}

  const handleCheckboxClick = useCallback(
    (e) => {
      if (currentTab && e.target?.name) {
        setFilters((fs) => {
          let _fs = JSON.parse(JSON.stringify(fs));
          _fs.forEach((f) => {
            if (f.key === currentTab) {
              f.fields?.forEach((ff) => {
                if (ff.key === e.target.name) {
                  ff.value = !ff.value;
                }
              });
            }
          });
          return _fs;
        });
      }
    },
    [currentTab, setFilters]
  );

  const handleSelectAllClick = useCallback(
    (e) => {
      if (e.target && currentTab && filters) {
        let index = filters.findIndex((x) => x.key === currentTab);
        setFilters((fs) => {
          let _fs = JSON.parse(JSON.stringify(fs));
          _fs[index].fields.forEach((f) => {
            f.value = e.target.checked;
          });
          return _fs;
        });
      }
    },
    [filters, currentTab, setFilters]
  );

  // Render tabs using CelanderFilters from constants, ensure that Manufacturing Facility does not generate a tab of its own
  useEffect(() => {
    let _tabs = [];
    if (filters && OrderFilters && department) {
      [
        ...OrderFilters.find((x) => x.key === department.toLowerCase())?.values,
      ].forEach((e) => {
        _tabs.push({
          key: e.key,
          value: e.label,
        });
      });

      // _tabs.push({ key: "workOrderNumber", value: "Work Order #" });

      setTabs(_tabs);
    }
  }, [department, filters]);

  useEffect(() => {
    if (filters) {
      let aPropertyHasAllCheckboxesUnchecked = false;

      filters.forEach((f) => {
        if (!aPropertyHasAllCheckboxesUnchecked) {
          aPropertyHasAllCheckboxesUnchecked = f.fields?.every((x) => !x.value);
        }
      });

      setApplyDisabled(aPropertyHasAllCheckboxesUnchecked);
    }
  }, [filters, setApplyDisabled]);

  return (
    <div className={styles.root}>
      <div
        className="flex flex-row justify-end pt-3 pl-2 pb-2 text-xs min-h-[48px]"
        style={{ borderBottom: "1px dotted lightgrey" }}
      >
        {currentTab !== "workOrderNumber" && (
          <Checkbox
            onChange={(e) => handleSelectAllClick(e)}
            checked={
              filters
                ?.find((x) => x.key === currentTab)
                ?.fields.every((y) => y.value) || false
            }
            indeterminate={
              filters
                ?.find((x) => x.key === currentTab)
                ?.fields.some((y) => y.value) &&
              filters
                ?.find((x) => x.key === currentTab)
                ?.fields.some((y) => !y.value)
            } // Some are true some are false
          >
            {<div className="pt-1 text-xs">Select All</div>}
          </Checkbox>
        )}
      </div>
      <Tab.Container defaultActiveKey={"state"}>
        <div className="flex flex-row h-100">
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{
              width: "15.5rem",
              paddingTop: "1rem",
              borderRadius: "5px 0 0 5px",
            }}
          >
            <Nav variant="pills" className="flex-column">
              {tabs.map((tab, index) => {
                let count =
                  tab.key === "workOrderNumber"
                    ? filteredWorkOrders?.length
                    : filters
                        ?.find((x) => x.key === tab.key)
                        ?.fields.filter((y) => !y.value)?.length;

                return (
                  <Nav.Item
                    key={`tab-${index}`}
                    onClick={() => setCurrentTab(tab.key)}
                    className={styles.navItem}
                  >
                    <Nav.Link
                      eventKey={tab.key}
                      className={styles.navLink}
                      style={{
                        marginTop: index !== 0 ? "5px" : 0,
                        fontSize: "0.8rem",
                        padding: 0,
                        height: "100%",
                      }}
                    >
                      <div className="pt-1 pb-1 pl-1">
                        {`${tab.value}`}
                        <Badge
                          size={"small"}
                          title={
                            tab.key === "workOrderNumber"
                              ? "Displayed work orders"
                              : "Hidden field values"
                          }
                          className="pl-1"
                          count={count}
                          style={{
                            backgroundColor:
                              tab.key === "workOrderNumber"
                                ? "#52c41a"
                                : "#faad14",
                          }}
                        />
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>

          <div
            className="overflow-y-auto w-100"
            style={{ borderLeft: "1px dotted lightgrey" }}
          >
            <Tab.Content style={{ height: "100%" }}>
              <div className="p-2 rounded h-100">
                {filters
                  ?.find((fs) => fs.key === currentTab)
                  ?.fields?.map((f) => {
                    return (
                      <div
                        key={f.key}
                        className={`${styles.checkboxLabelRoot} hover:cursor-pointer flex flex-row`}
                      >
                        <Checkbox
                          name={f.key}
                          onChange={handleCheckboxClick}
                          checked={f.value}
                          className="text-sm"
                        >
                          {f.label}
                        </Checkbox>
                      </div>
                    );
                  })}
                {/* {currentTab === "workOrderNumber" && (
                  <WOFilter setShowFilter={() => {}} className="pl-1 h-100" />
                )} */}
              </div>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
}
