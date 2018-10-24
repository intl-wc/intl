import { Component, Prop, State, Element } from '@stencil/core';


@Component({
    tag: 'intl-phrase',
    shadow: true
})
export class Phrase {
    
    @Element() element: HTMLElement;
    
    @State() value: string = '';
    @State() error: string = '';
    
    @Prop({ mutable: true }) lang: string;
    @Prop() name: string;
    
    @Prop({ connect: 'intl-dictionary' }) dict: HTMLIntlDictionaryElement;

    async componentWillLoad() {
        if (!this.lang) this.lang = this.element.closest('[lang]').getAttribute('lang');
        const dict = await this.dict.componentOnReady();
        const value = await dict.resolvePhrase(this.name, this.lang);

        if (value !== false) {
            this.value = value;
        } else {
            this.error = `"${this.name}"`;
        }
    }

    hostData() {
        return {
            style: {
                color: (this.error !== '') ? 'red' : null
            }
        }
    }

    render() {
        return this.value ? this.value : this.error;
    }
}
