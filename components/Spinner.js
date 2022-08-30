import styles from '../styles/Spinner.module.css';

function Spinner() {
    return (
        <div className={styles.spinner}>
            <div className={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Spinner;