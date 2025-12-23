"use client";
import React, { useEffect } from "react"; 
import { useDispatch } from "react-redux";

import { updateDrawerOpen } from "app/redux/app";

import CreateRemakeHome from "app/features/remake/CreateRemakeHome";

export default function CreateRemakeLanding(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateDrawerOpen(false));
  }, [dispatch]);

  return (
    <div className="bg-white p-4">
      <CreateRemakeHome />
    </div>
  );
}
