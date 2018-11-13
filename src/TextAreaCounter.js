import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Counter from './Counter';

// console.log(React)
class TextAreaCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {text: props.text};
        this._textChange = this._textChange.bind(this);
        this._log = this._log.bind(this);
        this.name='TextAreaCounter';
        // console.log(this);
    }

    _log(methodName, args) {
        // console.log(methodName, args);
    }

    componentWillUpdate() {
        this._log('componentWillUpdate', arguments);
    }

    componentDidUpdate(oldProps, oldState) {
        if(this.state.text.length > 3) {
        }
        this._log('componentDidUpdate', arguments);
    }
    componentWillMount() {
        this._log('componentWillMount', arguments);
    }
    componentDidMount() {
        this._log('componentDidMount', arguments);
    }
    componentWillUnmount() {
        this._log('componentWillUnmount', arguments);
    }

    _textChange(ev) {
        this.setState({
            text:ev.target.value
        });
    }

    render() {
        // console.log(this.name + '::render()');
        return(
            <div>
                <textarea
                    defaultValue={this.state.text}
                    onChange={this._textChange}
                ></textarea>
                <h3><Counter count={this.state.text.length}/></h3>
            </div>
        );
    }
}
TextAreaCounter.propTypes = {
    text: PropTypes.string
};

TextAreaCounter.defaultProps = {
    text: 'bsd'
};

export default TextAreaCounter;