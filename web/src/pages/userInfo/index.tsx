import PageFooter from "../../components/PageFooter";
import PageHeader from "../../components/PageHeader";
import AccountMenu from "../../components/AccountMenu";

import styles from "../../styles/pages/UserInfo.module.css";
import SubHeader from "../../components/SubHeader";
import TelephoneCard from "../../components/TelephoneCard";
import TelephoneCardNew from "../../components/TelephoneCardNew";
import PostalAdressCard from "../../components/PostalAdressCard";
import { GetServerSideProps } from "next";
import PostalAdressCardNew from "../../components/PostalAdressCardNew";

interface PageUserInfoProps {
    user: User
}

interface User {
    id: string,
    nome: string,
    rg: string,
    cpf: string,
    dtNasc: string,
    email: string,
    senha: string
    telefones: Telephone[],
    enderecos: Adress[]
}

interface Telephone {
    titulo?: string,
    ddd: string,
    numero: string
}

interface Adress {
    titulo?: string,
    rua: string,
    numero: string,
    complemento?: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string
}

const userTeste: User = {
    "id": "2f6fac4d-d9f3-44d7-b460-a67ebcddfbc7",
    "nome": "hideki yamakawa",
    "rg": "437744556",
    "cpf": "13335678810",
    "dtNasc": "2000-04-06",
    "email": "agdfgsg@gmail.com",
    "senha": "12345678",
    "telefones": [
        {
            "ddd": "11",
            "numero": "91234578"
        },
        {
            "ddd": "11",
            "numero": "93214567"
        }
    ],
    "enderecos": [
        {
            "rua": 'Rua Adalberto Roberto da Silva',
            "numero": '23',
            "complemento": 'Padaria Pão Feliz',
            "bairro": 'Centro',
            "cidade": 'Mogi das Cruzes',
            "estado": 'São Paulo',
            "cep": '08024200'
        }
    ]
}

const userInfo: React.FC<PageUserInfoProps> = (props) => {

    return (
        <div className={styles.container}>
            <PageHeader />
            <SubHeader />
            <div className={styles.userInfo}>
                <div className={styles.pageTitle}>
                    <h1>Minha Conta</h1>
                </div>
                <div className={styles.content}>
                    <div className={styles.leftContent}>
                        <AccountMenu />
                    </div>
                    <div className={styles.rightContent}>
                        <header>
                            <h2>Meus Dados</h2>
                        </header>
                        <div className={styles.formContainer}>
                            <form id={styles.userForm}>
                                <div className={styles.labels}>
                                    <div className={styles.name}>
                                        <label htmlFor="name">Nome </label>
                                    </div>
                                    <div className={styles.identificationRg}>
                                        <label htmlFor="rg">RG </label>
                                    </div>
                                    <div className={styles.identificationCpf}>
                                        <label htmlFor="cpf">CPF </label>
                                    </div>
                                    <div className={styles.birthDate}>
                                        <label htmlFor="dataNascimento">Data de nascimento </label>
                                    </div>
                                    <div className={styles.email}>
                                        <label htmlFor="email">Email </label>
                                    </div>
                                    <div className={styles.password}>
                                        <label htmlFor="password">Senha </label>
                                    </div>
                                </div>
                                <div className={styles.inputs}>
                                    <div className={styles.inputContainer}>
                                        <input type="text" name="nome" value={props.user.nome} disabled />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input type="number" name="rg" value={props.user.rg} disabled />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input type="number" name="cpf" value={props.user.cpf} disabled />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input type="date" name="dtNasc" value={props.user.dtNasc} disabled />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input type="email" name="email" value={props.user.email} disabled />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input type="password" name="senha" value={props.user.senha} disabled />
                                    </div>
                                </div>
                            </form>
                            <h3>Telefones</h3>
                            <form id={styles.telephoneForm}>
                                {props.user.telefones.map((telephone, index) => {
                                    return <TelephoneCard telephone={telephone} key={index}/>
                                })}
                                <TelephoneCardNew />
                            </form>
                            <h3>Endereços</h3>
                            <form id={styles.postalAdressForm}>
                                {props.user.enderecos.map((adress, index) => {
                                    return <PostalAdressCard postalAdress={adress} key={index}/>
                                })}
                                <PostalAdressCardNew />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <PageFooter />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return(
        {
            props: {
                user: userTeste
            }
        }
    )
}

export default userInfo;