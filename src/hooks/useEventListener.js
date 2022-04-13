import { useEffect, useRef } from 'react';

export default function useEventListener(element, eventName, handler) {
  const handlerRef = useRef();

  useEffect(() => {
    // update the ref so we don't have to add/remove listeners if the handler changes
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!element) return;
    const callback = (evt) => handlerRef.current(evt);
    element.addEventListener(eventName, callback);
    return () => {
      if (!element) return;
      element.removeEventListener(eventName, callback);
    };
  }, [element, eventName]);
}
