import { Component, Prop, State, Element } from '@stencil/core';


@Component({
    tag: 'intl-phrase',
    shadow: true
})
export class Phrase {
    
    @Element() element: HTMLElement;
    private io: IntersectionObserver;

    @State() inGroup = false;
    @State() value: string = '';
    @State() error: string = '';
    @State() resolvedName: string = '';
    
    @Prop({ mutable: true }) lang: string;
    @Prop() name: string;
    @Prop() lazy: boolean = true;
    
    @Prop({ connect: 'intl-dictionary' }) dict: HTMLIntlDictionaryElement;

    async componentWillLoad() {
        this.addIO();
        await this.resolveName();

        if (!this.lang) this.lang = this.element.closest('[lang]').getAttribute('lang');
    }

    componentWillUnload() {
        this.removeIO();
    }

    private async resolveName() {
        const groupEl = this.element.closest('intl-phrase-group');
        let group: HTMLIntlPhraseGroupElement;
        if (groupEl) {
            this.inGroup = true;
            group = await groupEl.componentOnReady();
            this.resolvedName = `${group.name}.${this.name}`;
        } else {
            this.resolvedName = this.name;
        }
        return Promise.resolve();
    }

    private async resolveValue() {
        const { resolvedName: name, lang } = this;
        const dict = await this.dict.componentOnReady();
        const value = await dict.resolvePhrase(name, lang);

        console.log(name, value);

        if (value !== false && value !== undefined) {
            this.value = value;
        } else {
            this.error = this.name;
        }
    }

    private addIO() {
        if (this.name === undefined) return;

        if ('IntersectionObserver' in window) {
            this.io = new IntersectionObserver(data => {
                // because there will only ever be one instance
                // of the element we are observing
                // we can just use data[0]
                if (data[0].isIntersecting) {
                    this.resolveValue().then(() => {
                        this.removeIO();
                    })
                }
            });
            this.io.observe(this.element);
        } else {
            // fall back to setTimeout for Safari and IE
            setTimeout(() => this.resolveValue(), 200);
        }
    }

    private removeIO() {
        if (this.io) {
            this.io.disconnect();
            this.io = undefined;
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
