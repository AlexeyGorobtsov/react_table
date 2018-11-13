import React, {Component} from 'react';
import PropType from 'prop-types';
import Thead from './Thead';
import datafile from '../data';
const {headers, data} = datafile;

class Tbody extends Component {
    constructor(props) {
        super(props);
        this._preSearchData = null;
        this.state = {data: this.props.initialData};
        this._sort = this._sort.bind(this);
        this._showEditor = this._showEditor.bind(this);
        this._save = this._save.bind(this);
        this._toggleSearch = this._toggleSearch.bind(this);
        this._search = this._search.bind(this);
        console.log(this);
    }
    getInitialState() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null,
            search: false,
        };
    }

    _showEditor(e) {
        // console.log('row', parseInt(e.target.dataset.row, 10))
        // console.log('cell', e.target.cellIndex,)
        this.setState({
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                cell: e.target.cellIndex,
            }
        });
    }

    _sort(e) {
        const column = e.target.cellIndex;
        const descending = this.state.sortby === column && !this.state.descending;
        // console.log('this.state.sortby',this.state.sortby)
        // console.log('column', column)
        // console.log('this.state.descending', this.state.descending);
        // console.log('descending', descending)
        // const data = this.state.data.slice();
        const data = Array.from(this.state.data);
        // const data = [...this.state.data];
        data.sort((a, b) => {
            return descending
                ? (a[column] < b[column] ? 1 : -1)
                : (a[column] > b[column] ? 1 : -1);

        });
        this.setState({
            data: data,
            sortby: column,
            descending: descending,
        });
    }

    _save(e) {
        e.preventDefault();
        const input = e.target.closest('form').querySelector('input');
        const data = this.state.data.slice();
        // console.log(input)
        // console.log('input.value',input.value)
        // console.log('data', data)
        // console.log('this.state.edit.row', this.state.edit.row)
        // console.log('this.state.edit.cell',this.state.edit.cell)
        // console.log('data_change', data[this.state.edit.row][this.state.edit.cell])
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this.setState({
            edit: null,
            data: data,
        });
    }

    _renderSearch() {
        if (!this.state.search) {
            return null;
        }
        return (
            <tr onChange={this._search}>
                {this.props.headers.map((_ignore, idx) => <td key={idx}><input type='text' data-idx={idx}/></td>)}
            </tr>
        );
    }

    _renderTable() {
        return(
            <table>
                <Thead headers = {headers}
                    sort = {this._sort}
                    descending = {this.state.descending}
                    sortby = {this.state.sortby}
                />
                <tbody onDoubleClick={this._showEditor}>
                    {this._renderSearch()}
                    {this.state.data.map((row, i) =>
                        <tr key={i}>
                            {row.map((cell, ind) => {
                                let content = cell;

                                const edit = this.state.edit;
                                if (edit && edit.row === i && edit.cell === ind ) {
                                    content = <form>
                                        <input defaultValue={content} />
                                        <button onClick={this._save}>Save</button>
                                    </form>;
                                }
                                return <td key={ind} data-row={i}>{cell, content}</td>;
                            })
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    _toggleSearch() {
        // console.log(this)
        if (this.state.search) {
            this.setState({
                data: this._preSearchData,
                search: false,
            });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this.setState({
                search: true,
            });
        }
    }

    _search(e) {
        const needle = e.target.value.toLowerCase();
        // console.log('neddle', needle);
        if(!needle) {
            this.setState({
                data: this._preSearchData
            });
            return;
        }
        const idx = e.target.dataset.idx;
        // console.log('idx', idx);
        // console.log('this._preSearchData', this._preSearchData)
        const searchdata = this._preSearchData.filter(row => {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });
        this.setState({data: searchdata});
    }

    _renderToolbar() {
        return(
            <button
                onClick={this._toggleSearch}
                className={'toolbar'}
            >search</button>
        );
    }

    render() {
        return(
            <div>
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    }
}

Tbody.propTypes = {
    initialData: PropType.arrayOf(
        PropType.arrayOf(
            PropType.string
        )
    )
};

export default Tbody;
