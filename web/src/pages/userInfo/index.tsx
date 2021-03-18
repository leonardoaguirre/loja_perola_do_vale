import PageFooter from "../../components/PageFooter";
import PageHeader from "../../components/PageHeader";

import styles from "../../styles/pages/UserInfo.module.css";

function userInfo() {
    return (
        <div className={styles.container}>
            <PageHeader />
            <PageFooter />
        </div>
    )
}

export default userInfo;