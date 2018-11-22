import React, {Component} from 'react';
import exelCss from './excel.css';
import Thead from './Thead';
// import datafile from '../data';
import Tbody from './Tbody';
import Fancylink from './FancyLink';
import '../css/excel.css'

let headers = localStorage.getItem('headers');
// let data = localStorage.getItem('data');
//
// if(!headers) {
//     headers = datafile.headers;
//     data = datafile.data;
// }





class Excel extends Component {
    constructor(props) {
        super(props);
        //this.state = this.handle
    }

    getCellIndex(e) {
        const obj = {cellIndex: e.target.cellIndex};
        // console.log(obj);
    }

    log(event) {
        console.log('value', event.target.value);
        console.log('defaultvalue', event.target.defaultValue);
        console.log(event.target);
    }

    render() {
        // console.log('Excel', this);
        return (
            <div className={'Excel'}>
                <Tbody
                    initialData={this.props.initialData}
                    schema={this.props.schema}
                    onDataChange={this.props.onDataChange}
                />
            </div>
        );
    }
}

export default Excel;