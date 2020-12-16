import CircuitBuilder from '../circuit-builder/circuit-builder';
import Constants from '../../constants';
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

  componentDidMount() {
    if (localStorage.getItem(Constants.ThemeKey))
      this.setState({ theme: localStorage.getItem(Constants.ThemeKey)! })
  }

  switchTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: newTheme })
    localStorage.setItem(Constants.ThemeKey, newTheme)
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