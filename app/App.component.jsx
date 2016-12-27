import React from 'react';
import List from './AnimatedList.component';
let globalIndex = 0;
const convertArray = (array, toRemove, toAdd) => {
    array = [...array];
    while (toRemove--) {
        array.splice(Math.floor(Math.random() * (array.length - 1)), 1);
    }

    const finalSize = array.length + toAdd;
    while (array.length < finalSize) {
        const content = `Some ${globalIndex++} value`;
        array.splice(Math.floor(Math.random() * array.length), 0, content);
    }
    return [...array];
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToRemove: 0,
            amountToAdd: 0,
            items: []
        };
    }

    change(e) {
        this.setState({
            items: convertArray(this.state.items, this.state.amountToRemove, this.state.amountToAdd)
        });
    }

    render() {
        return (
            <div>
                <input type='number' value={this.state.amountToRemove} onChange={e => this.setState({
                    amountToRemove: parseInt(e.currentTarget.value)
                })}/>
                <input type='number' value={this.state.amountToAdd} onChange={e => this.setState({
                    amountToAdd: parseInt(e.currentTarget.value)
                })}/>
                <button onClick={this.change.bind(this)}>go</button>
                <List list={this.state.items}/>
            </div>
        );
    }
};

export default App;
