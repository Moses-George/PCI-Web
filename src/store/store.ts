import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import uiSlice from "./slices/uiSlice";
import { networksApi } from "./api/networksApi";
import { sectionsApi } from "./api/sectionsApi";
import { sampleUnitApi } from "./api/sampleUnitApi";
import sampleUnitSlice from "./slices/sampleUnitSlice";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { detectionApi } from "./api/detectionApi";
import { analyticsApi } from "./api/analyticsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiSlice,
    sampleUnit: sampleUnitSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [networksApi.reducerPath]: networksApi.reducer,
    [sectionsApi.reducerPath]: sectionsApi.reducer,
    [sampleUnitApi.reducerPath]: sampleUnitApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [detectionApi.reducerPath]: detectionApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      networksApi.middleware,
      sectionsApi.middleware,
      sampleUnitApi.middleware,
      authApi.middleware,
      detectionApi.middleware,
      analyticsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
