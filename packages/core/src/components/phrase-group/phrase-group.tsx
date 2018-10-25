import { Component, Prop } from '@stencil/core';


@Component({
    tag: 'intl-phrase-group'
})
export class PhraseGroup {

    @Prop() name: string;

    render() {
        return <slot />;
    }
}
