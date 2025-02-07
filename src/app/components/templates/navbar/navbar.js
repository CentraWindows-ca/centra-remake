"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import styles from "./navbar.module.css";

import Fade from "@mui/material/Grow";
import Select from "app/components/atoms/select/select";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Tooltip from "@mui/material/Tooltip";

import { useRouter } from "next/navigation";

import { SearchCategories, Pages } from "app/utils/constants";
import { routeToPage } from "../../utils/routes";

import {
  updateFilterEntry,
  updateSearchEntry,
  updatePage,
} from "app/redux/orders";

export default function Navbar(props) {
  const { initialValue, onChange, toggleDrawer, drawerOpen, searchEvents } =
    props;

  const [showSearch, setShowSearch] = useState(false);
  const [searchEntry, setSearchEntry] = useState("");
  const [filterEntry, setFilterEntry] = useState("");

  const router = useRouter();

  const SEARCH = "Search";
  const FILTER = "Filter";

  const [buttonFunction, setButtonFunction] = useState(SEARCH);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("api/userinfo");
        const data = await response.json();
        setUsername(data?.username);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchEntry(e.target.value);
  };

  const handleFilterInputChange = (e) => {
    setFilterEntry(e.target.value);
  };

  useEffect(() => {
    dispatch(updateFilterEntry(filterEntry));
  }, [dispatch, filterEntry]);

  const handleSearchClick = useCallback(
    (e) => {
      if (e && searchEvents && searchEntry && router) {
        searchEvents(searchEntry);
        dispatch(updateSearchEntry(searchEntry));
        if (router) {
          routeToPage(router, Pages.searchResults);
        }
      }
    },
    [dispatch, searchEvents, searchEntry, router]
  );

  return (
    <nav className={`navbar ${styles.root}`}>
      {drawerOpen ? (
        <MenuOpenIcon className={styles.menuIcon} onClick={toggleDrawer} />
      ) : (
        <MenuIcon className={styles.menuIcon} onClick={toggleDrawer} />
      )}
      <div className={styles.userAccountRoot}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Fade in={showSearch}>
            <div className={`input-group mb-2 mt-2 ${styles.inputGroup}`}>
              <div
                style={{ paddingRight: "0.5rem" }}
                className={styles.selectContainer}
              >
                <Select
                  className={styles.select}
                  initialValue={initialValue}
                  options={SearchCategories}
                  ariaLabel={"search-category-selection"}
                  onChange={onChange}
                />
              </div>
              <div
                style={{ backgroundColor: "#FFF", borderRadius: "3px 0 0 3px" }}
              >
                <div style={{ paddingTop: "8px", marginLeft: "-2px" }}>
                  {buttonFunction === SEARCH && (
                    <Tooltip title="Switch to filter mode" placement="bottom">
                      <SearchIcon
                        className={styles.inputIcon}
                        onClick={() => setButtonFunction(FILTER)}
                      />
                    </Tooltip>
                  )}
                  {buttonFunction === FILTER && (
                    <Tooltip title="Switch to search mode" placement="bottom">
                      <FilterAltIcon
                        className={styles.inputIcon}
                        onClick={() => setButtonFunction(SEARCH)}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder=""
                aria-label="search entry"
                value={buttonFunction === SEARCH ? searchEntry : filterEntry}
                onChange={
                  buttonFunction === SEARCH
                    ? handleSearchInputChange
                    : handleFilterInputChange
                }
              />
              {buttonFunction === SEARCH && (
                <div style={{ marginLeft: "0.5rem", borderRadius: "2px" }}>
                  <button
                    type="button"
                    className={`btn btn-primary ${styles.buttonSearch}`}
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </Fade>
          {showSearch ? (
            <Tooltip title="Close quick search" placement="bottom">
              <CloseIcon
                className={styles.searchIcon}
                onClick={() => {
                  setShowSearch(false);
                  setSearchEntry("");
                  setFilterEntry("");
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Open quick search" placement="bottom">
              <SearchIcon
                className={styles.searchIcon}
                onClick={() => setShowSearch(true)}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </nav>
  );
}
