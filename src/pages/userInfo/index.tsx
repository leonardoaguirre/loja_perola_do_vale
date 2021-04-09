import PageFooter from "../../components/PageFooter";
import PageHeader from "../../components/PageHeader";
import AccountMenu from "../../components/AccountMenu";

import styles from "../../styles/pages/UserInfo.module.css";

function userInfo() {
    return (
        <div className={styles.container}>
            <PageHeader />
            <AccountMenu />
            <PageFooter />
        </div>
    )
}

export default userInfo;