import { GetServerSideProps, GetStaticProps } from 'next';
import { route } from 'next/dist/next-server/server/router';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import ProductsTable from '../../components/ProductsTable';
import UserTable from '../../components/UserTable';
import styles from '../../styles/pages/Products.module.css';

function user({ pessoas }) {
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.products}>
                <UserTable users={pessoas} />
                <div className={styles.actionsContainer}>
                    <div className={styles.buttonContainer}>
                        <Link href="/userForm">
                            <button className={styles.createButton}>Cadastrar</button>
                        </Link>
                    </div>
                </div>
            </div>
            <PageFooter />
        </div>
    );
}
export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch('http://localhost:3008/Pessoa/listar');
    if (response.ok) {
        const data = await response.json();
        return {
            props: {
                pessoas: data,
            }
        }
    } else if (response.status == 401) {
        return {
            props: {
                pessoas: null,
            }
        }
    } else {
        return {
            props: {
                pessoas: null,
            }
        }
    }
}
// export const getServerSideProps : GetServerSideProps = withSession(async function ({ req, res }) {
//     // Get the user's session based on the request
//     const user = req.session.get('user')

//     if (!user) {
//       return {
//         redirect: {
//           destination: '/login',
//           permanent: false,
//         },
//       }
//     }

//     return {
//       props: { user },
//     }
//   })
export default user;