import type { ActionType, SampleUnit } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ISampleUnitForm {
  name?: string;
  pixel_to_mm_factor?: number;
  distress_type?: string | null;
  severity?: "low" | "medium" | "high" | null;
  pothole_depth?: number;
  note?: string;
  image_file?: FileList;
}

export interface ISampleUnitState {
  action: ActionType;
  sample_unit_id: string | null;
  sample_unit: ISampleUnitForm | null;
  openForm: boolean;
  openDeleModal: boolean;
}

interface PayloadExtended extends SampleUnit {
  action: ActionType;
}

const initialState: ISampleUnitState = {
  action: null,
  sample_unit_id: null,
  sample_unit: null,
  openForm: false,
  openDeleModal: false,
};

const sampleUnitSlice = createSlice({
  name: "sampleUnit",
  initialState,
  reducers: {
    setSelectedSUAction: (state, actionObj: PayloadAction<PayloadExtended>) => {
      state.action = actionObj?.payload?.action;
      state.sample_unit_id = actionObj.payload.id;
      state.sample_unit = {
        name: actionObj?.payload?.name,
        pixel_to_mm_factor: actionObj.payload.pixel_to_mm_factor,
        distress_type: actionObj?.payload.distress_type,
        severity: actionObj?.payload?.severity,
        pothole_depth: actionObj.payload.pothole_depth,
        note: actionObj.payload.note,
      };
    },
    setOpenForm: (state, action: PayloadAction<boolean>) => {
      state.openForm = action.payload;
    },
    setOpenDeleModal: (state, action: PayloadAction<boolean>) => {
      state.openDeleModal = action.payload;
    },
  },
});

export const { setSelectedSUAction, setOpenForm, setOpenDeleModal } =
  sampleUnitSlice.actions;
export default sampleUnitSlice.reducer;
