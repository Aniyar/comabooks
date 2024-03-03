import { configureStore } from "@reduxjs/toolkit";
import { answersSlice } from "slicers/answers_slice";
import { pageSlice } from "slicers/page_slicer";
import { previewSlicer } from "slicers/preview_slicer";

import { templateSlice } from "slicers/templates/template_slice";

export const store = configureStore({
  reducer: {
    activeAnswers: answersSlice.reducer,
    templates: templateSlice.reducer,
    page: pageSlice.reducer,
    preview: previewSlicer.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
