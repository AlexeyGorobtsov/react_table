import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

function Button(props) {
    const cssclasses = classNames('Button', props.className);
    return props.href
        ? <a {...props} className={classNames('Button', props.className)} />
        : <button {...props} className={classNames('Button', props.className)}></button>;
}

Button.propTypes ={
    href: PropTypes.string,
};

export default Button;