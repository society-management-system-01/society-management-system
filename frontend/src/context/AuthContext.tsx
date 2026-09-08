import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { CURRENT_USER_RESIDENT, CURRENT_USER_STAFF, CURRENT_USER_ADMIN } from '../services/mockData';

interface AuthContextType {
    currentUser: User;
    role: UserRole;
    isAuthenticated: boolean;
    loginAsRole: (role: UserRole) => void;
    loginWithCredentials: (email: string, role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<UserRole>(() => {
        const saved = localStorage.getItem('society_active_role');
        return (saved as UserRole) || 'resident';
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('society_auth_state') !== 'logged_out';
    });

    const getUserForRole = (userRole: UserRole): User => {
        switch (userRole) {
            case 'staff':
                return CURRENT_USER_STAFF;
            case 'admin':
                return CURRENT_USER_ADMIN;
            case 'resident':
            default:
                return CURRENT_USER_RESIDENT;
        }
    };

    const [currentUser, setCurrentUser] = useState<User>(() => getUserForRole(role));

    const loginAsRole = (newRole: UserRole) => {
        setRole(newRole);
        setCurrentUser(getUserForRole(newRole));
        setIsAuthenticated(true);
        localStorage.setItem('society_active_role', newRole);
        localStorage.setItem('society_auth_state', 'logged_in');
    };

    const loginWithCredentials = (_email: string, selectedRole: UserRole) => {
        loginAsRole(selectedRole);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('society_auth_state', 'logged_out');
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                role,
                isAuthenticated,
                loginAsRole,
                loginWithCredentials,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
