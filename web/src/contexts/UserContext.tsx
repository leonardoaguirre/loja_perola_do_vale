import React from 'react';
import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface User {
    id: string;
    idPessoa: string;
    nome: string;
    email: string;
}

interface UserContextData {
    user: User;
    loginUser: (user: User, token: string) => void;
    logoutUser: () => void;
}

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserContextProviderProps) {
    const [user, setUser] = useState<User>(null);
    const router= useRouter();

    useEffect(() => {
        // const userToken = localStorage.getItem('@userToken');
        const userCookie: User = Cookies.getJSON('user');

        if (userCookie) {
            setUser(userCookie);
        }

    }, []);

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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
