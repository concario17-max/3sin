import React from 'react';
import TextPage from './pages/TextPage';
import { UIProvider } from './context/UIContext';
import Header from './components/Header';
import PasswordGuard from './components/PasswordGuard';

function App() {
  return (
    <UIProvider>
      <PasswordGuard>
        <Header />
        <TextPage />
      </PasswordGuard>
    </UIProvider>
  );
}

export default App;
