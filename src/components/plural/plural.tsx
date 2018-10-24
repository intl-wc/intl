import { Component, State, Prop, Element, Method, Watch } from '@stencil/core';
import { getLocale } from '../../utils/lang';

/**
 * Plural is a web component that enables plural sensitive formatting,
 * adhering to variations of plural rules per locale.
 * 
 * It uses `Intl.PluralRules` under the hood, providing a slot-based interface
 * for passing in different options.
 * 
 * #### Simple Example, Singular/Plural
 * ```html
<intl-plural number="1">
  <span slot="one">dog</span>
  <span> dogs </span>
</intl-plural>
 ```
 * #### Complex Example, Ordinal
 * ```html
<intl-plural locale="en-US" type="ordinal" number="1">
  <span slot="one">st</span>
  <span slot="two">nd</span>
  <span slot="few">rd</span>
  <span>th</span>
</intl-plural>
 ```
 */
@Component({
    tag: 'intl-plural',
    styleUrl: 'plural.css',
    shadow: true
})
export class Plural {

    @Element() el: HTMLElement;
    @State() formatter: Intl.PluralRules;
    @State() result: string;

    /** 
     * An integer value which will be passed to `Intl.PluralRules`
     * 
     * If omitted, the componenet will automatically look for an integer value in the parent element,
     * like so:
     ```html
<div>
  42
  <intl-plural locale="en-US" type="ordinal">
    <span slot="one">st</span>
    <span slot="two">nd</span>
    <span slot="few">rd</span>
    <span>th</span>
  </intl-plural>
</div>
     ```
     */
    @Prop({ mutable: true }) value: string;
    /** 
     * The `localeMatcher` that will be passed to `Intl.PluralRules` 
     * 
     * Possible options are `best fit` (default) or `lookup`
     */
    @Prop() localeMatcher?: 'lookup' | 'best fit';
    /** 
     * The `type` that will be passed to `Intl.PluralRules`
     * 
     * Possible options are `cardinal` (default) or `ordinal`
     */
    @Prop() type?: 'cardinal' | 'ordinal';

    private _locale: string | string[];
    /** 
     * The `locale` that will be passed to `Intl.PluralRules`
     * 
     * You may also pass in a comma-separated list of values, providing fallbacks
     */
    @Prop() lang: string;
    @Watch('lang')
    langChanged() {
        const lang = getLocale(this.lang, this.el);
        if (lang.indexOf(',') > -1) {
            this._locale = lang.split(',').map(x => x.trim()).filter(x => x);
        } else {
            this._locale = lang;
        }
    }

    componentWillLoad() {
        this.langChanged();
        this.setFormatter();
        if (!this.value) this.value = this.el.parentElement.innerText.trim();
        this.format();
    }

    @Method()
    format() {
        this.result = this.formatter.select(Number.parseInt(this.value));
        console.log(this.formatter.resolvedOptions());
    }

    private setFormatter() {
        const { localeMatcher, type } = this;
        this.formatter = new Intl.PluralRules(this._locale, {
            localeMatcher, type
        })
    }

    render() {
        switch (this.result) {
            case 'other': return <slot />
            default: return <slot name={this.result}/>
        }
    }
}
