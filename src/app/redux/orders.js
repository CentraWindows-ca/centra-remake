import { createSlice } from "@reduxjs/toolkit";
import {
  OrderFilters,
  Pages,
  Provinces,
  ProvinceFilter,
  OrderTypes,
} from "app/utils/constants";
import _ from "lodash";

export const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    department: null,
    filterEntry: "",
    filters: [
      ..._.get(
        OrderFilters.find((_filters) => _filters.key === OrderTypes[0].key),
        "values",
        []
      ),
      ProvinceFilter,
    ],
    isFilterClean: true,
    location: Provinces.all,
    page: Pages.month,
    searchEntry: "",
    searchResults: [],
    selectedEvent: null,
    selectedWorkOrderNumber: null,
    showQuickSearch: false,
    tempFiles: [],
    testEvents: [],
    workOrderData: {},
    result: null,
    isReadOnly: false,
    networkInfo: { ip: "", isTest: false },
    stateChangeResult: null,
    isAppLoading: false,
    date: null,
    markedWorkOrderId: null,
    statusView: "",
    pageNumber: 1,
    pageSize: 20,
    total: 0,
    orders: [],
    openModal: false,
    selectedOrderId: 0,
    editMode: false,
    showOrderModal: false,
    moduleName: "",
    showCreateModal: false,
    showAssignModal: false,
    statusCount: [],
    assignedToMe: false,
    assignedToMeCount: 0,
    showMessage: false,
    sort: { sortBy: "ServiceId", isDescending: true },
  },
  reducers: {
    updateViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
    },
    updateOrders: (state, action) => {
      state.orders = action.payload;
    },

    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateFilterEntry: (state, action) => {
      state.filterEntry = action.payload;
    },
    updateSearchEntry: (state, action) => {
      state.searchEntry = action.payload;
      state.isAppLoading = true;
    },
    updateSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    updateDepartment: (state, action) => {
      state.department = action.payload;
    },
    updateSelectedEvent: (state, action) => {
      let _selectedEvent = action.payload;

      if (_selectedEvent?.publicId && !_selectedEvent.id) {
        _selectedEvent.id = _selectedEvent.publicId;
      }
      state.selectedEvent = _selectedEvent;
    },
    updateShowQuickSearch: (state, action) => {
      state.showQuickSearch = action.payload;
    },
    updateTempFiles: (state, action) => {
      state.tempFiles = action.payload;
    },
    updatePage: (state, action) => {
      state.page = action.payload;
    },
    updateWorkOrderData: (state, action) => {
      state.loadingWorkorder = false;
      state.workOrderData = action.payload;
    },
    updateLocation: (state, action) => {
      state.location = action.payload;
    },
    updateResult: (state, action) => {
      state.result = action.payload;
    },
    updateIsReadOnly: (state, action) => {
      state.isReadOnly = action.payload;
    },
    updateNetworkInfo: (state, action) => {
      state.networkInfo = action.payload;
    },
    updateStateChangeResult: (state, action) => {
      state.stateChangeResult = action.payload;
    },
    updateIsLoading: (state, action) => {
      state.isAppLoading = action.payload;
    },
    updateDate: (state, action) => {
      state.date = action.payload;
    },
    updateMarkedWorkOrderId: (state, action) => {
      state.markedWorkOrderId = action.payload;
    },
    updateStatusView: (state, action) => {
      state.statusView = action.payload;
    },
    openCreateModal: (state) => {
      state.selectedOrderId = 0;
      state.editMode = true;
      state.showCreateModal = true;
    },
    openOrderModal: (state, action) => {
      state.selectedOrderId = action.payload.orderId;
      state.editMode = action.payload.isEdit;
      state.showOrderModal = true;
    },
    closeModal: (state) => {
      state.showOrderModal = false;
      state.showCreateModal = false;
    },
    updateModuleName: (state, action) => {
      state.moduleName = action.payload;
    },
    updateSelectedOrderId: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    openAssignModal: (state, action) => {
      state.showAssignModal = true;
    },
    updateStatusCount: (state, action) => {
      state.statusCount = action.payload;
    },
    updatePageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    updatePageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    updateTotal: (state, action) => {
      state.total = action.payload;
    },
    updateAssignedToMe: (state, action) => {
      state.assignedToMe = action.payload;
    },
    updateAssignedToMeCount: (state, action) => {
      state.assignedToMeCount = action.payload;
    },
    updateIsFilterClean: (state, action) => {
      state.isFilterClean = action.payload;
    },
    updateShowMessage: (state, action) => {
      state.showMessage = action.payload;
    },
    updateSortOrder: (state, action) => {
      state.sort = action.payload;
    },
  },
});

export const {
  updateViewMode,
  updateOrders,
  clearEvents,
  createProductionEvents,
  createServiceEvents,
  updateDepartment,
  updateFilters,
  updateFilterEntry,
  updateIsFilterClean,
  updateSearchEntry,
  updateSearchResults,
  updatePage,
  updateSelectedEvent,
  updateWorkOrderData,
  updateDrawerOpen,
  updateShowQuickSearch,
  updateTempFiles,
  updateAnEvent,
  updateLocation,
  updateResult,
  updateIsReadOnly,
  updateNetworkInfo,
  updateStateChangeResult,
  updateIsLoading,
  updateDate,
  updateMarkedWorkOrderId,
  updateStatusView,
  closeModal,
  updateModuleName,
  openCreateModal,
  openOrderModal,
  openAssignModal,
  updateStatusCount,
  updatePageNumber,
  updatePageSize,
  updateTotal,
  updateAssignedToMe,
  updateAssignedToMeCount,
  updateShowMessage,
  updateSortOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
