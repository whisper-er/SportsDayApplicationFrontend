import React from 'react';
import '../Styles/ErrorBlock.css'

const ErrorBlock = ({ message }) => {
  if (!message) return null;

  return (
    <div class="error-msg">
      <i class="fa fa-times-circle"></i>
      {message}
    </div>
  );
};

export default ErrorBlock;