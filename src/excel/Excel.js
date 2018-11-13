import React, {Component} from 'react';
import Thead from './Thead';
import  datafile from '../data';
import Tbody from './Tbody';
const {headers, data} = datafile;

class Excel extends Component {
    constructor(props) {
        super(props);
        //this.state = this.handle
    }

    getCellIndex(e) {
        const obj = {cellIndex: e.target.cellIndex};
        // console.log(obj);
    }

    render() {
        // console.log('Excel', this);
        return(
            <div>
                <Tbody initialData={data} headers={headers} />
            </div>
        );
    }
}

export default Excel;