import { useState } from 'react';

interface TesteProps {

}

const Teste: React.FC<TesteProps> = ({

}) => {

  console.log(process.env.production)

  const [valor, setValor] = useState<number>(20.90);

  return (
    <>
      <h1>TYPE: {process.env.production}</h1>
      <h2>URL: {process.env.API}</h2>
    </>
  );
}

export default Teste;