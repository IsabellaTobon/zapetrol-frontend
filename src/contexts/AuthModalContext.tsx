import { createContext, useState, type ReactNode } from 'react';

interface AuthModalContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthModalContext.Provider value={{ showAuthModal, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}
