import React, {Component} from 'react';
import PropTypes from 'prop-types';
// console.log(PropTypes)
class Title extends Component {
    constructor(props) {
        super(props)
    }
    render(){
// console.log(this);
        return(
            <div>Hello</div>
        )
    }
}

Title.propTypes = {
    name: PropTypes.string.isRequired
};
export default Title;