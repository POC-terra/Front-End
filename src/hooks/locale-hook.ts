import { useState } from "react";
import { createContainer } from "unstated-next";
import { DEFAULT_LOCALE } from "../utils/constants";
import { LanguageIsoCode } from "../utils/enums";

interface LocaleContextValue {
  locale: string;
  changeLanguage: (languageIsoCode: string) => void;
}

export const useLocaleProvider = (): LocaleContextValue => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  // useEffect(() => {
  //   localStorage.setItem("locale", "fr");
  // }, []);

  // Public
  const changeLanguage = (languageIsoCode: LanguageIsoCode) => {
    setLocale(languageIsoCode);
  };

  // Private
  // function _initLocale() {
  //   return navigator.languages == null ? navigator.language : navigator.languages[0] || DEFAULT_LOCALE;
  // }

  return { locale, changeLanguage };
};

export const LocaleContainer = createContainer(useLocaleProvider);

export const useLocale = () => {
  return LocaleContainer.useContainer();
};
