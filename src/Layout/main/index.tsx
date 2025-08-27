import styles from "./layout.module.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Outlet /> 
    </div>
  );
};

export default Layout;