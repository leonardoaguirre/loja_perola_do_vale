import React from 'react';
import { createContext, useState, ReactNode, useEffect } from 'react';

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

    useEffect(() => {
        const userToken = localStorage.getItem('@userToken');
        const user = localStorage.getItem('@user');

        if (userToken && user) {
            setUser(JSON.parse(user))
            console.log('entrou no if');
        } else {
            console.log('deu falso no if');
        }

        console.log('chamou useEffect da UserContext');
    }, []);

    function loginUser(user: User, token: string) {
        setUser(user);
        localStorage.setItem('@userToken', token);
        localStorage.setItem('@user', JSON.stringify(user));
        console.log('Usuário logado');
    }

    function logoutUser() {
        setUser(null);
        localStorage.clear();
        console.log('Usuário deslogado');
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
