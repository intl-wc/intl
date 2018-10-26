import { Component, Prop, Element, State } from '@stencil/core';


@Component({
    tag: 'intl-phrase-group'
})
export class PhraseGroup {

    @Element() element: HTMLElement;
    @State() inGroup: boolean;

    @Prop({ mutable: true }) name: string;
    
    async componentWillLoad() {
        await this.resolveName();
    }

    private async resolveName() {
        return new Promise((resolve) => {
            const group = this.element.parentElement.closest('intl-phrase-group');
            if (group) {
                this.inGroup = true;
                this.name = `${group.name}.${this.name}`;
                resolve();
            } else {
                resolve();
            }
        })
    }

    render() {
        return <slot />;
    }
}
