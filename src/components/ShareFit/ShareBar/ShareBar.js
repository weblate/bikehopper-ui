import * as React from 'react';

import ShareCopy from '../ShareCopy';
import ShareFit from '../ShareFit';

import './ShareBar.css';

// TODO: Determine if we are mobile or not.  If so mount different methods of sharing.
// For now though, just keep it desktop oriented.
function ShareBar() {
  return (
    <div className="ShareBar">
      <ShareCopy />
      <ShareFit />
    </div>
  );
}

export default ShareBar;
