import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { AuthProvider } from "./context/Context.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_test_key_here");

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </Elements>
);
