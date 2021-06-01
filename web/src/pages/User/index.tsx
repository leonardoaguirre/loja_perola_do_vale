import { GetServerSideProps, GetStaticProps } from 'next';
import { route } from 'next/dist/next-server/server/router';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import ProductsTable from '../../components/ProductsTable';
import React, { useState, useContext, useEffect } from 'react';
import UserTable from '../../components/UserTable';
import styles from '../../styles/pages/Products.module.css';
import { UserContext } from '../../contexts/UserContext';
import Cookies from 'js-cookie';

interface ClientTableProps {
    clients: Client[];
}

interface Client {
    id: string,
    pessoaFisica: PessoaFisica,
}

interface PessoaFisica {
    nome: string,
    rg: string,
    cpf: string,
    dtNasc: string,
    pessoa: Pessoa,
}

interface Pessoa {
    email: string,
}
interface PageUserProps {
    pessoas: Client[];
}

const Pageuser: React.FC<PageUserProps> = (props) => {
    const [atribute, setAtribute] = useState('nome');
    const [textSearch, settextSearch] = useState('');
    const [tableItens, setTableItens] = useState(props.pessoas);
    const [erro, setErro] = useState({ constraints: { message: '' } });

    const handleChange = async (event) => {
        setAtribute(event.target.value);
    }

    const reloadTable = async () => {
        const tokenCookie = Cookies.get("tokenCookie");

        const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

        const response = await fetch('http://localhost:3008/Cliente/listar', pessoa);

        setTableItens(await response.json());
    }

    const handleSearch = async (event, atribute: string, search: string) => {
        event.preventDefault();

        if (search.length > 0) {

            const response = await fetch(`http://localhost:3008/Cliente/Buscar/${atribute}/${search}`, { method: 'GET' });

            const result = await response.json();

            if (response.ok) {

                setTableItens(result);
                setErro({ constraints: { message: '' } });

            } else {
                setTableItens([{
                    id: '',
                    pessoaFisica: {
                        nome: '',
                        rg: '',
                        cpf: '',
                        dtNasc: '',
                        pessoa: {
                            email: ''
                        }
                    }

                }]);
                setErro(result);
            }
        } else {
            setErro({ constraints: { message: 'Campo de pesquisa está vazio' } });
        }
    }

    const handleInputSearch = async (event) => {
        settextSearch(event.target.value);
    }

    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.products}>
                <div className={styles.filters}>
                    <select value={atribute} onChange={handleChange}>
                        <option value="nome">Nome</option>
                        <option value="email">Email</option>
                        <option value="cpf">CPF</option>
                    </select>
                    <div className={styles.search}>
                        <input type="search" value={textSearch} onChange={handleInputSearch} placeholder="Digite aqui sua pesquisa..." autoComplete="off" />
                        <button onClick={(event) => { handleSearch(event, atribute, textSearch) }} className={styles.searchButton}>
                            Pesquisar
                        </button>
                        {erro.constraints.message != '' ? erro.constraints.message : ''}
                    </div>
                </div>
                <UserTable clients={tableItens} reload={reloadTable} />
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


export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tokenCookie } = context.req.cookies;

    const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

    const response = await fetch('http://localhost:3008/Cliente/Listar', pessoa);




    if (response.status == 200) {
        const data = await response.json();
        return {
            props: {
                pessoas: data,
            }
        }
    }else if(response.status == 400){
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