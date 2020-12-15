import CircuitBuilder from '../circuit-builder/circuit-builder';
import React, { Component } from 'react';
import './app.scss';

interface AppState {
  theme: string;
}

class App extends Component<{}, AppState>{
  constructor(props: any) {
    super(props);

    this.state = { theme: "dark" };
  }

  switchTheme() {
    this.setState({ theme: this.state.theme === 'dark' ? 'light' : 'dark' })
  }

  render() {
    return (
      <div className={`app theme-${this.state.theme}`}>
        <CircuitBuilder onSwitchTheme={this.switchTheme.bind(this)} />
      </div>
    );
  }
}

export default App;