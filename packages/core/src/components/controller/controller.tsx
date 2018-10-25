import { Component, Method, Prop } from '@stencil/core';


@Component({
    tag: 'intl-controller'
})
export class Controller {

    @Prop({ context: 'document' }) doc: HTMLDocument;

    @Method()
    setLanguage(lang: string) {
        this.doc.documentElement.setAttribute('lang', lang);
    }
}
