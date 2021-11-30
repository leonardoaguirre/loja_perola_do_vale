import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { createContext, ReactNode, useEffect, useState } from 'react';

import api from '../services/api';

interface User {
  id: string;
  idPessoa: string;
  nome: string;
  email: string;
  accessType: 'user' | 'adm';
}

interface UserContextData {
  user: User;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  accessType: 'default' | 'adm'; // somente para definir o tipo do header, perigo de segurança, não use em outro lugar
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>(null);
  const [accessType, setAccessType] = useState<'default' | 'adm'>('default');
  const router = useRouter();

  useEffect(() => {
    // const userToken = localStorage.getItem('@userToken');
    const userCookie: User = Cookies.getJSON('user');

    if (userCookie) {
      setUser(userCookie);
    }

  }, []);

  useEffect(() => {
    if (user) {
      api.get(`Funcionario/BuscarPorId/${user.id}`)
        .then((res) => {
          console.log(res.data)
          if (res.status === 200) {
            if (res.data.length > 0) {
              setAccessType('adm')
            } else {
              setAccessType('default')
            }
          } else {
            setAccessType('default')
          }
        }).catch(error => setAccessType('default'))
    }
  }, [user])

  function loginUser(user: User, token: string) {
    setUser(user);
    // sessionStorage.setItem('@userToken', token);
    Cookies.set('tokenCookie', token);
    // Cookies.set('userIdCookie', user.id);
    // Cookies.set('userName', user.nome);
    Cookies.set('user', user);
    console.log('Usuário logado');
  }

  function logoutUser() {
    setUser(null);
    Cookies.remove('tokenCookie');
    Cookies.remove('userIdCookie');
    Cookies.remove('user');
    Cookies.remove('cartProducts');
    localStorage.removeItem('cartProducts')
    // localStorage.setItem('cartProducts','');
    console.log('Usuário deslogado');
    router.push('/');
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        accessType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
