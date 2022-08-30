import styles from '../styles/Layout.module.css';
import Sidebar from "./Sidebar"
import Footer from "./Footer";

function Layout({children}) {
    return (
        <div>
            <Sidebar />
            <div className={styles.content}>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout;