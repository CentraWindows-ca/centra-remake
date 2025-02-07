"use client";
import React from "react";

import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from "antd";
const { Text } = Typography;
export default function LoadingIndicator() {

    return (
      <div className="flex flex-row text-gray-400">
        <div style={{ marginTop: "-3px" }}><LoadingOutlined spin className="mr-2" /></div>
        <div className="text-sm">
          <Text type="secondary">Loading...</Text>
        </div>
      </div>
    )
}