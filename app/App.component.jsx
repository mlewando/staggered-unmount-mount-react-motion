import React from 'react';
import {uniqueId} from 'lodash';
import List from './ListChildren';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amountToRemove: 0,
            amountToAdd: 0,
            items: ['Some 1 item', 'Some 2 item']
        };
        this.index = 3;
        this.addAmountId = uniqueId('add-amount');
        this.removeAmountId = uniqueId('remove-amount');
    }

    createArray(e) {
        const items = [...this.state.items];
        let {amountToRemove, amountToAdd} = this.state;
        while (amountToRemove--) {
            items.splice(Math.floor(Math.random() * (items.length - 1)), 1);
        }

        const finalSize = items.length + amountToAdd;
        while (items.length < finalSize) {
            const content = `Some ${this.index++} value`;

            items.splice(Math.floor(Math.random() * items.length), 0, content);
        }
        this.setState({items});
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor={this.addAmountId}>Amount of items to add to list:</label>
                    <input id={this.addAmountId} type='number' value={this.state.amountToAdd} onChange={e => this.setState({
                        amountToAdd: parseInt(e.currentTarget.value)
                    })}/>
                </div>
                <div>
                    <label htmlFor={this.removeAmountId}>Amount of items to remove from list:</label>
                    <input id={this.removeAmountId} type='number' value={this.state.amountToRemove} onChange={e => this.setState({
                        amountToRemove: parseInt(e.currentTarget.value)
                    })}/>
                </div>
                <button onClick={this.createArray.bind(this)}>Generate new list</button>
                <div>
                    <div>List:</div>
                    <List>
                        {this.state.items.map(item =>
                            <div key={item + '-key'} style={{border: '1px solid red'}}>
                                {item}
                            </div>
                        )}
                    </List>
                </div>
            </div>
        )
    }
}

export default App;
