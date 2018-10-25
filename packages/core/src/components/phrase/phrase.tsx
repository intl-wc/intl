import { Component, Prop, State, Element, Watch, Listen } from '@stencil/core';


@Component({
    tag: 'intl-phrase',
    shadow: true
})
export class Phrase {
    
    @Element() element: HTMLElement;
    private io: IntersectionObserver;

    @State() inGroup = false;
    @State() replacements: Map<string, string>;
    @State() value: string = '';
    @State() error: string = '';
    @State() resolvedName: string = '';
    
    @Prop({ connect: 'intl-dictionary' }) dict: HTMLIntlDictionaryElement;
    
    @Prop({ mutable: true }) lang: string;
    
    @Prop() lazy: boolean = true;

    @Prop() name: string;
    @Watch('name')
    async nameChanged() {
        await this.resolveName();
        this.addIO();
    }

    @Prop() replace: string | { [key: string]: any };
    @Watch('replace')
    replaceChanged() {
        switch (typeof this.replace) {
            case 'string':
                try {
                    const obj = JSON.parse(this.replace as string);
                    this.replacements = new Map(Object.entries(obj));
                } catch (e) {
                    throw new Error(`Invalid value for "replace" in <intl-phrase>. "replace" must either be an object or a valid JSON string.`);
                }
                break;
            case 'object':
                this.replacements = new Map(Object.entries(this.replace));
                break;
            default: throw new Error(`Invalid value for "replace" in <intl-phrase>. "replace" must either be an object or a valid JSON string.`);
        }
    }

    @Listen('document:intlLangChange')
    protected langChangeHandler() {
        this.addIO();
    }


    async componentWillLoad() {
        this.addIO();
        if (this.replace) this.replaceChanged();
        await this.resolveName();
    }

    componentWillUnload() {
        this.removeIO();
    }

    private async resolveName() {
        return new Promise((resolve) => {
            const group = this.element.closest('intl-phrase-group');
            if (group) {
                this.inGroup = true;
                this.resolvedName = `${group.name}.${this.name}`;
                resolve();
            } else {
                this.resolvedName = this.name;
                resolve();
            }
        })
    }

    private async resolveValue() {
        const { resolvedName: name, lang } = this;
        const dict = await this.dict.componentOnReady();
        const value = this.replaceValue(await dict.resolvePhrase(name, lang));

        if (value !== false && value !== undefined) {
            this.value = value;
        } else {
            this.error = this.name;
        }
    }

    private replaceValue(value: string | false) {
        if (value === false) return value;

        const hbs = /{{\s*([^}}\s]*)\s*}}/g;
        return (value as string).replace(hbs, (matched, ident) => {
            return this.replacements.has(ident) ? this.replacements.get(ident).toString() : matched;
        });
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
