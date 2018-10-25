import { Component, Element, Prop, Method, Event, EventEmitter, Watch, State } from '@stencil/core';


@Component({
    tag: 'intl-dictionary',
    styleUrl: 'dictionary.css',
    shadow: true
})
export class Dictionary {
    
    private mo: MutationObserver;
    private dicts: Map<string, Map<string, string>> = new Map();
    @Element() element: HTMLElement;

    @State() request: Promise<void> = null;
    @Event() intlLangChange: EventEmitter<string>;

    @Prop({ mutable: true }) lang: string;
    @Watch('lang')
    langChanged() {
        this.intlLangChange.emit(this.lang);
    }
    
    @Prop() src: string;

    async componentWillLoad() {
        this.dicts = new Map();
        this.addMO();

        if (!this.lang) this.lang = document.documentElement.getAttribute('lang');
        if (!this.src) throw new Error('<intl-dictionary> requires a `src` attribute. Did you forget to include an <intl-dictionary> element in your app root?')
        await this.fetchDictionary();
    }

    componentDidUnload() {
        this.removeMO();
    }

    async fetchDictionary(lang: string = this.lang) {
        try {
            const path = `${this.src.replace(/\/$/, '')}/${lang}.json`
            
            // There is already a fetch event in progress
            // To avoid multiple fetches, just `await` the one in progress
            if (this.request !== null) {
                await this.request;
            } else {
                this.request = fetch(path)
                    .then(response => response.json())
                    .then(dict => this.jsonToDict(dict))
                    .then(dict => this.dicts.set(lang, dict))
                    .then(() => null);
                await this.request;
            }
            
            // Request has been resolved, so reset it
            this.request = null;
        } catch (e) { }
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
            console.error(`Unable to resolve phrase "${name}" for "${lang}"`);
            return false;
        }
    }

    private jsonToDict(obj: { [key: string]: string }) {
        return new Map(Object.entries(obj));
    }

    private addMO() {
        if ('MutationObserver' in window) {
            this.removeMO();
            this.mo = new MutationObserver(data => {
                if (data[0].attributeName === 'lang') {
                    this.lang = document.documentElement.getAttribute('lang');
                }
            });

            this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang']});
        }
    }
    private removeMO() {
        if (this.mo) {
            this.mo.disconnect();
            this.mo = undefined;
        }
    }
}
