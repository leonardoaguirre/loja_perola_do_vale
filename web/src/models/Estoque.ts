
import { Product } from './Product'
import { Provider } from "./Provider"

export class Estoque {
    id: string
    lotes: Lote[]
    quantidadeDisponivel: number
    produto: Product
}
export class Lote {
    id: string
    quantidade: number
    dtCompra: Date
    created_at: Date
    fornecedor: Provider
    estoque: Estoque
}