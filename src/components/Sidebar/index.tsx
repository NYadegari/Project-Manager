import { FaTasks } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FiUserCheck } from "react-icons/fi";
import styles from "./Sidebar.module.scss"
import { FaRegBell } from "react-icons/fa6";
import { useAuth } from "../../context/Authentication";
import { NavLink, Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { useAppSelector } from "../../redux/hooks";
import { selectAllTasks } from "../../redux/slices/taskSlice";
import { useState } from "react";
import ToastNotification from "../ToastNotification";


const Sidebar = () => {

    const { auth } = useAuth();
    const tasks = useAppSelector(selectAllTasks);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeToasts, setActiveToasts] = useState<{id: string, message: string}[]>([]);

    const handleShowNotifications = () => {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingTasks = tasks.filter(task => {
            if (!task.deadline) return false;
            const taskDeadline = new Date(task.deadline);
            return taskDeadline > now && taskDeadline <= oneWeekFromNow;
        });

        const newToasts = upcomingTasks.map(task => ({
            id: task.id,
            message: `Task "${task.description}" due on ${new Date(task.deadline).toLocaleDateString()}`
        }));

        setActiveToasts(newToasts);
        setShowNotifications(true);

        setTimeout(() => {
        setShowNotifications(false);
        setActiveToasts([]);
        }, 5000);
    };

  return (
    <div className={styles.sidebar}>
        <div className={styles.appNameIcon}>
            <FaTasks size={35} color="#1abc9c"/>
            <p>Trellis</p> 
        </div>
        <div className={styles.line}></div>
        <div className={styles.profile}>
            <div>{auth ?  <FiUserCheck size={35} color="#e67e22"/> :  <FaCircleUser size={35} color="#e67e22"/>}</div>
            <p className={styles.name}>{auth ? auth.user.name : "Unknown"}</p>
        </div>
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <RxDashboard size={25}/>
                    <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-white" : "text-gray-300 font-medium"
                    }
                    >
                    DashBoard
                    </NavLink>
                </li>
                <li>
                    <IoCodeWorkingOutline size={25}/>
                    <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-white" : "text-gray-300 font-medium"
                    }
                    >
                    Projects
                    </NavLink>
                </li>
                <li>
                    <MdAddTask size={25}/>
                    <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-white" : "text-gray-300 font-medium"
                    }
                    >
                    Tasks
                    </NavLink>
                </li>
                <li>
                    <RiTeamLine size={25}/>
                    <NavLink
                    to="team/management"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-white" : "text-gray-300 font-medium"
                    }
                    >
                    Team Managment
                    </NavLink>
                </li>
                <li className={styles.notif} onClick={handleShowNotifications}>
                    <FaRegBell size={25}/>
                    <p
                    className={styles.notifText}
                    >
                    Show Notifications
                    </p>
                </li>
            </ul>
        </nav>
        {showNotifications && (
            <div className={styles.toastContainer}>
                {activeToasts.map((toast, index) => (
                    <ToastNotification
                        key={toast.id}
                        message={toast.message}
                        index={index}
                    />
                ))}
            </div>
        )}
        <div className={styles.navIcons}>
        {auth ? 
          <Link to="/login">
            <button className={styles.LogOutbtn}>LogOut</button>
          </Link>
        : (
          <Link to="/login">
            <button className={styles.loginBtn}>SignUp</button>
          </Link>
        )}
        </div>
    </div>
  )
}

export default Sidebar