import { Component, Prop, State, Method } from '@stencil/core';
import { MatchResults } from '@stencil/router';

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.css',
  shadow: true
})
export class AppProfile {
  
  private emoji = {
    none: "🚫",
    dog: "🐕",
    cat: "🐈",
    lizard: "🦎"
  }
  @State() value: number = 1;
  @State() pet: 'dog'|'cat'|'lizard' = 'dog';

  @Prop() match: MatchResults;

  @Method()
  increment() {
    this.value++;
  }
  
  @Method()
  decrement() {
    if (this.value >= 1) this.value--;
  }

  normalize(name: string): string {
    if (name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
    }
    return '';
  }

  renderPets() {
    const result = [];
    if (this.value > 0) {
      for (let i = 0; i < this.value; i++) {
        result.push(
          <span>{this.emoji[this.pet]}</span>
        )
      }
    } else {
      result.push(
        <span>{this.emoji['none']}</span>
      )
    }
    return result;
  }

  render() {
    if (this.match && this.match.params.name) {
      return (
        <div class="app-profile">
          <intl-phrase-group name="profile">
          <p>
            <intl-phrase name="my-name.is" replace={{ name: this.normalize(this.match.params.name) }} /> <intl-phrase name="my-name.origin" />
          </p>

          <p>
            
            <intl-phrase-group name="pets">

              <intl-phrase name="feeling" />&nbsp;
              
              <intl-plural value={this.value}>
                <intl-phrase slot="one" name='possession.singular' />
                <intl-phrase name='possession.plural' />
              </intl-plural>&nbsp;
              <span>{this.value}</span>&nbsp;
              
              <intl-plural value={this.value}>
                <intl-phrase slot="one" name={`${this.pet}.singular`} />
                <intl-phrase name={`${this.pet}.plural`} />
              </intl-plural>
            </intl-phrase-group>.
          </p>

          <div class="pets">
            { this.renderPets() }
          </div>

          <div>
            <button onClick={() => this.increment()}> + </button>
            <button onClick={() => this.decrement()}> - </button>
            
            <select name="pet" onInput={(e) => {
              this.pet = (e.target as any).value;
              this.value = 1;
            }}>
              {
                ['dog', 'cat', 'lizard'].map((pet) => (
                  <option value={pet} selected={this.pet === pet} label={pet}> <intl-phrase name={pet}/> </option>
                ))
            }
            </select>
          </div>
        
          </intl-phrase-group>
        </div>
      );
    }
  }
}
