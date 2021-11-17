import { Row, Col, Toast, Button, ToastContainer } from 'react-bootstrap'
import { useState } from 'react'

interface ToastProps {
    open: boolean;
}

const SuccessToast: React.FC<ToastProps> = (props) => {
    const [show, setShow] = useState(props.open);

    return (
        <Row>
            <Col xs={6}>
                    <Toast  onClose={() => setShow(false)}
                        show={show}
                        delay={3000}
                        autohide bg='success'
                    >
                        <Toast.Header>
                            <img
                                src="../../../public/icons/logo.png"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto">Notifição</strong>
                            {/* <small>11 mins ago</small> */}
                        </Toast.Header>
                        <Toast.Body>{props.children}</Toast.Body>
                    </Toast>
            </Col>
            {/* <Col xs={6}>
                <Button onClick={() => setShow(true)}>Show Toast</Button>
            </Col> */}
        </Row>
    );
}

export { SuccessToast }