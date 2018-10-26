export function escapeRegExp(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function select<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)];
}

const greetings: { [key: string]: string } = {
    Afrikaans: 'Hallo, wêreld!',
    Czech: 'Ahoj Světe!',
    Bemba: 'Shani Mwechalo!',
    Bengali: 'Shagatam Prithivi!',
    Bosnian: 'Zdravo Svijete!',
    Catalan: 'Hola món!',
    Danish: 'Hej, Verden!',
    Dutch: 'Hallo, wereld!',
    Esperanto: 'Saluton mondo!',
    French: 'Salut le Monde!',
    Galician: 'Ola mundo!',
    German: 'Hallo Welt!',
    Hindi: 'नमस्ते दुनिया',
    Hungarian: 'Helló világ!',
    Igbo: 'Ndewo Ụwa',
    Indonesian: 'Halo Dunia!',
    Italian: 'Ciao Mondo!',
    Japanese: 'こんにちは、 世界！',
    Kiswahili: 'Habari dunia!',
    Kikuyu: 'Niatia thi!',
    Korean: '반갑다 세상아',
    Latin: 'AVE MVNDE',
    Latvian: 'Sveika, Pasaule!',
    Malayalam: 'Namaskaram, lokame',
    Norwegian: 'Hallo verden!',
    Polish: 'Witaj świecie!',
    Portuguese: 'Olá, mundo!',
    Romanian: 'Salut lume!',
    Serbian: 'Zdravo Svete!',
    Slovenian: 'Pozdravljen svet!',
    Spanish: '¡Hola mundo!',
    Swedish: 'Hejsan världen!',
    Tagalog: 'Kamusta mundo!',
    Turkish: 'Merhaba Dünya!',
    Welsh: 'S\'mae byd!'
}

export const greeting = () => {
    const language = select(Object.keys(greetings));
    const phrase = greetings[language]
    return { language, phrase };
}