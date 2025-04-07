import React, { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import { initializeFlowersData, initializeCategoriesData } from "./firebase/services/productService";
import ChatButton from "./components/ChatButton";

export default function App() {
  useEffect(() => {
    initializeFlowersData();
    initializeCategoriesData();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <ChatButton />
    </>
  );
}
