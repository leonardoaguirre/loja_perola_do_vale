import { consultarCep, calcularPrecoPrazo } from 'correios-brasil';
import { Request, Response } from 'express';
import { Produto } from '../models/Produto'

class correiosServices {
    async consultaCep(request: Request, response: Response) {
        const cep = request.params.cep;

        await consultarCep(cep)
            .then(result => {
                return response.status(200).json(result);
            })
            .catch(error => {
                return response.status(400).json(error);
            });
    }
    async calculaFrete(request: Request, response: Response) {
        // const { cep, peso, comprimento, altura, largura, diametro } = request.body;
        const produtos: Produto[] = request.body.produtos
        const { cep } = request.body

        console.log(produtos);
        
        const calculos = await Calculos.calcularCmCubico(produtos)
        
        
        const args = {
            nCdServico: ['04014', '04510'],
            sCepOrigem: '08900000',
            sCepDestino: cep, //sem hifen
            nVlPeso: calculos.pesoAcumulado < 0.3 ? '0.3' : calculos.pesoAcumulado.toString(), //O peso deve ser informado em quilogramas(ex : 0.1, 0.4, 1, 2, 4)
            nCdFormato: '1',
            nVlComprimento: calculos.raizCubica < 16 ? '16' : calculos.raizCubica.toString(), //Comprimento em centimetros
            nVlAltura: calculos.raizCubica < 2 ? '2' : calculos.raizCubica.toString(), //Altura em centimetros
            nVlLargura: calculos.raizCubica < 11 ? '11' : calculos.raizCubica.toString(), //Largura em centimetros
            nVlDiametro: '0' //Diametro em centimetros

            // Range de aceitacao de entradas da API dos correios
            // Comprimento(C): 16 cm – 105 cm
            // Largura(L): 11 cm – 105 cm
            // Altura(A): 2 cm – 105 cm
            // Soma das dimensões(C+ L + A): 29 cm – 200 cm
        };
        await calcularPrecoPrazo(args)
            .then(result => {
                return response.status(200).json(result);
            })
            .catch(error => {
                return response.status(400).json(error);
            });
    }

}
class Calculos {
    static async calcularCmCubico(prods: Produto[]) {
        let cmCubicoAcumulado: number = 0;//inicializa variaveis
        let pesoAcumulado: number = 0;

        for (const p of prods) {
            cmCubicoAcumulado += p.altura*p.largura * p.comprimento * p.quantidade//calcula e soma os centimetros cubicos dos produtos
            pesoAcumulado += p.peso*p.quantidade//soma o peso dos  produtos
        }

        // calcula raiz cubica da soma de centimetros cubicos e adiciona 20% de margem fixado em 2 casas decimais
        const raizCubica = parseFloat((Math.pow(cmCubicoAcumulado, 1 / 3) * 1.2).toFixed(2))
        
        return { raizCubica, pesoAcumulado }
    }
}

export { correiosServices };