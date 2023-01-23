import * as React from 'react';
import { ReactComponent as ShareIcon } from 'iconoir/icons/copy.svg';

import Icon from '../Icon';
import './ShareCopy.css';

function ShareCopy() {
  return (
    <button
      className="ShareCopy_button"
      onClick={() => {
        handleCopy(window.location.href);
      }}
      type="button"
      title="Copy Route"
    >
      <Icon className="ShareBar_item" label="Copy Route">
        <ShareIcon />
      </Icon>
    </button>
  );
}

function handleCopy(content) {
  navigator.permissions
    .query({ name: 'clipboard-write' })
    .then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(content);
      }
    })
    .catch((e) => {
      console.error('Error copying route to clipboard.');
      console.error(e);
    });
}

export default ShareCopy;
