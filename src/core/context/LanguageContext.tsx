import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  isInitialized: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n: i18nHook } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Wait for i18next to be initialized
    i18n.on('initialized', () => {
      setIsInitialized(true);
      setCurrentLanguage(i18n.language);
    });

    if (i18n.isInitialized) {
      setIsInitialized(true);
      setCurrentLanguage(i18n.language);
    }

    return () => {
      i18n.off('initialized');
    };
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18nHook.language);
  }, [i18nHook.language]);

  const changeLanguage = useCallback(async (lang: string) => {
    try {
      if (!isInitialized) {
        throw new Error('i18n is not initialized yet');
      }
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, [isInitialized]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
