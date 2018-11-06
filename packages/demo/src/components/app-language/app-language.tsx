import { Component, Listen, State } from '@stencil/core';
import { locale } from '@intl/core';


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

    @State() lang: string = locale.get();

    @Listen('document:intlLocaleChange')
    protected localeChangeHandler(event: CustomEvent<string>) {
        this.lang = event.detail;
    }

    setLanguage(value: string) {
        return locale.set(value);
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
