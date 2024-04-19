// I converted the solution folder to TypeScript to ensure type safety and to take advantage of TypeScript's features.
// It is a great way to catch errors early like typos and missing properties. It also offers better tooling for developers.

// Additionally, I decided to utilize FluentUI components to ensure styling consistency, accessibility, and responsiveness.
// FluentUI is Microsoft's design system so it made sense to use that here since this is an assessment for a position at Microsoft.

// Because the task was to create a form component and not a fully fledged application, I decided to keep the form component
// simple and not use any state management libraries like React Context, MobX, or Redux.

import "./index.css";

import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
