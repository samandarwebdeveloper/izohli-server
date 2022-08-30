import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';

function Sidebar({children}) {
    const router = useRouter();
    return (
        <div>
        <div className={styles.sidebar}>
        <div className={styles.sidebar__header}>
            <h2>Izohli lug'at</h2>
        </div>
        <div className={styles.sidebar__body}>
            <ul className={styles.sidebar__list}>
                <li className={router.pathname === '/' ? styles.active : ""}>
                    <Link href="/">Home</Link>
                </li>
                <li className={router.pathname === '/users' ? styles.active : ""}>
                    <Link href="/users">Users</Link>
                </li>
                <li className={router.pathname === '/izoh' ? styles.active : ""}>
                    <Link href="/izoh">Izoh</Link>
                </li>
            </ul>
        </div>
        </div>
        <div className={styles.content}>
            {children}
        </div>
        </div>
    )
}

export default Sidebar;