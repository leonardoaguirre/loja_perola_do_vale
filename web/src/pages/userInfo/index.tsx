import PageFooter from "../../components/PageFooter";
import PageHeader from "../../components/PageHeader";
import AccountMenu from "../../components/AccountMenu";

import styles from "../../styles/pages/UserInfo.module.css";
import SubHeader from "../../components/SubHeader";
import TelephoneCard from "../../components/TelephoneCard";
import TelephoneCardNew from "../../components/TelephoneCardNew";
import PostalAdressCard from "../../components/PostalAdressCard";
import { GetServerSideProps, GetStaticProps } from "next";
import PostalAdressCardNew from "../../components/PostalAdressCardNew";
import { FormEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import Cookies from "js-cookie";
import LoadingIcon from "../../components/LoadingIcon";
import { useRouter } from "next/router";

interface PageClientInfoProps {
    client: Client
}

interface Client {
    id: string,
    pessoaFisica: PessoaFisica,
}

interface PessoaFisica {
    pessoaFisicaId: string,
    nome: string,
    rg: string,
    cpf: string,
    dtNasc: string,
    pessoa: Pessoa,
}

interface Pessoa {
    id: string,
    email: string,
    senha: string
    telefones: Telephone[],
    enderecos: Adress[]
}

interface Telephone {
    id: string,
    ddd: string,
    numero: string
}

interface Adress {
    id: string,
    titulo?: string,
    rua: string,
    numero: string,
    complemento?: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string
}

interface Erro {
    constraints: {};
    property: string;
}

const userInfo: React.FC<PageClientInfoProps> = (props) => {

    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }

    const [nome, setNome] = useState<string>(props.client.pessoaFisica.nome);
    const [cpf, setCpf] = useState<string>(props.client.pessoaFisica.cpf);
    const [rg, setRg] = useState<string>(props.client.pessoaFisica.rg);
    const [dtnasc, setDtnasc] = useState<string>(props.client.pessoaFisica.dtNasc);

    const [erro, setErro] = useState<Erro[]>([]);

    useEffect(() => {

    }, [])



    const handleSubmitForm = async (event) => {
        event.preventDefault();



        const cliente = {
            body: JSON.stringify({
                nome: nome,
                dtNasc: dtnasc,
                cpf: cpf,
                rg: rg
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: "PATCH",
        };

        const response = await fetch(`http://localhost:3008/Cliente/Alterar/${props.client.id}`, cliente)

        const result = await response.json();

        if (response.ok) {
            alert("Usuário alterado com sucesso!")
            setErro([]);
        } else {
            // setErro(result);
            const alerta = result.map(err => Object.values(err.constraints).map((tipoErro,key)=> {return tipoErro}));
            alert(alerta)
            {/* {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""} */ }

        }
    }

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
                            <form id={styles.userForm} onSubmit={handleSubmitForm}>
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
                                        <input
                                            type="text"
                                            name="nome"
                                            autoComplete="off"
                                            defaultValue={props.client.pessoaFisica.nome}
                                            onChange={event => setNome(event.target.value)}
                                        />
                                    </div>
                                    {/* {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""} */}
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="number"
                                            name="rg" autoComplete="off"
                                            defaultValue={props.client.pessoaFisica.rg}
                                            onChange={event => setRg(event.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="number"
                                            name="cpf"
                                            autoComplete="off"
                                            defaultValue={props.client.pessoaFisica.cpf}
                                            onChange={event => setCpf(event.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="date"
                                            name="dtNasc"
                                            autoComplete="off"
                                            defaultValue={props.client.pessoaFisica.dtNasc}
                                            onChange={event => setDtnasc(event.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            value={props.client.pessoaFisica.pessoa.email}
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="password"
                                            name="senha"
                                            autoComplete="off"
                                            value="***********"
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.actions}>
                                        <input type="submit" value="Alterar" />
                                    </div>
                                </div>

                            </form>
                            <h3>Telefones</h3>
                            <form id={styles.telephoneForm}>
                                {props.client.pessoaFisica.pessoa.telefones.length > 0
                                    ? props.client.pessoaFisica.pessoa.telefones.map((telephone, index) => {
                                        return <TelephoneCard telephone={telephone} index={index} key={index} />
                                    })
                                    : ''}
                                {props.client.pessoaFisica.pessoa.telefones.length < 3
                                    ? <TelephoneCardNew />
                                    : ''}
                            </form>
                            <h3>Endereços</h3>
                            <form id={styles.postalAdressForm}>
                                {props.client.pessoaFisica.pessoa.enderecos.length > 0
                                    ? props.client.pessoaFisica.pessoa.enderecos.map((telephone, index) => {
                                        return <PostalAdressCard postalAdress={telephone} index={index} key={index} />
                                    })
                                    : ''}
                                {props.client.pessoaFisica.pessoa.enderecos.length < 3
                                    ? <PostalAdressCardNew />
                                    : ''}
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
    const { userIdCookie } = context.req.cookies;

    const response = await fetch(`http://localhost:3008/cliente/BuscaPorId/${userIdCookie}`);
    const data = await response.json();

    return {
        props: {
            client: data,
        }
    }
}

export default userInfo;