import Head from 'next/head';
import { useState } from 'react';

interface TesteProps {

}

const Teste: React.FC<TesteProps> = ({

}) => {
  const [showA, setShowA] = useState(false);

  const toggleShowA = () => setShowA(!showA);

  return (
    <div className="pageContainer">
      <Head><title>Teste | Ferragens Pérola do Vale</title></Head>
    </div>
  );
}

export default Teste;