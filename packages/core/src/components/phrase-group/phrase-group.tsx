import { Component, Prop } from '@stencil/core';


@Component({
    tag: 'intl-phrase-group',
    shadow: true
})
export class PhraseGroup {

    @Prop() name: string;

    render() {
        return <slot />;
    }
}
