import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./app.scss";
import { LocaleContainer } from "./hooks/locale-hook";
import { Layout } from "./pages/layout";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LocaleContainer.Provider>
          <Router>
            <Layout />
          </Router>
        </LocaleContainer.Provider>
      </header>
    </div>
  );
}
