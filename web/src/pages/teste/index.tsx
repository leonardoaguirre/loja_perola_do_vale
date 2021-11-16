import { useState } from 'react';

interface TesteProps {
  
}

const Teste: React.FC<TesteProps> = ({
  
}) => {

  const [valor, setValor] = useState<number>(20.90);

  return (
    <>
      <button onClick={() => setValor(valor + 10.00)}>+</button>
    </>
  );
}

export default Teste;