import { Component, Method, Prop } from '@stencil/core';


@Component({
    tag: 'intl-controller',
    styleUrl: 'controller.css'
})
export class Controller {

    @Prop({ context: 'document' }) doc: HTMLDocument;

    @Method()
    set(lang: string) {
        this.doc.head.setAttribute('lang', lang);
    }
}
