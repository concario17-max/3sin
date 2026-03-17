import React, { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

  const value = useMemo(
    () => ({ isSidebarOpen, setIsSidebarOpen, isReflectionsOpen, setIsReflectionsOpen }),
    [isSidebarOpen, isReflectionsOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}
