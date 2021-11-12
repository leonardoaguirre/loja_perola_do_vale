import styles from './styles.module.css';

function LoadingIcon() {
  return (
    <div className="pageContainer">
      <div className={styles.loading}></div>
    </div>
  )
}

export default LoadingIcon;