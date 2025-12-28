import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./features/auth/provider/AuthProvider.jsx";
import {SearchProvider} from "./features/search/context/SearchContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <SearchProvider>
                <App/>
            </SearchProvider>
        </AuthProvider>
    </BrowserRouter>
);
