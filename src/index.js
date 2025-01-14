import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { AddToHomeScreen } from "react-pwa-add-to-homescreen";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <AddToHomeScreen />
  </>
);
serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
