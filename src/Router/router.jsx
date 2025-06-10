import {
  createBrowserRouter,
  
} from "react-router";
import RootLayout from "../Layouts/rootLayout";
import Home from "../pages/Home/home";
import Register from "../pages/Register/Register";
import SignIn from "../pages/SignIN/SignIn";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
        index: true,
        Component: Home
      },
      {
        path: "register",
        Component: Register
      },
     
      {
        path: "signin",
        Component: SignIn
      },
     
    ]
  },
]);

export default router;