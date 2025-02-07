"use client";
import styles from "./home.module.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Typography, Progress, Spin } from "antd";
const { Text } = Typography;

// -- Utils
import { useCookies } from "react-cookie";

export default function Home() {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["options"]);

  const router = useRouter();

  useEffect(() => {
    // Directly navigate to the "/service" route
    router.push("/remake");
  }, []);

  return <></>;
}
