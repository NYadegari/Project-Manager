import Layout from "../Layout/main/index";
import Error from "../pages/Error";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/index";
import Projects from "../pages/Projects";
import TeamManagment from "../pages/TeamManagment";
import Tasks from "../pages/Tasks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "team/management",
        element: <TeamManagment />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  }
]);