import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>Contoso Bike Store Chatbot </h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="/" >Chat</a>
                            </li>
                            <li>
                                <a href="/Image" >Image</a>
                            </li>
                            <li>
                                <a href="/Translate" >Translate</a>
                            </li>
                            <li>
                                <a href="/Vision" >Vision</a>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>AI App in 1 Day</h4>
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;
