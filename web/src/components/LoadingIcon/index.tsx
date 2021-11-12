import styles from './styles.module.css';

function LoadingIcon() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}></div>
    </div>
  )
}

export default LoadingIcon;