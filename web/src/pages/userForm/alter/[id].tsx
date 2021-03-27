import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import LoadingIcon from '../../../components/LoadingIcon';
import PageFooter from '../../../components/PageFooter';
import PageHeaderAdministration from '../../../components/PageHeaderAdministration';
import styles from '../../../styles/pages/UserForm.module.css';

function userAlterForm({ retorno }) {
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

    const registerUser = async event => {
        event.preventDefault();

        if (retorno.id) {
            await fetch('http://localhost:3008/Pessoa/Alterar/' + retorno.id, {
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
            const res = await fetch("http://localhost:3008/Pessoa/Adicionar", {
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
                                <input type="email" placeholder="Email" name="email" defaultValue={retorno.email} />
                            </div>
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input type="password" placeholder="Senha" name="senha" defaultValue="" />
                            </div>
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="nome" defaultValue={retorno.nome} />
                            </div>
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="RG" name="rg" defaultValue={retorno.rg} />
                            </div>
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="CPF" name="cpf" defaultValue={retorno.cpf} />
                            </div>
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input type="date" placeholder="Data de nascimento" name="dtNasc" defaultValue={retorno.dtNasc} />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">DDD: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xx" name="ddd" defaultValue={retorno.telefones[0].ddd} />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">Telefone: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xxxx-xxx" name="numero" defaultValue={retorno.telefones[0].numero} />
                            </div>
                        </div>
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
export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch(`http://localhost:3008/pessoa/Listar`);
    const data = await response.json();



    const paths = data.map(pessoa => {
        return { params: { id: '' } }
    });
    return {
        paths,
        fallback: true
    }

}
export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params;


    const response = await fetch(`http://localhost:3008/pessoa/BuscaPorId/${id}`);
    const data = await response.json();

    return {
        props: {
            retorno: data,
        }
    }
}


export default userAlterForm;