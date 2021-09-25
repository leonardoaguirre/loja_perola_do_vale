export class Costumer {
	id: string;
	pessoaFisica: PessoaFisica;
}

export class PessoaFisica {
	pessoaFisicaId: string;
	nome: string;
	rg: string;
	cpf: string;
	dtNasc: string;
	pessoa: Pessoa;
}

export class Pessoa {
	id: string;
	email: string;
	senha: string
	telefones: Telephone[];
	enderecos: Adress[]
}

export class Telephone {
	id: string;
	ddd: string;
	numero: string
}

export class Adress {
	id: string;
	titulo?: string;
	rua: string;
	numero: string;
	complemento?: string;
	bairro: string;
	cidade: string;
	estado: string;
	cep: string;
}