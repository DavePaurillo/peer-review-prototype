import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
    return (
        <div className="container">
            <AuthProvider>
                <Header />
                <Main />
            </AuthProvider>
        </div>
    );
}
