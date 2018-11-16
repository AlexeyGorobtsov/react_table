import React, {Component} from 'react';
import Button from './Button';
import Dialog from './Dialog';
import Excel from '../excel/Excel';
import Form from './Form';
import PropTypes from 'prop-types';
//import Tbody from '../excel/Tbody'

class Whinepad extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.initialData,
            addnew: false,
        };
        this._preSearchData = null;

        console.log(this)
    }

    _addnewDialog() {
        this.setState({addnew: true});
    }

    _addNew(action) {
        if (action === 'dismiss') {
            this.setState({ addnew: false });
            return;
        }
        let data = Array.from(this.state.data);
        data.unshift(this.refs.form.getData());
        this.setState({
            addnew: false,
            data: data,
        });
        this._commitToStorage(data);
    }

    _onExcelDataChange(data) {
        this.setState({data: data});
        this._commitToStorage(data);
    }

    _commitToStorage(data) {
        localStorage.setItem('data', JSON.stringify(data));
    }

    _startSearching() {
        this.setState({
            data: this._preSearchData,
        });
    }

    _doneSearching() {
        this.setState({
            data: this._preSearchData,
        });
    }

    _search(e) {
        const needle = e.target.value.toLowerCase();
        if(!needle) {
            this.setState({data: this._preSearchData});
            return;
        }
        const fields = this.props.schema.map(item => item.id);
        const searchdata = this._preSearchData.filter(row => {
            for (let f = 0; f < fields.length; f++) {
                if (row[fields[f]].toString().toLowerCase()
                    .indexOf(needle) > -1) {
                    return true;
                }
            }
            return false;
        });
        this.setState({data: searchdata});
    }

    render() {
        return (
            <div className={'Whinepad'}>
                <div className={'WhinepadToolbar'}>
                    <div className={'WhinepadToolbarAdd'}>
                        <Button
                            onClick={this._addnewDialog.bind(this)}
                            className={'WhinepadToolbarAddButton'}
                        >
                            + add
                        </Button>
                    </div>
                    <div
                        className={'WhinepadToolbarSearch'}
                    >
                        <input
                            placeholder={'Search...'}
                            onChange={this._search.bind(this)}
                            onFocus={this._startSearching.bind(this)}
                            onBlur={this._doneSearching.bind(this)}
                        />
                    </div>
                </div>
                <div
                    className={'WhinepadDatagrid'}
                >
                    <Excel
                        schema={this.props.schema}
                        initialData={this.state.data}
                        onDataChange={this._onExcelDataChange.bind(this)}
                    />
                </div>
                {this.state.addnew
                    ? <Dialog
                        modal={true}
                        header={'Add new item'}
                        confirmLabel={'Add'}
                        onAction={this._addNew.bind(this)}
                    >
                        <Form
                            ref={'form'}
                            fields={this.props.scheme}/>
                    </Dialog>
                    : null
                }
            </div>
        );
    }
}

Whinepad.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.object
    ),
    initialData: PropTypes.arrayOf(
        PropTypes.object
    ),
};

export default Whinepad;
