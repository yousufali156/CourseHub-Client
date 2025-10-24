import {
  createBrowserRouter,
  
} from "react-router";
import RootLayout from "../Layouts/rootLayout";
import Home from "../pages/Home/home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";


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
        path: "login",
        Component: Login
      },
     
    ]
  },
]);

export default router;

