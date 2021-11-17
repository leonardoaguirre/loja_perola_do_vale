import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { UserContext } from "../../../contexts/UserContext";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import AccountMenu from "../../../components/AccountMenu";
import Nav from "../../../components/Nav";
import LoadingIcon from "../../../components/LoadingIcon";
import TelephoneCard from "../../../components/TelephoneCard/Card";
import TelephoneCardNew from "../../../components/TelephoneCard/New";
import PostalAdressCard from "../../../components/PostalAdressCard/Card";
import PostalAdressCardNew from "../../../components/PostalAdressCard/New";

import styles from "./styles.module.css";
import { environment } from "../../../environments/environment";

interface PageCostumerAccountProps {
	costumer: Costumer
}

interface Costumer {
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

const UserAccount: React.FC<PageCostumerAccountProps> = (props) => {

	const { isFallback } = useRouter();
	if (isFallback) {
		return <LoadingIcon />;
	}

	const [nome, setNome] = useState<string>(props.costumer?.pessoaFisica.nome);
	const [cpf, setCpf] = useState<string>(props.costumer?.pessoaFisica.cpf);
	const [rg, setRg] = useState<string>(props.costumer?.pessoaFisica.rg);
	const [dtnasc, setDtnasc] = useState<string>(props.costumer?.pessoaFisica.dtNasc);

	const [erro, setErro] = useState<Erro[]>([]);

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

		const response = await fetch(`${environment.API}/Cliente/Alterar/${props.costumer.id}`, cliente)

		const result = await response.json();

		if (response.ok) {
			alert("Usuário alterado com sucesso!")
			setErro([]);
		} else {
			// setErro(result);
			const alerta = result.map(err => Object.values(err.constraints).map((tipoErro, key) => { return tipoErro }));
			alert(alerta)
			{/* {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""} */ }

		}
	}

	return (
		<div className="pageContainer">
			<Header />
			<Nav />
			<div className="pageContent">
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
											defaultValue={props.costumer?.pessoaFisica.nome}
											onChange={event => setNome(event.target.value)}
										/>
									</div>
									{/* {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""} */}
									<div className={styles.inputContainer}>
										<input
											type="number"
											name="rg" autoComplete="off"
											defaultValue={props.costumer?.pessoaFisica.rg}
											onChange={event => setRg(event.target.value)}
										/>
									</div>
									<div className={styles.inputContainer}>
										<input
											type="number"
											name="cpf"
											autoComplete="off"
											defaultValue={props.costumer?.pessoaFisica.cpf}
											onChange={event => setCpf(event.target.value)}
										/>
									</div>
									<div className={styles.inputContainer}>
										<input
											type="date"
											name="dtNasc"
											autoComplete="off"
											defaultValue={props.costumer?.pessoaFisica.dtNasc}
											onChange={event => setDtnasc(event.target.value)}
										/>
									</div>
									<div className={styles.inputContainer}>
										<input
											type="email"
											name="email"
											autoComplete="off"
											value={props.costumer?.pessoaFisica.pessoa.email}
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
								{props.costumer?.pessoaFisica.pessoa.telefones.length > 0
									? props.costumer?.pessoaFisica.pessoa.telefones.map((telephone, index) => {
										return <TelephoneCard telephone={telephone} index={index} key={index} />
									})
									: ''}
								{props.costumer?.pessoaFisica.pessoa.telefones.length < 3
									? <TelephoneCardNew />
									: ''}
							</form>
							<h3>Endereços</h3>
							<form id={styles.postalAdressForm}>
								{props.costumer?.pessoaFisica.pessoa.enderecos.length > 0
									? props.costumer?.pessoaFisica.pessoa.enderecos.map((telephone, index) => {
										return <PostalAdressCard postalAdress={telephone} key={index} />
									})
									: ''}
								{props.costumer?.pessoaFisica.pessoa.enderecos.length < 3
									? <PostalAdressCardNew />
									: ''}
							</form>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { user } = context.req.cookies;
	const userData = JSON.parse(user);

	const response = await fetch(`${environment.API}/cliente/BuscaPorId/${userData.id}`);
	const data = await response.json();

	return {
		props: {
			costumer: data,
		}
	}
}

export default UserAccount;