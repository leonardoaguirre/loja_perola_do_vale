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

export { ModalLarge,ModalSmall }