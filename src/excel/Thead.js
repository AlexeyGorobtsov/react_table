import React, {Component} from 'react';


class Thead extends Component {
    constructor(props) {
        super(props);
        console.log(this);
        this.state = {
            descending: this.props.descending
        };
    }

    render() {
        const {sort, descending, sortby} = this.props;
        return (
            <thead>
                <tr>
                    {this.props.schema.map(item => {
                        if (!item.show) {
                            return null;
                        }
                        let title = item.label;
                        if (this.props.sortby === item.id) {
                            title += this.state.descending ? ' \u2191' : ' \u2193';
                        }
                        return (
                            <th
                                className={`schema-${item.id}`}
                                key={item.id}
                                onClick={this.props._sort.bind(this, item.id)}
                            >
                                {title}
                            </th>
                        );

                    }, this)
                    }
                    <th className={'ExcelNotSortable'}>Actions</th>
                </tr>
            </thead>
        );
    }
}

export default Thead;