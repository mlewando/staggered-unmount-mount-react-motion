import React from 'react';
import List from './AnimatedList.component';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {amount: 0};
  }

  change(e) {
    this.setState({amount: parseInt(e.currentTarget.value)});
  }

  render() {
    return (
      <div>
        <input type='number' value={this.state.amount} onChange={this.change.bind(this)} />
        <List list={[...Array(this.state.amount).keys()].map(i => `Some ${i + 1} value`)} />
      </div>
    );
  }
};

export default App;
