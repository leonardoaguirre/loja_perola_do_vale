import Head from 'next/head';
import { useState } from 'react';

interface TesteProps {

}

const Teste: React.FC<TesteProps> = ({

}) => {

  console.log(process.env.production)

  const [valor, setValor] = useState<number>(20.90);

  return (
    <div className="pageContainer">
      <Head><title>Teste | Ferragens Pérola do Vale</title></Head>
      <h1>TYPE: {process.env.production}</h1>
      <h2>URL: {process.env.API}</h2>
    </div>
  );
}

export default Teste;