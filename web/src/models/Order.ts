import { Costumer } from './Costumer';
import { PostalAdress } from './PostalAdress';
import { Product } from './Product';

export class Order {
    id: string;
    status: string;
    subtotal: number;
    valorFrete: number;
    valorTotal: number;
    codRastreio: string;
    dtCompra: Date;
    updated_at: Date;
    destino: PostalAdress;
    pessoa: Costumer;
    itensVenda: OrderItem[]
}

class OrderItem {
    id?: string;
    produto: Product
    valorUnit: number;
    valorSubTotal: number;
    quantidade: number;
}