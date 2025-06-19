"use client";
import styles from '../productionWorkorder.module.css';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { generateEmptyTableMessage, mapGlassRowStateToKey, YMDDateFormat } from "app/utils/utils";

import { useQuery } from "react-query";

import { fetchGlassItems } from 'app/api/productionApis';

import { Table } from 'antd';

import { getTableColumns } from "../utils/productionUtils";

export default function GlassItems(props) {
  const { workOrderNumber, parentState } = props;

  const {
    glassItems,
    setGlassItems
  } = parentState;

  const { isMobile } = useSelector(state => { return { ...state.calendar, ...state.app } });

  const { isFetching,
    data: glassItemsData,
    refetch } = useQuery("glassItems", () => {
      if (workOrderNumber) {
        return fetchGlassItems(workOrderNumber)
      }
    });

  useEffect(() => {
    if (glassItemsData?.data) {
      const getStatus = (glassItem) => {
        let result = "Not Ordered";

        if (glassItem?.qty === glassItem?.glassQty) {
          result = "Received";
        } else if (glassItem?.orderDate) {
          result = "Ordered";
        }

        return result;
      }

      setGlassItems(x => {
        let _glassItems = [...glassItemsData.data];

        _glassItems?.forEach((g) => {
          g.status = getStatus(g);
          g.receivedExpected = `${g.qty} / ${g.glassQty}`;
          g.shipDate = YMDDateFormat(g.shipDate);
          g.orderDate = YMDDateFormat(g.orderDate);
        });

        return _glassItems;
      });
    }
  }, [glassItemsData, setGlassItems]);

  return (
    <div style={{ paddingTop: "1rem" }}>
      {glassItems?.length > 0 ?
        <>
          <Table
            columns={getTableColumns(isMobile ? "glassVertical" : "glass", glassItems)}
            dataSource={glassItems}
            pagination={false}
            bordered={false}
          />
        </>
        :
        <div className="pl-6 pt-4 pb-6 text-red-800">*This order does not contain any Glass.</div>
      }
    </div>)
}