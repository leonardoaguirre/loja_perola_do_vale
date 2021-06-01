import styles from '../styles/components/LoadingIcon.module.css';

function LoadingIcon() {
    return (
        <div className={styles.container}>
            <div className={styles.loading}></div>
        </div>
    )
}

export default LoadingIcon;