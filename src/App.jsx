import React from 'react';
import TextPage from './pages/TextPage';
import { UIProvider } from './context/UIContext';
import Header from './components/Header';

function App() {
  return (
    <UIProvider>
      <Header />
      <TextPage />
    </UIProvider>
  );
}

export default App;
