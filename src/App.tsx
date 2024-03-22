import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/Landing";
import CouponVerifier from "./pages/CouponVerifier";
import ErrorPage from "./pages/ErrorPage";

import * as ionIcons from "ionicons/icons";

import coin from "../assets/coin.png";

import { addIcons } from "ionicons";
import BinPage from "./pages/Bin";
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
  {
    path: "/bin",
    element: <BinPage />,
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
