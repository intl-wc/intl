import { Component, Element, Prop, Method } from '@stencil/core';


@Component({
    tag: 'intl-dictionary',
    styleUrl: 'dictionary.css',
    shadow: true
})
export class Dictionary {
    
    private dicts: Map<string, Map<string, string>> = new Map();
    @Element() element: HTMLElement;

    @Prop({ mutable: true }) lang: string;
    @Prop() src: string;

    async componentWillLoad() {
        this.dicts = new Map();
        if (!this.lang) this.lang = this.element.closest('[lang]').getAttribute('lang');
        if (!this.src) throw new Error('<intl-dictionary> requires a `src` attribute. Did you forget to include an <intl-dictionary> element in your app root?')
        await this.fetchDictionary();
    }

    async fetchDictionary(lang: string = this.lang) {
        try {
            const path = `${this.src.replace(/\/$/, '')}/${lang}.json`
            const dict = await fetch(path)
                .then(response => response.json())
                .then(dict => this.jsonToDict(dict))
            this.dicts.set(lang, dict);
        } catch (e) {}
    }

    @Method()
    async resolvePhrase(name: string, lang: string = this.lang) {
        if (!this.dicts.has(lang)) await this.fetchDictionary(lang); 
        const dict = this.dicts.get(lang);
        
        const [key, ...parts] = name.split('.').map(x => x.trim()).filter(x => x);
        if (dict && dict.has(key)) {
            const values = dict.get(key);
            if (parts.length) {
                let resolved = parts.reduce((o, i) => o[i], dict.get(key));
                return (typeof values === 'object' && typeof resolved === 'string') ? resolved : false;
            } else {
                return (typeof values === 'string') ? values : false;
            }
        } else {
            return false;
        }
    }

    private jsonToDict(obj: { [key: string]: string }) {
        return new Map(Object.entries(obj));
    }
}
