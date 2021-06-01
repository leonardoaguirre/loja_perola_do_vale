import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
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

    const router = useRouter();
    // useEffect(() => {
    //     // Prefetch the dashboard page
    //     router.prefetch(`/userForm/alter/${retorno.id}`)
    // }, [])
    // router.prefetch(`/userForm/${id}`);

    const registerUser = async (event) => {
        event.preventDefault();

        if (props.client.id) {
            await fetch('http://localhost:3008/Cliente/Alterar/' + props.client.id, {
                body: JSON.stringify({
                    nome: event.target.nome.value,
                    email: event.target.email.value,
                    rg: event.target.rg.value,
                    cpf: event.target.cpf.value,
                    dtNasc: event.target.dtNasc.value,
                    telefones: [{
                        ddd: event.target.ddd.value,
                        numero: event.target.numero.value
                    }]
                }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }),
                method: "PATCH",
            })
            router.push('/User');
        } else {
            const res = await fetch("http://localhost:3008/Cliente/Adicionar", {
                body: JSON.stringify({
                    nome: event.target.nome.value,
                    email: event.target.email.value,
                    rg: event.target.rg.value,
                    cpf: event.target.cpf.value,
                    dtNasc: event.target.dtNasc.value,
                    telefones: [{
                        ddd: event.target.ddd.value,
                        numero: event.target.numero.value
                    }]
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: "post",
            })

            const result = await res.json();
            // result.user => 'Ada Lovelace'
            console.log(result);
            return {
                props: { retorno: result, },
            }
        }

    }
   const handleChange = (event) =>{
        // this.setState({value: event.target.value});
      }

 
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
                                <input type="email" placeholder="Email" name="email" defaultValue={props.client.pessoaFisica.pessoa.email} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input type="password" placeholder="Senha" name="senha" defaultValue="***********" disabled/>
                            </div>
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="nome" defaultValue={props.client.pessoaFisica.nome} />
                            </div>
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="RG" name="rg" defaultValue={props.client.pessoaFisica.rg} />
                            </div>
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="CPF" name="cpf" defaultValue={props.client.pessoaFisica.cpf} />
                            </div>
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input type="date" placeholder="Data de nascimento" name="dtNasc" defaultValue={props.client.pessoaFisica.dtNasc} />
                            </div>
                        </div>
                        {/* <div className={styles.telephone}>
                            <label htmlFor="telephone">DDD: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xx" name="ddd" defaultValue={retorno.telefones[0].ddd} autoComplete="off" />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">Telefone: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xxxx-xxx" name="numero" defaultValue={retorno.telefones[0].numero} autoComplete="off" />
                            </div>
                        </div> */}
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Alterar" />
                                {/* <p>{retorno}</p> */}
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