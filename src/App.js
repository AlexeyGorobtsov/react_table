import React, {Component} from 'react';
import './App.css';
import Title from './Title';
import TextAreaCounter from './TextAreaCounter';
import Excel from './excel/Excel';
import Whinepad from './components/Whinepad';
import schema from './source/schema';

let data = JSON.parse(localStorage.getItem('data'));

if (!data) {
    data = {};
    schema.forEach(item => data[item.id] = item.sample);
    data = [data];
    console.log('data', data);
}
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={'app-header'}>
                    {/*<Title name={'Bob'}/>*/}
                    <TextAreaCounter />
                    Welcom to Winepad!
                </div>
                <Whinepad schema={schema} initialData={data} />
            </div>
        );
    }
}


export default App;
