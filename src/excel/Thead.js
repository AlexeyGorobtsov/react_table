import React, {Component} from 'react';


class Thead extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {sort, descending, sortby} = this.props;
        return (
            <thead onClick={sort}>
                <tr>
                    {this.props.headers.map((title, i) => <th key={i}>
                        {(sortby === i) ?
                            (title += descending ? ' \u2193' : ' \u2191') : title
                        }</th>)
                    }
                </tr>
            </thead>
        );
    }
}

export default Thead;