import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        className={`z-[99999] `}
        // style={{ zIndex: "999999 !important" }}
        hideProgressBar={true}
        // toastClassName={() => "p- bg-trans"}
        // icon={CustomIcon}
      />
    </Provider>
  </React.StrictMode>,
);
