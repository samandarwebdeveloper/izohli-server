import styles from '../styles/Modal.module.css';

function AddModal({ setAddModalOpen, children }) {

    const handleClose = (e) => {
        if(e.target.className === styles.modal || e.target.className === styles.modal__close) {
            setAddModalOpen(false);
        }
    }
    return (
        <div className={styles.modal} onMouseDown={handleClose}>
            <div className={styles.modal__body}>
                <div className={styles.modal__box} >
                    <div className={styles.modal__header}>
                        <h2>Add word</h2>
                        <button className={styles.modal__close} onClick={handleClose}>&times;</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AddModal;