import { consultarCep, calcularPrecoPrazo } from 'correios-brasil';
import { Request, Response } from 'express';

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
        const { cep, peso, comprimento, altura, largura, diametro } = request.body;

        const args = {
            nCdServico: ['04014', '04510'],
            sCepOrigem: '08900000',
            sCepDestino: cep, //sem hifen
            nVlPeso: peso, //O peso deve ser informado em quilogramas(ex : 0.1, 0.4, 1, 2, 4)
            nCdFormato: '1',
            nVlComprimento: comprimento, //Comprimento em centimetros
            nVlAltura: altura, //Altura em centimetros
            nVlLargura: largura, //Largura em centimetros
            nVlDiametro: diametro //Diametro em centimetros

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
export { correiosServices };