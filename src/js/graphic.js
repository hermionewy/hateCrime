/* global d3 */

import Stickyfill from 'stickyfilljs';
import Scrolly from './scrolly';
import Map from './map';
import dropdown from './dropdown';

console.log('!!!graphic!!!');
function resize() {
	console.log('graphic resize');
	Map.resize();
}

function init( geo, data) {
	console.log('graphic init');
  const elements = document.querySelectorAll('.sticky');
  Stickyfill.add(elements);
  Scrolly.init(geo, data);
  Map.init(geo, data);
  dropdown.init(data);
}

export default { init, resize };
