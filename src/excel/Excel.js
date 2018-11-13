import React, {Component} from 'react';
import Thead from './Thead';
import datafile from '../data';
import Tbody from './Tbody';
import Fancylink from './FancyLink';
import gr from '../greeting';


const {headers, data} = datafile;

const attr = {
    href: 'http://example.org',
    target: '_blank',
};


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
            <div className={'parent'}>
                {/*{gr}*/}
                {/*<textarea defaultValue={'hello\nworld'}*/}
                {/*onChange={this.log}*/}
                {/*></textarea>*/}
                {/*<textarea onChange={this.log}*/}
                {/*>hello*/}
                {/*world</textarea>*/}
                {/*<textarea onChange={this.log}*/}
                {/*>*/}
                {/*{'hello\nworld'}*/}
                {/*</textarea>*/}
                {/*<select defaultValue={'move'}>*/}
                {/*<option value="stay">I stay</option>*/}
                {/*<option value={'move'}>or should I go</option>*/}
                {/*</select>*/}
                <select defaultValue={['stay', 'move']} multiple={true}>
                    <option value="stay">Should I stay</option>
                    <option value="move">or should I go</option>
                    <option value="trouble">If I stay it will be</option>
                </select>
                <input type="text"
                    onChange={this.log}
                    defaultValue={'hello'}
                />
                <Fancylink {...attr}>test</Fancylink>
                <Tbody initialData={data} headers={headers}/>
            </div>
        );
    }
}

export default Excel;