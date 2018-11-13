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
        this._replay = this._replay.bind(this);
        this._log = [];
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
        this._logSetState({
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
        this._logSetState({
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
        this._logSetState({
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
            this._logSetState({
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
        this._logSetState({data: searchdata});
    }

    _logSetState(newState) {
        this._log.push(JSON.parse(JSON.stringify(
            this._log.length === 0 ? this.state : newState
        )));
        this.setState(newState);
    }

    componentDidMount() {
        document.onkeydown = function(e) {
            if (e.altKey && e.shiftKey && e.keyCode === 82) {
                this._replay();
            }
        }.bind(this);
    }

    _replay() {
        console.log(this);
        if (this._log.length === 0) {
            console.warn('Состояние для проигрывания отсутствует');
            return;
        }
        let idx = -1;
        const interval = setInterval(function() {
            idx++;
            if (idx === this._log.length - 1) {
                clearInterval(interval);
            }
            this.setState(this._log[idx]);
        }.bind(this), 1000);
    }

    _download(format, ev) {
        let contents = format === 'json'
            ? JSON.stringify(this.state.data)
            : this.state.data.reduce((result, row) => {
                return result
                + row.reduce((rowresult, cell, idx) => {
                    console.log('rowresult', rowresult);
                    return rowresult
                        + '"'
                        + cell.replace(/"/g, '""')
                        +'"'
                        + (idx < row.length - 1 ? ',' : '');
                }, '')
                + '\n';
            }, '');
        const URL = window.URL || window.webkitURL;
        const blob = new Blob([contents], {type: 'text/' + format});
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = 'data.' + format;
    }

    _renderToolbar() {
        return(
            <div>
                <button
                    onClick={this._toggleSearch}
                    className={'toolbar'}
                >
                    {this.state.search ? 'search in progress' : 'search'}
                </button>
                <a
                    href="data.json"
                    onClick={this._download.bind(this, 'json')}
                >
                    Export JSON
                </a>
                <a onClick={this._download.bind(this, 'csv')}
                    href='data.csv'
                >
                    Export CSV
                </a>
            </div>
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
