import { Pagination } from 'react-bootstrap'
import styles from '../../components/PaginationBar/styles.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

interface PaginationBarProps {
    nPages: number;
    search: string;
    destination: string;
    activePage: number
}

const PaginationBar: React.FC<PaginationBarProps> = (props) => {
    const [activeItem, setActiveItem] = useState<number>(props.activePage)
    const router = useRouter();

    const numeration = () => {
        const items = [] //inicializa vetor de pagination
        const showItens = 2 //atribui o numero de itens a serem exibidos ao lado esquerdo e direito do item atual

        // 
        const index = props.nPages > ((showItens * 2) + 1) && activeItem > showItens + 1 ? activeItem - showItens : 1

        if (index > 1) items.push(<Pagination.Ellipsis />) //atribui (...) quando o index sai fora do alcance de showItens

        for (let i = index; i <= index + (showItens * 2) && i <= props.nPages; i++) {
            items.push(
                <Pagination.Item key={i}
                    active={i == activeItem}
                    onClick={() => onClickPaginationItem(i)}>
                    {i}
                </Pagination.Item>
            )
        }
        if (index + (showItens * 2) < props.nPages) items.push(<Pagination.Ellipsis />)//atribui (...) quando o index chega proximo da pagina final

        return items
    }

    const onClickPaginationItem = (nPag: number) => {
        setActiveItem(nPag)
        router.push(`/${props.destination}/${props.search}?pagina=${nPag}`);
    }

    return (
        <>
            <Pagination className={styles.pagination}>
                <Pagination.First title="Primeiro" onClick={() => onClickPaginationItem(1)} />
                <Pagination.Prev title="Anterior" onClick={() => { if (activeItem > 1) onClickPaginationItem(activeItem - 1) }} />

                {activeItem > 0 ? numeration() : ''}

                <Pagination.Next title="Próximo" onClick={() => { if (activeItem < props.nPages) onClickPaginationItem(activeItem + 1) }} />
                <Pagination.Last title="Último" onClick={() => onClickPaginationItem(props.nPages)} />
            </Pagination>
        </>

    )
}
export default PaginationBar;