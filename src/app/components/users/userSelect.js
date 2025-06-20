"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Form, Select } from "antd";
import UserLabel from "./userLabel";
import { useQuery } from "react-query";
import { fetchUsersByDepartment } from "app/api/usersApis";
import _ from "lodash";
import { useAuthData } from "context/authContext";

import styled from "styled-components";

export default function UserSelectField(props) {
  const {
    value,
    style,
    isMultiSelect = false,
    label,
    fieldName,
    size = "middle",
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
    showAssignToMe = false,
    disabled,
    onChange,
    required,
  } = props;

  const CustomSelect = styled(Select)`
    .ant-select-selector {
      font-size: 12px !important;
      padding: 0px 8px !important;      
    }

    /* Dropdown options */
    .ant-select-item {
      font-size: 12px !important;
      padding: 0px 8px !important;
    } 
  `;

  const { loggedInUser } = useAuthData();

  const unassignedOption = {
    label: <UserLabel username="Unassigned" />,
    value: "",
  };
  const dispatch = useDispatch();
  const { Option, OptGroup } = Select;
  const [options, setOptions] = useState([]);

  const fetchInstallationUsers = async () => {
    const result = await fetchUsersByDepartment("Installations");
    return result.data;
  };

  const fetchServiceUsers = async () => {
    const result = await fetchUsersByDepartment("Service");
    return result.data;
  };

  const fetchITUsers = async () => {
    const result = await fetchUsersByDepartment("IT");
    return result.data;
  };
  const filterOption = (input, option) => {
    const username = _.get(option, "props.label.props.username");
    return username && username.toLowerCase().includes(input.toLowerCase());
  };

  const {
    isLoading: isLoadingInstallationUsers,
    data: installationUsers,
    isFetching: isFetchingInstallationUsers,
    refetch: refetchInstallationUsers,
  } = useQuery(["ad_install_users"], fetchInstallationUsers, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingServiceUsers,
    data: serviceUsers,
    isFetching: isFetchingServiceUsers,
    refetch: refetchServiceUsers,
  } = useQuery(["ad_service_users"], fetchServiceUsers, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingITUsers,
    data: itUsers,
    isFetching: isFetchingITUsers,
    refetch: refetchITUsers,
  } = useQuery(["ad_it_users"], fetchITUsers, {
    refetchOnWindowFocus: false,
  });

  const handleChange = (value) => {
    onChange(value);
  };

  const handleAssignToMeClick = () => {
    if (loggedInUser?.email && isUserEmailInOptions(loggedInUser?.email)) {
      onChange(fieldName, loggedInUser?.email, true);
    }
  };

  const isUserEmailInOptions = (email) => {
    const emailList = _.flatMap(options, "options").map(
      (option) => option.value
    );

    if (_.includes(emailList, email)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (installationUsers && serviceUsers && itUsers) {
      setOptions((prevOptions) => {
        let _options = [];

        const installOptions = {
          label: "Installations",
          options: installationUsers.map((u) => ({
            label: <UserLabel username={u.name} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(installOptions);

        const serviceOptions = {
          label: "Service",
          options: serviceUsers.map((u) => ({
            label: <UserLabel username={u.name} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(serviceOptions);

        const itOptions = {
          label: "IT",
          options: itUsers.map((u) => ({
            label: <UserLabel username={u.name} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(itOptions);

        return _options;
      });
    }
  }, [installationUsers, serviceUsers, itUsers]);

  return (
    <Form.Item
      label={label}
      name={fieldName}
      labelAlign="left"
      style={{ margin: "0px 0px" }}
      labelCol={
        label
          ? labelPos === "left"
            ? { span: labelSpan }
            : { span: 24 }
          : null
      }
      wrapperCol={
        label
          ? labelPos === "left"
            ? { span: inputSpan }
            : { span: 24 }
          : { span: 24 }
      }
      rules={
        !disabled
          ? [
            {
              required: required,
              //message: `${label} is required`,
            },
          ]
          : null
      }
    >
      <CustomSelect
        mode={isMultiSelect ? "multiple" : ""}
        disabled={
          isLoadingServiceUsers ||
          isFetchingServiceUsers ||
          isLoadingInstallationUsers ||
          isFetchingInstallationUsers ||
          isLoadingITUsers ||
          isFetchingITUsers ||
          disabled
        }
        placeholder={`Select ${label}`}
        showSearch
        value={value ?? ""}
        style={{ width: "90%" }}
        onChange={handleChange}
        size={"small"}
        filterOption={filterOption}
      >
        {options.map((group, groupIndex) => (
          <>
            {!isMultiSelect && (
              <Option
                key={unassignedOption.key}
                value={""}
                label={unassignedOption.label}
              >
                {unassignedOption.label}
              </Option>
            )}
            <OptGroup key={groupIndex} label={group.label}>
              {group.options.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  {option.label}
                </Option>
              ))}
            </OptGroup>
          </>
        ))}
      </CustomSelect>
      {showAssignToMe && !disabled ? (
        <div
          className="text-centraBlue text-xs hover:text-blue-500 hover:underline cursor-pointer flex my-2"
          onClick={handleAssignToMeClick}
        >
          Assign to me
        </div>
      ) : null}
    </Form.Item>
  );
}
