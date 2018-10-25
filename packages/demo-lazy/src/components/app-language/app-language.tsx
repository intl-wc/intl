import { Component, Prop, Listen, State } from '@stencil/core';


@Component({
    tag: 'app-language',
    styleUrl: 'app-language.css',
    shadow: true
})
export class AppLanguage {

    private languages = [
        'en',
        'es'
    ]

    @State() lang: string = document.documentElement.getAttribute('lang');
    @Prop({ connect: 'intl-controller' }) intlCtrl: HTMLIntlControllerElement;

    @Listen('document:intlLangChange')
    protected langChangeHandler(event: CustomEvent<string>) {
        this.lang = event.detail;
    }

    async setLanguage(value: string) {
        const ctrl = await this.intlCtrl.componentOnReady();
        ctrl.setLanguage(value);
    }

    render() {
        return (
            <div>
                {
                    this.languages.map((locale) => (
                        <button onClick={() => this.setLanguage(locale)} class={{ active: this.lang === locale }}>
                            <intl-phrase name={`lang.${locale}`}/>
                        </button>
                    ))
                }
            </div>
        );
    }
}
