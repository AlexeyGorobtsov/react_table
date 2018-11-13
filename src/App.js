import React, {Component} from 'react';
import './App.css';
import Title from "./Title";
import TextAreaCounter from './TextAreaCounter';
import Excel from "./excel/Excel";





class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Title name={'Bob'}/>
                <TextAreaCounter />
                <Excel />
            </div>
        );
    }
}


export default App;
