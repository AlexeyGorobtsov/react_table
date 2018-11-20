import React, {Component} from 'react';
import Actions from '../components/Actions';
import Dialog from '../components/Dialog';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Rating from '../components/Rating';
import classNames from 'classnames';
import PropType from 'prop-types';
import Thead from './Thead';
import datafile from '../data';
import schema from '../source/schema';
const {headers, data} = datafile;

class Tbody extends Component {
    constructor(props) {
        super(props);
        this._preSearchData = null;
        // this.state = {data: this.props.initialData};
        this._sort = this._sort.bind(this);
        this._showEditor = this._showEditor.bind(this);
        this._save = this._save.bind(this);
        this._toggleSearch = this._toggleSearch.bind(this);
        this._search = this._search.bind(this);
        this._replay = this._replay.bind(this);
        this._log = [];
        this.state = {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null,
            dialog: null,
        };
        console.log(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.initialData});
    }

    _fireDataChange(data) {
        this.props.onDataChange(data);
    }

    _showEditor(e) {
        // console.log('row', parseInt(e.target.dataset.row, 10))
        // console.log('cell', e.target.cellIndex,)
        this.setState({
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                key: e.target.key,
            }
        });
    }

    _sort(key) {
        // const column = e.target.cellIndex;
        // const descending = this.state.sortby === column && !this.state.descending;
        // console.log('this.state.sortby',this.state.sortby)
        // console.log('column', column)
        // console.log('this.state.descending', this.state.descending);
        // console.log('descending', descending)
        // const data = this.state.data.slice();
        const data = Array.from(this.state.data);
        const descending = this.state.sortby === key
            && !this.state.descending;
        // const data = [...this.state.data];
        data.sort((a, b) => {
            return descending
                ? (a[key] < b[key] ? 1 : -1)
                : (a[key] > b[key] ? 1 : -1);

        });
        this.setState({
            data: data,
            sortby: key,
            descending: descending,
        });
        this._fireDataChange(data);
    }

    _save(e) {
        e.preventDefault();
        // const input = e.target.closest('form').querySelector('input');
        // const data = this.state.data.slice();
        // console.log(input)
        // console.log('input.value',input.value)
        // console.log('data', data)
        // console.log('this.state.edit.row', this.state.edit.row)
        // console.log('this.state.edit.cell',this.state.edit.cell)
        // console.log('data_change', data[this.state.edit.row][this.state.edit.cell])
        const value = this.refs.input.getValue();
        let data = Array.from(this.state.data);
        data[this.state.edit.row][this.state.edit.key] =value;
        this._logSetState({
            edit: null,
            data: data,
        });
        this._fireDataChange(data);
    }

    _actionClick(rowidx, action) {
        this.setState({dialog: {type: action, idx: rowidx}});
    }

    _deleteConfirmationClick(action) {
        if (action === 'dismiss') {
            this._closeDialog();
            return;
        }
        let data = Array.from(this.state.data);
        data.splice(this.state.dialog.idx, 1);
        this.setState({
            dialog: null,
            data: data,
        });
    }

    _closeDialog() {
        this.setState({dialog: null});
    }

    _saveDataDialog(action) {
        if (action === 'dismiss') {
            this._closeDialog();
            return;
        }
        let data = Array.from(this.state.data);
        data[this.state.dialog.idx] = this.refs.form.getData();
        this.setState({
            dialog: null,
            data: data,
        });
        this._fireDataChange(data);
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
            <div className={'toolbar'}>
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
                <Thead
                    schema={this.props.schema}
                    headers = {headers}
                    sort = {this._sort}
                    descending = {this.state.descending}
                    sortby = {this.state.sortby}
                    _sort={this._sort.bind(this)}
                />
                <tbody onDoubleClick={this._showEditor}>
                    {this.state.data.map((row, rowidx) => {
                        return (
                            <tr key={rowidx}>{
                                Object.keys(row).map((cell, idx) => {
                                    const schema = this.props.schema[idx];
                                    if (!schema || !schema.show) {
                                        return null;
                                    }
                                    const isRating = schema.type === 'rating';
                                    //  console.log(isRating)
                                    const edit = this.state.edit;
                                    console.log(row[cell])
                                    let content = row[cell];
                                    //console.log(row)
                                    //console.log('content', content)
                                    if (!isRating && edit && edit.row === rowidx && edit.key === schema.id) {
                                        content = (
                                            <form
                                                onSubmit={this._save}
                                            >
                                                <FormInput
                                                    ref={'input'} {...schema}
                                                    defaultValue={content}
                                                />
                                            </form>
                                        );
                                    } else if (isRating) {
                                        //console.log('number', (content))
                                        content = <Rating
                                            readonly={true}
                                            defaultValue={Number(content)}
                                            maxRating={Number(5)}
                                        />;
                                    }
                                    {console.log(content)}
                                    return (
                                        <td
                                            className={classNames({
                                                [`schema=${schema.id}`]: true,
                                                'ExcelEditable': !isRating,
                                                'ExcelDataLeft': schema.align === 'left',
                                                'ExcelDataRight': schema.align === 'right',
                                                'ExcelDataCenter': schema.align !== 'left' && schema.aligh !== 'right',
                                            })}
                                            key={idx}
                                            data-row={rowidx}
                                            data-key={schema.id}
                                        >
                                            {content}
                                        </td>
                                    );
                                }, this)}
                            <td className={'ExcelDataCenter'}>
                                <Actions
                                    onAction={this._actionClick.bind(this, rowidx)}
                                />
                            </td>
                            </tr>
                        );
                    }, this)}
                </tbody>
            </table>
        );
    }

    _renderDialog() {
        if (!this.state.dialog) {
            return null;
        }
        switch (this.state.dialog.type) {
        case 'delete':
            return this._renderDeleteDialog();
        case 'info':
            return this._renderFormDialog(true);
        case 'edit':
            return this._renderFormDialog();
        default:
            throw Error(`Unexpected dialog type ${this.state.dialog.type}`);
        }
    }

    _renderDeleteDialog() {
        const first = this.state.data[this.state.dialog.idx];
        const nameguess = first[Object.keys(first[0])];
        return (
            <Dialog
                modal={true}
                header={'Confirm deletion'}
                confimLable = 'Delete'
                onAction={ this._deleteConfirmationClick.bind(this)}
            >
                {`Are you sure you want to delete ${nameguess}?`}
            </Dialog>
        );
    }

    _renderFormDialog(readonly) {
        // console.log(this.state)
        return (
            <Dialog
                modal={true}
                header={readonly ? 'Item info' : 'Edit item'}
                confirmLabel={readonly ? 'ok' : 'Save'}
                hasCancel={!readonly}
                onAction={this._saveDataDialog.bind(this)}
            >
                <Form
                    ref={'form'}
                    fields={this.props.schema}
                    initialData={this.state.data[this.state.dialog.idx]}
                    readonly={readonly}
                />
            </Dialog>
        );
    }

    render() {
        return(
            <div>
                {this._renderTable()}
                {this._renderDialog()}
            </div>
        );
    }
}

Tbody.propTypes = {
    schema: PropType.arrayOf(
        PropType.object
    ),
    initialData: PropType.arrayOf(
        PropType.object
    ),
    onDataChange: PropType.func,
};

export default Tbody;
