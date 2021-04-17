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
    const {user} = useContext(UserContext);
    
    const token = localStorage.getItem('@userToken');
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


export const getStaticProps : GetStaticProps = async (context) =>  {

    const pessoa = { headers: { 'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmNWNmZDIwLTNlMmMtNGQzYi1hNmQ1LTc1YTVhOTc2ZDllNCIsImlhdCI6MTYxODYxNTM2NiwiZXhwIjoxNjE5MjIwMTY2fQ.FezUcx7suuQDKwVApd7uHVj5oHvvsTqA2r6fyMStJ0g' }, method: "GET" };
    const response = await fetch('http://localhost:3008/Pessoa/listar', pessoa);

    console.log(response);


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
                destination: '/',
                permanent: false,
            },
        }
    }
}
export default Pageuser;