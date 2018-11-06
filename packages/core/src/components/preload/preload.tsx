import { Component, Element, State, Prop } from '@stencil/core';


@Component({
    tag: 'intl-preload',
    styleUrl: 'preload.css'
})
export class Preload {

    @Element() element: HTMLElement;
    @State() inGroup: boolean;
    @State() didLoad: boolean;

    @Prop({ mutable: true }) name: string;

    async componentWillLoad() {
        await this.resolveName();
        this.element.addEventListener('mouseenter', () => this.onHoverIn());
        this.element.addEventListener('mouseleave', () => this.onHoverOut());
    }

    private async onHoverIn() {
        if (!this.didLoad) {
            const dict = await document.querySelector('intl-dictionary').componentOnReady();
            await dict.resolvePhrase(this.name);
            this.didLoad = true;
        }
    }

    private onHoverOut() {
        this.element.removeEventListener('mouseenter', () => this.onHoverIn());
        this.element.removeEventListener('mouseleave', () => this.onHoverOut());
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
        return <slot/>
    }
}
