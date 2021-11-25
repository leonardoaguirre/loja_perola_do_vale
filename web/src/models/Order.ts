import { Adress, Costumer } from "./Costumer";
import { Product } from "./Product";

export class Order{
    id: string;
    status: string;
    subtotal: number;
    valorFrete: number;
    valorTotal: number;
    codRastreio: string;
    dtCompra: Date;
    updated_at: Date;
    destino: Adress;
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