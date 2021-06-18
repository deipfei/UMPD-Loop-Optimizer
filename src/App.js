import './App.css';
import { HORSES } from './Horses.js';
import Loop from './Loop.js';
import Selector from './Selector.js';
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedHorses: [HORSES[0]],
      disabledHorses: []
    };
  }

  updateSelection = (horse, ctrl) => {
    if (this.state.disabledHorses.includes(horse)) {
      this.updateDisabled(horse); //remove disabled horse if you select it
    }
    let horses = this.state.selectedHorses;

    if (ctrl) {
      let index = horses.indexOf(horse);
      if (index !== -1 && horses.length > 1) {
        horses.splice(index, 1);
      } else {
        if (horses.length < 3 && !horses.includes(horse)) {
          horses.push(horse);
        }
      }
    } else {
      horses = [horse];
    }

    this.setState((state, props) => {
      return { selectedHorses: horses, disabledHorses: this.state.disabledHorses };
    });
  }

  updateDisabled = (horse) => {
    if (this.state.selectedHorses.includes(horse)) {
      return; //do not disable the selected horse
    }

    let disabled = this.state.disabledHorses;
    let index = disabled.indexOf(horse);
    if (index !== -1) {
      disabled.splice(index, 1);
    } else {
      disabled.push(horse);
    }

    this.setState((state, props) => {
      return { selectedHorses: this.state.selectedHorses, disabledHorses: disabled }
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Uma Musume: Pretty Derby Breeding Loop Optimizer</h1>
        <p>Left click to select a root horse to find a loop for</p>
        <p>Ctrl+Left click to select up to three horses in one loop</p>
        <p>Right click to disable a horse from being included in loop</p>
        <p>Using data from <a href="https://twitter.com/gamedukedeatho">gamedukedeatho</a></p>
        <Selector horses={HORSES}
          updateSelection={this.updateSelection}
          selectedHorses={this.state.selectedHorses}
          updateDisabled={this.updateDisabled}
          disabledHorses={this.state.disabledHorses}>
        </Selector>

        <Loop horses={this.state.selectedHorses} disabledHorses={this.state.disabledHorses}></Loop>
      </div>
    );
  }
}

export default App;
