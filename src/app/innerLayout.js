"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";

import useMediaQuery from "@mui/material/useMediaQuery";

import Sidebar from "app/components/templates/sidebar/sidebar";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import MobileMenu from "app/components/organisms/mobileMenu/mobileMenu";

import { Pages } from "app/utils/constants";

import AuthNav from "@centrawindows-ca/authnav";
import { useAuthData } from "../context/authContext";

import {
  notification,
  Grid,
  Popover,
  ConfigProvider,
  message,
  Drawer,
} from "antd";
const { useBreakpoint } = Grid;

import {
  updateDrawerOpen,
  updateIsMobile,
  updateNetworkInfo,
  updateUserToken,
  updateIsLoading,
} from "../app/redux/app";

import { useCookies } from "react-cookie";

const Context = React.createContext({ name: "Default" });

export default function InnerLayout({ children }) {
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [cookies, setCookie] = useCookies(["c.token"]);
  const [drawerWidth, setDrawerWidth] = useState(320);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [navParams, setNavParams] = useState(null);

  const { drawerOpen, isReadOnly, networkInfo, isMobile, userData, canEdit } =
    useSelector((state) => state.app);

  const { result, showMessage } = useSelector((state) => state.orders);

  const dispatch = useDispatch();
  const router = useRouter();
  const screens = useBreakpoint();
  const searchParams = useSearchParams();

  const { onAuthNavAction } = useAuthData();

  const isTablet = useMediaQuery("(max-width:768px)");
  const pageParam = searchParams.get("page") || Pages.month;

  const MONTH_HEADER_HEIGHT_OFFSET = 200;

  useEffect(() => {
    function updateSize() {
      setCalendarHeight(window.innerHeight - MONTH_HEADER_HEIGHT_OFFSET);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (isTablet) {
      setDrawerWidth(0);
    } else {
      setDrawerWidth(300);
    }
  }, [isTablet, drawerOpen]);

  const showResultPopup = useCallback(
    (result) => {
      if (result?.type == "success") {
        notificationApi.success({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      } else if (result?.type == "error") {
        notificationApi.error({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      } else if (result?.type == "info") {
        notificationApi.info({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      }
    },
    [notificationApi]
  );

  useEffect(() => {
    if (result) {
      showResultPopup(result);
    }
  }, [result, showResultPopup]);

  // useEffect(() => {
  //   let _page = Pages.month;

  //   if (pageParam && !isMobile) {
  //     _page = pageParam;
  //   } else if (isMobile) {
  //     _page = Pages.mobile;
  //   } else {
  //     _page = Pages.month;
  //   }

  //   dispatch(updatePage(_page));
  // }, [dispatch, pageParam, isMobile]);

  useEffect(() => {
    dispatch(updateDrawerOpen(drawerOpen));
  }, [dispatch, drawerOpen]);

  useEffect(() => {
    if (!screens.xl) {
      dispatch(updateDrawerOpen(true));
    }
  }, [dispatch, screens]);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const response = await fetch("api/networkInfo");
        const data = await response.json();

        var _eth =
          data?.networkInfo?.Ethernet ?? data?.networkInfo["Ethernet 2"];
        var _vpn = data?.networkInfo["SonicWall NetExtender"];

        if (_eth) {
          if (_eth?.length > 0) {
            let localIp = _eth[1]?.address;
            if (localIp.includes("192.168.2")) {
              dispatch(updateNetworkInfo({ ip: localIp, isTest: true }));
            }
          }
        } else {
          if (_vpn?.length > 0) {
            let localIp = _vpn[0]?.address;
            if (localIp.includes("192.168.2")) {
              dispatch(updateNetworkInfo({ ip: localIp, isTest: true }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching network information:", error);
      }
    };

    fetchNetworkInfo();
  }, [dispatch]);

  useEffect(() => {
    let _isMobile = false;

    if (screens.xs) {
      _isMobile = true;
    } else if (screens.sm && screens.md && !screens.lg && !screens.xl) {
      _isMobile = true;
    } else if (screens.sm && !screens.md) {
      _isMobile = true;
    } else {
      _isMobile = false;
    }

    dispatch(updateIsMobile(_isMobile));

    if (_isMobile) {
      dispatch(updateIsLoading(false));
    }
  }, [dispatch, screens]);

  useEffect(() => {
    const tokenString = localStorage.getItem("authnav_user");
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString);
      if (tokenObject) {
        dispatch(updateUserToken(tokenObject?.token));
        setCookie("c.token", tokenObject, {
          path: "/",
          expires: new Date(Date.now() + 2592000),
          maxAge: 2592000,
        });
      }
    }
  }, [dispatch, setCookie]);

  useEffect(() => {
    if (showMessage?.value) {
      messageApi.open({
        type: "loading",
        content: showMessage.message,
        duration: 10,
        style: {
          marginTop: "30vh",
        },
      });
    } else {
      messageApi.destroy();
    }
  }, [messageApi, showMessage]);

  const userInfoContent = useCallback(() => {
    return (
      <div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Email:</span>
          <span className="ml-1">{userData.email}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Branch:</span>
          <span className="ml-1">{userData.branch}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">
            Department:
          </span>
          <span className="ml-1">{userData.departments[0]}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Role:</span>
          <span className="ml-1">{userData.roles[0]?.roleName}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">
            Permission:
          </span>
          <span className="ml-1">{canEdit ? "Read-write" : "Read-only"}</span>
        </div>
      </div>
    );
  }, [userData, canEdit]);

  return (
    <div>
      {networkInfo?.isTest && (
        <div className="bg-red-600 h-10 pt-2 pl-2">
          {networkInfo?.isTest && (
            <div className="pl-2 text-white font-bold">
              <i className="fa-solid fa-network-wired pr-2"></i>
              {`${networkInfo?.ip} `}
            </div>
          )}
        </div>
      )}
      {!networkInfo?.isTest && (
        <AuthNav
          options={{
            zIndex: 999,
            onAction: onAuthNavAction,
            onRoute: async (path, params) => {
              await router.push(path);
              setNavParams(params);
              return true;
            },
            appCode: "OM",
          }}
          activeFeature={navParams?.featureKey}
        >
          <div style={{ marginTop: "-3px" }}>
            <Popover
              content={userInfoContent}
              trigger="hover"
              placement="bottom"
            >
              <i className="fa-solid fa-user-gear text-xs"></i>
            </Popover>
            {isReadOnly && (
              <Tooltip title="Ready-only mode">
                <i className="fa-solid fa-lock text-xs ml-3"></i>
              </Tooltip>
            )}
          </div>
        </AuthNav>
      )}
      {messageContextHolder}
      {contextHolder}
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 3,
          },
        }}
      >
        <div
          style={{
            marginLeft: drawerOpen ? 280 : 55,
            transition: "margin-left 0.3s",
          }}
        >
          <Drawer
            title=""
            placement={"left"}
            width={drawerOpen ? 280 : 55}
            onClose={() => dispatch(updateDrawerOpen(false))}
            open={true}
            bodyStyle={{ padding: 0 }}
            mask={false}
            zIndex={1}
            closeIcon={null}
            rootStyle={{ marginTop: "40px" }}
          >
            <Sidebar
              style={
                drawerOpen ? { padding: "0 1rem" } : { padding: "0 0.7rem" }
              }
            />
          </Drawer>
          <div>
            {children}
            {isMobile && <MobileMenu />}
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
}
