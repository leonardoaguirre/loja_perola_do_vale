import Head from 'next/head';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

import ToastCustom from '../../components/ToastCustom';

interface TesteProps {

}

const Teste: React.FC<TesteProps> = ({

}) => {
  const [showA, setShowA] = useState(false);

  const toggleShowA = () => setShowA(!showA);

  return (
    <div className="pageContainer">
      <Head><title>Teste | Ferragens Pérola do Vale</title></Head>
      <Button onClick={toggleShowA} className="mb-2">
        Toggle Toast <strong>with</strong> Animation
      </Button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <ToastCustom
        title="Favoritos"
        show={showA}
        toggleShow={toggleShowA}
        autohide={true}
        delay={5000}
        content={<></>}
      />
    </div>
  );
}

export default Teste;