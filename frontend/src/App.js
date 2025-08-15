import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import OrderFromTable from "./components/OrderFromTable";
import ContactPage from "./components/ContactPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App min-h-screen bg-slate-900">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/order/:tableId?" element={<OrderFromTable />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #d4af37'
            }
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;