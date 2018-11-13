import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Counter extends  Component {
    constructor(props) {
        super(props);
        this.name = 'Counter';
    }

    shouldComponentUpdate(nextProps, nextState_ingore) {
        return nextProps.count !== this.props.count;
    }
    render() {
        // console.log(this.name + '::render()');
        return(
            <span>{this.props.count}</span>
        );
    }
}
Counter.propTypes = {
    count: PropTypes.number.isRequired
};
export default Counter;