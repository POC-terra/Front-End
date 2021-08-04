import { useEffect, useState } from "react";
import { PUBLIC_PATH } from "../utils/config";
import { DEFAULT_LOCALE } from "../utils/constants";
import { useLocale } from "./locale-hook";

export const useDefaultTranslations = (): Record<string, string> | undefined => {
  const [defaultTranslations, setDefaultTranslations] = useState<Record<string, string>>();

  useEffect(() => {
    // TODO SPEC? : fetch default language of the country? Or use navigator as default locale?
    fetchJson(DEFAULT_LOCALE).then(res => {
      setDefaultTranslations(res);
    });
  }, []);

  return defaultTranslations;
};

export const useTranslations = (): Record<string, string> | undefined => {
  const { locale } = useLocale();
  const defaultTranslations = useDefaultTranslations();
  /* TODO: 
  - Générer les fichiers de trad automatiquement https://medium.com/@yehiasaleh/internationalization-localization-using-react-intl-typescript-1e7cfccd34d7
  */
  const [translations, setTranslations] = useState(defaultTranslations);
  useEffect(() => {
    fetchJson(locale)
      .then(translations => {
        setTranslations(translations);
      })
      .catch(() => {
        setTranslations(defaultTranslations);
      });
  }, [defaultTranslations, locale]);

  return translations;
};

function buildRecordFromJSON(json: any) {
  const final: Record<string, string> = {};
  for (const key in json) {
    final[key] = json[key];
  }
  return final;
}

async function fetchJson(locale: string) {
  const file = await fetch(PUBLIC_PATH + "/translations/" + locale + ".json");
  return (
    file &&
    file.json().then(json => {
      return buildRecordFromJSON(json);
    })
  );
}
