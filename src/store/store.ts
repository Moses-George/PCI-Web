import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import uiSlice from "./slices/uiSlice";
import { networksApi } from "./api/networksApi";
import { sectionsApi } from "./api/sectionsApi";
import { sampleUnitApi } from "./api/sampleUnitApi";
import sampleUnitSlice from "./slices/sampleUnitSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    sampleUnit: sampleUnitSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [networksApi.reducerPath]: networksApi.reducer,
    [sectionsApi.reducerPath]: sectionsApi.reducer,
    [sampleUnitApi.reducerPath]: sampleUnitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      networksApi.middleware,
      sectionsApi.middleware,
      sampleUnitApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
