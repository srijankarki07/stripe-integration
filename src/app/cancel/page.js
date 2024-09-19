"use client";
import React from "react";

const CancelPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Payment Canceled</h1>
      <p>Your payment was not completed.</p>

      <p>
        <a href="/">Go back to home</a>
      </p>
    </div>
  );
};

export default CancelPage;
