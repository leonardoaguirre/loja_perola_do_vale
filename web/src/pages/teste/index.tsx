import Head from 'next/head';
import { useState } from 'react';

import ToggleSwitch from '../../components/ToggleSwitch';

interface TesteProps {

}

const Teste: React.FC<TesteProps> = ({

}) => {
  const [showA, setShowA] = useState(false);

  const [check, setCheck] = useState(false);

  return (
    <div className="pageContainer">
      <Head><title>Teste | Ferragens Pérola do Vale</title></Head>
      <div className="pageContent">
        <ToggleSwitch name="teste" small={true} checked={check} onChange={setCheck} />
      </div>
    </div>
  );
}

export default Teste;