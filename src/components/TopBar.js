import * as React from 'react';
import Icon from './Icon';
import SearchBar from './SearchBar';
import { ReactComponent as InfoEmpty } from 'iconoir/icons/info-empty.svg';

import './TopBar.css';

export default function TopBar({ showSearchBar, showDirectionsLabel }) {
  const logoAndInfoButton = (
    <div className="TopBar_logoAndInfoButton">
      <span className="TopBar_logo">
        <span className="TopBar_logoBike">Bike</span>
        <span className="TopBar_logoHopper">Hopper</span>
      </span>
      <Icon className="TopBar_info" label="Info">
        <InfoEmpty />
      </Icon>
    </div>
  );

  return (
    <div className="TopBar">
      {!showSearchBar && logoAndInfoButton}
      {showSearchBar && showDirectionsLabel && (
        <h2 className="TopBar_getDirections">Get directions</h2>
      )}
      {showSearchBar && (
        <SearchBar initiallyFocusDestination={showDirectionsLabel} />
      )}
    </div>
  );
}