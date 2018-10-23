import { Component } from '@stencil/core';


@Component({
    tag: 'intl-datetime',
    styleUrl: 'datetime.css'
})
export class Datetime {

    // private formatter: Intl.DateTimeFormat;

    componentWillLoad() {
        // this.formatter = new Intl.DateTimeFormat('en');
    }

    render() {
        return (
            <div>
                <p>Hello Datetime!</p>
            </div>
        );
    }
}
