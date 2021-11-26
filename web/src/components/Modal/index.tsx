import { Modal, Button } from 'react-bootstrap'


const ModalLarge = (props) => {
    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4>{props.title}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} variant='secondary'>Fechar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
const ModalSmall = (props) => {
    return (
        <>
            <Modal
                {...props}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4>{props.title}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} variant='secondary'>Fechar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
const ModalExclusion = (props) => {
    const { objN, onConfirm, ...rest } = props
    return (
        <>
            <Modal
                {...rest}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.children ? props.children : <h4>Excluir {props.objN}</h4>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.children ? props.children : `Você realmente deseja excluir este(a) ${props.objN}?`}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => props.onConfirm(e)} variant='primary'>Sim</Button>
                    <Button onClick={props.onHide} variant='outline-secondary'>Não</Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}
export { ModalLarge, ModalSmall, ModalExclusion }