import * as React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import BikehopperMap from './BikehopperMap';
import BottomPane from './BottomPane';
import DirectionsNullState from './DirectionsNullState';
import RoutesOverview from './RoutesOverview';
import SearchAutocompleteDropdown from './SearchAutocompleteDropdown';
import TopBar from './TopBar';
import {
  LocationSourceType,
  locationInputFocused,
} from '../features/locations';
import useEventListener from '../hooks/useEventListener';

import './App.css';

function App() {
  const { hasRoutes, hasLocations, isEditingLocations } = useSelector(
    (state) => ({
      hasLocations: !!(
        state.locations.end ||
        (state.locations.start &&
          state.locations.start.source !== LocationSourceType.UserGeolocation)
      ),
      hasRoutes: !!state.routes.routes,
      isEditingLocations: state.locations.editingLocation != null,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const handleBottomInputFocus = (evt) => {
    dispatch(locationInputFocused('end'));
  };

  let bottomContent;
  if (isEditingLocations) {
    bottomContent = <SearchAutocompleteDropdown />;
  } else if (hasRoutes) {
    bottomContent = <RoutesOverview />;
  } else if (!hasLocations) {
    bottomContent = (
      <DirectionsNullState onInputFocus={handleBottomInputFocus} />
    );
  }

  const showMap = !isEditingLocations;

  // Shrink when virtual keyboard is hiding content, so you can't be scrolled down
  //const [visualViewportHeight, setVisualViewportHeight] = React.useState(null);
  const viewportHandler = function (evt) {
    //setVisualViewportHeight(window.visualViewport.height);
    document.body.style.height = `${window.visualViewport.height}px`;
  };
  useEventListener(window.visualViewport, 'scroll', viewportHandler);
  useEventListener(window.visualViewport, 'resize', viewportHandler);
  const styleObj = null; //visualViewportHeight && {
  //  height: `${visualViewportHeight}px`,
  //};

  return (
    <div className="App" style={styleObj}>
      <TopBar
        showSearchBar={isEditingLocations || hasLocations || hasRoutes}
        initiallyFocusDestination={isEditingLocations}
      />
      <BikehopperMap hidden={!showMap} />
      {bottomContent && (
        <BottomPane withoutMap={!showMap}>{bottomContent}</BottomPane>
      )}
    </div>
  );
}

export default App;
