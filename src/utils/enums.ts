type EnumLiteralsOf<T extends object> = T[keyof T];

// UserRoles
export type UserBranch = EnumLiteralsOf<typeof UserBranch>;

export const UserBranch = Object.freeze({
  DEFAULT: "DEFAULT",
});

// Languages
export type LanguageIsoCode = EnumLiteralsOf<typeof LanguageIsoCode>;

export const LanguageIsoCode = Object.freeze({
  fr: "fr",
  en: "en",
});

// Country IsoCodes
export type CountryIsoCode = EnumLiteralsOf<typeof CountryIsoCode>;

export const CountryIsoCode = Object.freeze({
  FR: "FR",
});
