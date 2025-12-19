"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";

import { fetchRemakeWorkOrders, fetchRemakeById } from "app/api/remakeApis";

export default function useRemakes() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const orderIdParam = searchParams.get("orderId");  
  const pageParam = searchParams.get("page") ?? "";

  // This should run automatically based on the params
  const fetchRemakes = async (params, pageParam) => {
    const EXCLUDED_FILTER_KEYS = new Set([
      'page',
      'pageSize',
      'sort',
      'order',
    ]);

    const filters = Object.entries(params)
      .filter(([key, value]) =>
        !EXCLUDED_FILTER_KEYS.has(key) &&
        value !== '' &&
        value !== null &&
        value !== undefined
      )
      .map(([key, value]) => ({
        field: key,
        values: [String(value)], // normalize
        operator: "contains",
      }));

    const payload = {
      ...(filters.length > 0 && { filters }),
      page: pageParam || '1',
      pageSize: 2
    }

    const result = await fetchRemakeWorkOrders(payload);
    /*
    let _statusCountPromises = statusOptions.map(async (_status) => {
      let _count = await fetchStatusCount(_status.value);

      return {
        status: _status.value,
        count: _count,
      };
    });

    // Wait for all promises to resolve
    let _statusCount = await Promise.all(_statusCountPromises);

    // I'm getting count but not from the new DB
    console.log("_statusCount ", _statusCount)

    dispatch(updateStatusCount(_statusCount));
    */
    //dispatch(updateTotal(result.data.totalCount));
    //return result.data.data;

    return result.data;
  };

  const {
    isLoading: isLoadingOrders,
    data: remakes,
    isFetching: isFetchingOrders,
    refetch: refetchOrders,
  } = useQuery([
    "remakes",    
    params,
    pageParam
  ], ({ queryKey }) => {
    const [, params, pageParam] = queryKey;

    return fetchRemakes(params, pageParam);
  }, {
    refetchOnWindowFocus: false,
    enabled: true
  });

  const {
    isLoading: isLoadingRemake,
    data: remake,
    isFetching: isFetchingRemake,
    refetch: refetchRemake,
  } = useQuery([
    "remake",
    orderIdParam
  ], ({ queryKey }) => {
    const [, orderIdParam] = queryKey;

    const payload = {
      filters: [
        {
          field: "RemakeId",
          operator: "=",
          values: [orderIdParam]
        }
      ],
      page: 0,
      pageSize: 0
    }

    return fetchRemakeById(payload);
  }, {
    refetchOnWindowFocus: false,
    enabled: orderIdParam !== null,
    select: (response) => {
      const item = response?.data?.data?.items?.[0];

      if (!item) return null;

      return {
        ...item
        // more properties...
      };
    }     
  });

  return {
    remake,
    remakes,    
    isLoadingOrders,
    isFetchingOrders,
    refetchOrders
  }
}
