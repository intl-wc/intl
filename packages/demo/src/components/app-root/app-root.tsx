import { Component } from '@stencil/core';
import '@intl/core';
import { format } from '@intl/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  componentWillLoad() {
    const formatted = format('Hello {name, test} { gender }', { name: 'Nate', gender: 'male' });
    console.log(formatted);
  }

  render() {
    return (
      <div>
        <header>
          <h1> <intl-phrase name="appTitle" /> </h1>
        </header>

        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url='/' component='app-home' exact={true} />
              <stencil-route url='/profile/:name' component='app-profile' />
            </stencil-route-switch>
          </stencil-router>
        </main>

        <footer>
          <app-language />
        </footer>
      </div>
    );
  }
}
