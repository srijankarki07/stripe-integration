"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
      {token ? (
        <div>
          <p>
            Your customer ID is: <strong>{token}</strong>
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <a href="/">Go back to home</a>
    </div>
  );
};

const SuccessPage = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <SuccessPageContent />
  </Suspense>
);

export default SuccessPage;
