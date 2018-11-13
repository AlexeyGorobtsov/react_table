import React, {Component} from 'react';

class FancyLink extends Component {
    constructor(props) {
        super(props);
        console.log(this);
    }
    render() {
        const attr = this.props;
        return(
            <a {...attr} >{this.props.children}</a>
        );
    }
}

export default FancyLink;