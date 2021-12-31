import { Button } from '@alifd/next';
import React from 'react';

export default ({ to = '', children = undefined, ...otherProps } = {}) => {
  const shell = window.require && window.require('electron')?.shell;

  return (
    shell ? (
      <Button
        text
        type="primary"
        onClick={() => {
          shell.openExternal(to);
        }}
        {...otherProps}
      >
        {children}
      </Button>
    ) : (
      <a
        href={to}
        {...otherProps}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    )
  );
};
