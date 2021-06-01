import { GetServerSideProps, NextApiResponse } from 'next';
import { route } from 'next/dist/next-server/server/router';
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import LoadingIcon from '../../components/LoadingIcon';
import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import styles from '../../styles/pages/UserForm.module.css';


function userForm() {
    const [erro, setErro] = useState([]);
    const { isFallback } = useRouter();
    const router = useRouter();

    if (isFallback) {
        return <LoadingIcon />;
    }

    const registerUser = async (event) => {
        event.preventDefault();

        const pessoa = {
            body: JSON.stringify({
                nome: event.target.nome.value,
                email: event.target.email.value,
                senha : event.target.senha.value,
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
        };
        await fetch("http://localhost:3008/Cliente/Adicionar", pessoa)
            .then(async (res) => {
                if (res.ok) {
                    router.push('/');
                } else {
                    const erro = await res.json()
                    console.log(erro);

                    setErro(erro);
                }
            })
    }

    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.userForm}>
                <h1>Cadastrar-se</h1>
                {process.env.API_ADRESS}
                <div className={styles.formContainer}>
                    <form onSubmit={registerUser}>
                        <div className={styles.email}>
                            <label htmlFor="email">Email: </label>
                            <div className={styles.inputContainer}>
                                <input type="email" placeholder="Email" name="email" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "email" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input type="password" placeholder="Senha" name="senha" />
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "senha" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="nome" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="RG" name="rg" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "rg" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="CPF" name="cpf" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "cpf" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input type="date" placeholder="Data de nascimento" name="dtNasc" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "dtNasc" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">DDD: </label>
                            <div className={styles.inputContainer}>
                                <input type="tel" name="ddd" id="" size={2} placeholder="xx" maxLength={2} minLength={2} pattern="(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "ddd" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">Telefone: </label>
                            <div className={styles.inputContainer}>
                                <input type="tel" placeholder="xxxxxxxxx" size={9} name="numero" maxLength={9} minLength={8} pattern="(?:[2-8]|9[1-9])[0-9]{3}\[0-9]{4}$" autoComplete="off" required/>
                            </div>
                            {erro.length>0 ? erro.map((err)=> err.property === "numero" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""}
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Cadastrar" />
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

// export async function getServerSideProps() {
//     // const res = await fetch("http://localhost:3008/Pessoa/Adicionar", context);
//     // const response = res.json();

//     // console.log("getServerSideProps");
//     // if (res.status === 400) {
//     //     // const res = JSON.parse(res)

//     //     return {
//     //         props: { retorno: response },
//     //     }
//     // }
    // return {
    //     props: {
    //     },
    // };
// }
// export const getStaticProps: GetStaticProps = async () => {
//     const router = useRouter()
//     const { idpessoa } = router.query

//     const response = await fetch('http://localhost:3008/pessoa/BuscaPorId/' + idpessoa);
//     const data = await response.json();
//     return {
//         props: {
//             retorno: data,
//         }
//     }
// }


export default userForm;