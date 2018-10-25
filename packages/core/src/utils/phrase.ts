export async function phrase(name: string) {
    return document
        .querySelector('intl-dictionary').componentOnReady()
        .then(dict => dict.resolvePhrase(name))
        .then(x => x ? x : null)
};