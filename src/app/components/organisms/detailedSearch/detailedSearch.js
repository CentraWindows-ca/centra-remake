"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./detailedSearch.module.css";

import FormControl from "@mui/material/FormControl";
import ReactSelect from "react-select";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { SearchCategories, Production } from "app/utils/constants";

import { search } from "app/api/productionApis";
import { Button, Select, Input, Typography } from "antd";
const { Text } = Typography;

import Tooltip from "app/components/atoms/tooltip/tooltip";
import moment from "moment";

export default function DetailedSearch(props) {
  const { defaultValue = "Production" } = props;

  const [selectedCategory, setSelectedCategory] = useState(
    SearchCategories.find((x) => x.value === defaultValue)
  );
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchForItems, setSearchForItems] = useState([]);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchForItems) {
      let searchValExists = searchForItems.find((s) => s.value);
      setButtonEnabled(searchValExists ? true : false);
    }
  }, [searchForItems]);

  const handleCategoryChange = (val) => {
    if (val) {
      setSelectedCategory(SearchCategories.find((sc) => sc.key === val));
      setSelectedFields([]);
    }
  };

  const handleSelectFields = useCallback((val) => {
    setSelectedFields(val);
    // Make sure the search properties being passed match the properties which are selected
    setSearchForItems((si) => {
      let _si = [...si];
      let newSearchItems = [];

      _si.forEach((_s) => {
        let exists = val.find((v) => v.key === _s.key);
        if (exists) {
          newSearchItems.push(_s);
        }
      });

      return newSearchItems;
    });
  }, []);

  const handleInputChange = (e) => {
    if (e) {
      setSearchForItems((si) => {
        let _si = [...si];
        let itemIndex = _si.map((o) => o.key).indexOf(e.target.name);

        if (itemIndex > -1) {
          // Item already exists, just update the value
          _si[itemIndex].value = e.target.value;
        } else {
          _si.push({
            key: e.target.name,
            value: e.target.value,
          });
        }

        return _si;
      });
    }
  };

  const handleSearchClick = useCallback(() => {
    if (searchForItems?.length > 0 && selectedCategory?.key) {
      let searchEntry = "";

      router.push(`/search?department=${selectedCategory?.key}`);
      //dispatch(searchSlice.actions.updateIsLoading(true));

      let camelToPascalCase = (string) => {
        let result = "";
        if (string) {
          result = string[0]?.toUpperCase() + string.slice(1);
        }
        return result;
      };

      const _searchForItems = searchForItems.map((x) => {
        searchEntry += `${searchEntry ? ", " : ""}${x.key[0]?.toUpperCase()}: ${
          x.value
        }`;

        return {
          fieldName: camelToPascalCase(x.key),
          fieldValue: x.value,
          fieldOperator: 0,
          fieldType: 0,
        };
      });
      const today = moment();
      const startDate = today.clone().subtract(1, "years").format("YYYY-MM-DD");
      const endDate = today.clone().add(1, "years").format("YYYY-MM-DD");
      search(
        selectedCategory.key,
        "Full Search",
        _searchForItems,
        startDate,
        endDate
      );
      //dispatch(searchSlice.actions.updateSearchEntry(searchEntry));
    }
  }, [dispatch, router, selectedCategory, searchForItems]);

  const fieldSelectStyle = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ced4da",
      backgroundColor: "white",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #ced4da",
      },
      "&:focus": {
        border: "1px solid red",
        boxShadow: "0px 0px 6px red",
      },
      cursor: "pointer",
      fontSize: "0.85rem",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "0.8rem",
    }),
  };

  let options = SearchCategories.map((d) => {
    const enableOption = d.key === Production;

    return {
      value: d.key,
      label: d.value,
      disabled: !enableOption,
    };
  });

  const handleResetClick = () => {
    setSearchForItems([]);
    setSelectedFields([]);
  };

  const handleOptionsChange = (key, val) => {
    if (key && val) {
      setSearchForItems((si) => {
        let _si = [...si];
        let itemIndex = _si.map((o) => o.key).indexOf(key);

        if (itemIndex > -1) {
          // Item already exists, just update the value
          _si[itemIndex].value = value;
        } else {
          let _val = val;

          if (key === "shippingType" && val === "Missing Data") {
            _val = "Select One"; // I checked ffDB and this is the default value if none is selected
          }

          _si.push({
            key: key,
            value: _val,
          });
        }

        return _si;
      });
    }
  };

  return (
    <div style={{ paddingRight: "1rem" }}>
      <div className={styles.selectContainer}>
        <FormControl sx={{ m: 1, width: "100%" }}>
          <Text className="pb-[3px]">Category</Text>
          <Select
            defaultValue={options[0]}
            options={options}
            onChange={handleCategoryChange}
            style={{ fontSize: "0.9rem" }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "100%", fontSize: "0.9rem" }}>
          <Text className="pb-[3px]">Search Fields</Text>
          <ReactSelect
            instanceId={"search-fields"}
            isMulti
            name="search-fields"
            options={selectedCategory.fields}
            className="field-multi-select"
            classNamePrefix="select"
            onChange={handleSelectFields}
            value={selectedFields}
            styles={fieldSelectStyle}
          />
        </FormControl>
      </div>
      {selectedFields.map((sf) => (
        <div
          key={sf.key}
          className={`${styles.searchInputRoot} flex flex-row justify-between`}
        >
          <div className="text-sm" style={{ maxWidth: "6rem" }}>
            {
              SearchCategories.find(
                (sc) => sc.value === selectedCategory.value
              ).fields.find((f) => f.value === sf.value)?.value
            }
          </div>
          {!sf.selectionOptions && (
            <Input
              id={sf.key}
              name={sf.key}
              className={styles.searchInput}
              onChange={handleInputChange}
              style={{ width: "10rem", marginRight: "-0.5rem" }}
            />
          )}
          {sf.selectionOptions?.length > 0 && (
            <Select
              onChange={(val) => handleOptionsChange(sf.key, val)}
              placeholder="Select an option"
              //defaultValue={sf.selectionOptions[0]?.value}
              style={{ width: 158, marginRight: "-7px" }}
              options={sf?.selectionOptions
                .concat({ key: "missingData", value: "Missing Data" })
                .map((x) => {
                  return {
                    value: x.value,
                    label: x.value,
                  };
                })} // Allow searching for empty values
            />
          )}
        </div>
      ))}
      <div
        className="flex flex-row justify-between mt-3 pt-3 pl-2"
        style={{ marginRight: "-0.5rem", borderTop: "1px dotted lightgrey" }}
      >
        <Tooltip title={"Clear all input and start over"}>
          <Button
            disabled={
              searchForItems?.length === 0 && selectedFields?.length === 0
            }
            onClick={handleResetClick}
          >
            Reset
          </Button>
        </Tooltip>
        <Button
          disabled={!buttonEnabled}
          type="primary"
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
