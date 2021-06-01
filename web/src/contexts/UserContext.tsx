import React from 'react';
import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface User {
    id: string;
    nome: string;
    email: string;
    token: string;
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
    const [user, setUser] = useState(null);
    const router= useRouter();

    useEffect(() => {
        // const userToken = localStorage.getItem('@userToken');
        const user = localStorage.getItem('@user');

        if (user) {
            setUser(JSON.parse(user))
        }

    }, []);

    function loginUser(user: User, token: string) {
        setUser(user);
        // sessionStorage.setItem('@userToken', token);
        localStorage.setItem('@user', JSON.stringify(user));
        Cookies.set('tokenCookie', token);
        Cookies.set('userIdCookie', user.id);
        
        console.log('Usuário logado');
    }

    function logoutUser() {
        setUser(null);
        Cookies.remove('tokenCookie');
        Cookies.remove('userIdCookie');
        localStorage.clear();
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
