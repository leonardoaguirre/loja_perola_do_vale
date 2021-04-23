import { GetServerSideProps, GetStaticProps } from 'next';
import { route } from 'next/dist/next-server/server/router';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import ProductsTable from '../../components/ProductsTable';
import React, { useState, useContext } from 'react';
import UserTable from '../../components/UserTable';
import styles from '../../styles/pages/Products.module.css';
import { UserContext } from '../../contexts/UserContext';

function Pageuser({ pessoas }) {
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


export const getServerSideProps : GetServerSideProps = async (context) =>  {
    
    const { tokenCookie } = context.req.cookies;
    
    const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

    const response = await fetch('http://localhost:3008/Pessoa/listar', pessoa);




    if (response.status == 200) {
        const data = await response.json();
        return {
            props: {
                pessoas: data,
            }
        }
    } else {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
}
export default Pageuser;