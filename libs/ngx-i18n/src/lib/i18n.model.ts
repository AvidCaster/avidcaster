export interface LanguageInfo {
  // iso code for language
  [iso: string]: {
    // native name of language
    name: string;
    // angular locale path for language
    locale?: string;
    // angular extra locale path for language
    localeExtra?: string;
    // one or more optional app-specific field(s)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [id: string]: any;
  };
}

export interface AvailableLanguage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export enum LanguageDirection {
  // Left to Right
  'ltr' = 'ltr',
  // Right to Left
  'rtl' = 'rtl',
}

export class I18nConfig {
  // default language (default = 'en')
  defaultLanguage?: string;
  // enabled languages (default ['en'])
  enabledLanguages: string[];
  // available languages
  availableLanguages: LanguageInfo;
  // cache busting hash
  cacheBustingHash: string;
}

/**
 * Wrapper for translation extractor tools such as @biesbjerg/ngx-translate-extract
 * @param key - string to be translated
 */
export function _(key: string): string {
  return key;
}