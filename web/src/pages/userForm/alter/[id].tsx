import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import LoadingIcon from '../../../components/LoadingIcon';
import PageFooter from '../../../components/PageFooter';
import PageHeaderAdministration from '../../../components/PageHeaderAdministration';
import styles from '../../../styles/pages/UserForm.module.css';

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
}


const userAlterForm: React.FC<PageClientInfoProps> = (props) => {
    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }

    const [cliente, setCliente] = useState({});
    const [email, setEmail] = useState<string>(props.client.pessoaFisica.pessoa.email);
    const [nome, setNome] = useState<string>(props.client.pessoaFisica.nome);
    const [rg, setRg] = useState<string>(props.client.pessoaFisica.rg);
    const [cpf, setCpf] = useState<string>(props.client.pessoaFisica.cpf);
    const [dtnasc, setDtnasc] = useState<string>(props.client.pessoaFisica.dtNasc);


    const router = useRouter();
    // useEffect(() => {
    //     // Prefetch the dashboard page
    //     router.prefetch(`/userForm/alter/${retorno.id}`)
    // }, [])
    // router.prefetch(`/userForm/${id}`);

    const registerUser = async (event) => {
        event.preventDefault();

        if (props.client.id) {
            await fetch(`http://localhost:3008/Cliente/Alterar/${props.client.id}`, {
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    rg: rg,
                    cpf: cpf,
                    dtNasc: dtnasc
                }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }),
                method: "PATCH",
            })
            router.push('/User');
        }
    }

    // const handleChange = (event) =>{
    //     setCliente({ ...cliente, [event.currentTarget.name]: event.currentTarget.value})
    // }


    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.userForm}>
                <h1>Alterar Pessoa</h1>
                <div className={styles.formContainer}>
                    <form onSubmit={registerUser}>
                        <div className={styles.email}>
                            <label htmlFor="email">Email: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    defaultValue={email}
                                    onChange={event => setEmail(event.target.value)}
                                    autoComplete="off"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    name="senha"
                                    defaultValue="***********"
                                    autoComplete="off"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    name="nome"
                                    defaultValue={nome}
                                    onChange={event => setNome(event.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="number"
                                    placeholder="RG"
                                    name="rg"
                                    defaultValue={rg}
                                    onChange={event => setRg(event.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="number"
                                    placeholder="CPF"
                                    name="cpf"
                                    defaultValue={cpf}
                                    onChange={event => setCpf(event.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="date"
                                    placeholder="Data de nascimento"
                                    name="dtNasc"
                                    defaultValue={dtnasc}
                                    onChange={event => setDtnasc(event.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Alterar" />
                            </div>
                            <div className={styles.reset}>
                                <input type="reset" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <PageFooter />
        </div>
    );
}
// export const getStaticPaths: GetStaticPaths = async (context) => {

//     // const { tokenCookie } = context.req.cookies;

//     // const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

//     // const response = await fetch(`http://localhost:3008/Cliente/Listar`,pessoa);
//     // const data = await response.json();

//     // const paths = data.map(pessoa => {
//     //     return { params: { id: '' } }
//     // });

//     const paths = [{ params: { id: '' } }]
//     return {
//         paths,
//         fallback: true
//     }

// }
// export const getStaticProps: GetStaticProps = async (context) => {
//     const { id } = context.params;


//     const response = await fetch(`http://localhost:3008/Cliente/BuscaPorId/${id}`);
//     const data = await response.json();

//     return {
//         props: {
//             retorno: data,
//         }
//     }
// }
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params;

    const response = await fetch(`http://localhost:3008/cliente/BuscaPorId/${id}`);
    const data = await response.json();

    return {
        props: {
            client: data,
        }
    }
}

export default userAlterForm;