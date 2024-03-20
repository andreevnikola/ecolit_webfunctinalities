import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/Landing";
import CouponVerifier from "./pages/CouponVerifier";
import ErrorPage from "./pages/ErrorPage";

import * as ionIcons from "ionicons/icons";

import coin from "../assets/coin.png";

import { addIcons } from "ionicons";
addIcons(ionIcons);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/coupon/:couponId/:userId",
    element: <CouponVerifier />,
  },
]);

function App() {
  return (
    <div className="bg-background">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
