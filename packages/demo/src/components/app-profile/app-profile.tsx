import { Component, Prop, State, Method } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { LanguageObserver } from '@intl/core';
// import { phrase } from '@intl/core';

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.css',
  shadow: true
})
export class AppProfile {
  
  private lo: LanguageObserver;
  private emoji = {
    none: "🚫",
    dog: "🐕",
    cat: "🐈",
    lizard: "🦎"
  }
  @State() value: number = 1;
  
  @State() dog: string;
  @State() cat: string;
  @State() lizard: string;
  
  @State() pet: 'dog' | 'cat' | 'lizard' = 'dog';

  @Prop() match: MatchResults;

  componentWillLoad() {
    this.addLO();
  }

  componentDidUnload() {
    this.removeLO();
  }

  private addLO() {
    this.removeLO();

    const isPhrase = (record) => record.type === 'phrase';
    const collectPhrases = (collector, record) => (
      { ...collector, [record.phraseName]: record.value }
    )
    const dot = (str, val, obj) => {
      let currentObj = obj;
      let keys = str.split('.');
      let i;
      let key;

      for (i = 0; i < Math.max(1, keys.length - 1); i++) {
        key = keys[i];
        currentObj[key] = currentObj[key] || {};
        currentObj = currentObj[key];
      }

      currentObj[keys[i]] = val;
      delete obj[str];
    }

    const expand = (obj) => {
      for (let key of Object.keys(obj)) {
        if (key.includes('.')) {
          dot(key, obj[key], obj)
        }
      }
      return obj;
    }

    this.lo = new LanguageObserver((records) => {
      const { profile: { pets: { dog, cat, lizard }}} = expand(records.filter(isPhrase).reduce(collectPhrases, {}))
      
      this.dog = dog.singular;
      this.cat = cat.singular;
      this.lizard = lizard.singular;
    });

    this.lo.observe({
      phraseFilter: ['profile.pets.dog.singular', 'profile.pets.cat.singular', 'profile.pets.lizard.singular']
    })
  }

  private removeLO() {
    if (this.lo) {
      this.lo.disconnect();
    }
  }


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
            <intl-phrase name="myName.is" replace={{ name: this.normalize(this.match.params.name) }} /> <intl-phrase name="myName.origin" />
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

          <div class="controls">
            <select name="pet" onInput={(e) => {
              this.pet = (e.target as any).value;
              this.value = 1;
            }}>
              {
                ['dog', 'cat', 'lizard'].map((pet) => (
                  <option value={pet} selected={this.pet === pet}> { this[pet] } </option>
                ))
            }
              </select>
              
              <div class="buttons">
                <button onClick={() => this.increment()}> + </button>
                <button onClick={() => this.decrement()}> - </button>
              </div>
          </div>
        
          </intl-phrase-group>
        </div>
      );
    }
  }
}
