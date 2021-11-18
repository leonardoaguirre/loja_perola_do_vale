import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';
import { FiPackage } from 'react-icons/fi';

import styles from './styles.module.css';

interface AccountMenuProps {
  pageSelected: 'datas' | 'orders';
}

const AccountMenu: React.FC<AccountMenuProps> = ({
  pageSelected,
}) => {
  return (
    <nav className={styles.accountMenu}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link href="/orders">
            <a className={(pageSelected == 'orders') ? (`${styles.selected}`) : ('')}>
              <div className={styles.iconContainer}>
                <FiPackage />
              </div>
              <strong>Pedidos</strong>
            </a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/myInfo">
            <a className={(pageSelected == 'datas') ? (`${styles.selected}`) : ('')}>
              <div className={styles.iconContainer}>
                <AiOutlineUser />
              </div>
              <strong>Meus dados</strong>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default AccountMenu;