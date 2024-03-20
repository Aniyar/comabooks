import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Forms from "./routes/Forms";
import Home from "./routes/Home";
import axios from "axios";
import { serviceOptions } from "generated";
import { Provider } from "react-redux"; // Импорт Provider
import { store } from "./store"; // Импорт store
import FormTemplate from "routes/FormTemplate";

import { CoverPage } from "routes/CoverPage";
import { TokenChecker } from "token_wrapper";
import AddPhoto from "components/AddPhoto";
// import AddPhoto from "components/AddPhoto";

export const instance = axios.create({
  baseURL: "https://api.comabooks.org",
});

serviceOptions.axios = instance;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/forms/:id" element={<FormTemplate />} />
        <Route path="/addphoto/:templateId" element={<AddPhoto />} />
        <Route path="/addphoto/:templateId/:photoId" element={<AddPhoto />} />
        <Route path="/cover/:id" element={<CoverPage />}></Route>
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
