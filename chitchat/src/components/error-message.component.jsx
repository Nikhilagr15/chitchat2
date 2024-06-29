import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default ErrorMessage;
