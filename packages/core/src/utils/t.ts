const hbs = /{{\s*([^}}\s]*)\s*}}/g;

export type Replacements = {
  count?: number,
  [k: string]: any
};

export type TOptions = {
  dictionary? :HTMLIntlDictionaryElement;
  pluralizer?: Intl.PluralRulesOptions;
}

function pluralSuffix(replacements: Replacements, locale: string, options: Intl.PluralRulesOptions): string {
  if (!replacements.hasOwnProperty('count')) {
    return '';
  }

  let formatter = new Intl.PluralRules(locale, options || {});

  return `.${formatter.select(replacements.count)}`;
}

export async function t(name: string, replacements: Replacements = {}, options: TOptions = {}): Promise<string | false> {
  let { dictionary } = options;
  if (!dictionary) {
    dictionary = await document.querySelector('intl-dictionary').componentOnReady();
  }

  let suffix = pluralSuffix(replacements, dictionary.lang, options.pluralizer);

  let phrase = await dictionary.resolvePhrase(`${name}${suffix}`);

  if (phrase === false) {
    return false;
  }

  return phrase.replace(hbs, (matched, ident) => {
    if (ident in replacements) {
      return replacements[ident].toString();
    }

    return matched;
  });
}
