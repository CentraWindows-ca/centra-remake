import { createSlice } from "@reduxjs/toolkit";
import { AppModes } from "app/utils/constants";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    isLoading: true,
    appMode: AppModes.orders,
    drawerOpen: true,
    users: [],
    isMobile: true,
    networkInfo: { ip: "", isTest: false },
    isReadOnly: false,
    userToken: "",
    userData: null,
    hasWritePermission: false,
  },
  reducers: {
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateAppMode: (state, action) => {
      state.appMode = action.payload;
    },
    updateDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
    updateIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    updateNetworkInfo: (state, action) => {
      state.networkInfo = action.payload;
    },
    updateIsReadOnly: (state, action) => {
      state.isReadOnly = action.payload;
    },
    updateUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateHasWritePermission: (state, action) => {
      state.hasWritePermission = action.payload;
    },
  },
});

export const {
  updateIsLoading,
  updateAppMode,
  updateDrawerOpen,
  updateIsMobile,
  updateNetworkInfo,
  updateIsReadOnly,
  updateUserToken,
  updateUserData,
  updateHasWritePermission,
} = appSlice.actions;

export default appSlice.reducer;
