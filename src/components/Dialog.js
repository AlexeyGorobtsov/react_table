import React, {Component} from 'react';

import PropTypes from 'prop-types';
import Button from './Button';
import '../css/dialog.css';

class Dialog extends Component {
    componentWillUnmount() {
        document.body.classList.remove('DialogModalOpen');
    }

    componnentDidMount() {
        if (this.props.modal) {
            document.body.classList.add('DialogModalOpen');
        }
    }

    render() {
        return (
            <div
                className={
                    this.props.modal
                        ? 'Dialog DialogModal'
                        : 'Dialog'
                }
            >
                <div
                    className={
                        this.props.modal
                            ? 'DialogModalWrap'
                            : null
                    }
                >
                    <div className={'DialogHeader'}>
                        {this.props.header}
                    </div>
                    <div className={'DialogBody'}>
                        {this.props.children}
                    </div>
                    <div className={'DialogFooter'}>
                        {this.props.hasCancel
                            ? <span
                                className={'DialogDismiss'}
                                onClick={this.props.onAction.bind(this, 'dismiss')}
                            >
                                Cancel
                            </span>
                            : null
                        }
                        <Button
                            onClick={this.props.onAction.bind(this, this.props.hasCancel
                                ? 'confirm'
                                : 'dismiss'
                            )}
                        >
                            {this.props.confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

Dialog.porpTypes = {
    header: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string,
    modal: PropTypes.bool,
    onAction: PropTypes.func,
    hasCancel: PropTypes.bool
};

Dialog.defaultProps = {
    confirmLabel: 'ok',
    madal: false,
    onAction: () => {},
    hasCancel: true,
};

export default Dialog;