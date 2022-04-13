import * as React from 'react';
import classnames from 'classnames';
import useEventListener from '../hooks/useEventListener';

import './BottomPane.css';

export default function BottomPane(props) {
  // Handle collapsed address bar / virtual keyboard hiding content
  const [overlappedBottomPx, setOverlappedBottomPx] = React.useState(0);
  const viewportHandler = function (evt) {
    setOverlappedBottomPx(
      Math.max(
        0,
        window.innerHeight -
          window.visualViewport.height -
          window.visualViewport.offsetTop,
      ),
    );
  };
  useEventListener(window.visualViewport, 'scroll', viewportHandler);
  useEventListener(window.visualViewport, 'resize', viewportHandler);

  return (
    <div
      className={classnames({
        BottomPane: true,
        BottomPane__withoutMap: props.withoutMap,
      })}
      style={{
        paddingBottom: `max(${overlappedBottomPx}px, env(safe-area-inset-bottom))`,
      }}
    >
      <p>{overlappedBottomPx}px</p>
      {props.children}
    </div>
  );
}
