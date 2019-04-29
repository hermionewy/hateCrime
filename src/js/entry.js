/* global d3 */
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import graphic from './graphic';
import getSize from './getSize';

const $body = d3.select('body');
let previousWidth = 0;
console.log('!!!entry!!!');
function resize() {
	// only do resize on width changes, not height
	// (remove the conditional if you want to trigger on height change)
	const width = $body.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
    getSize.resize();
		graphic.resize();
	}
}

function setupStickyHeader() {
	const $header = $body.select('header');
	if ($header.classed('is-sticky')) {
		const $menu = $body.select('.header__menu');
		const $toggle = $body.select('.header__toggle');
		$toggle.on('click', () => {
			const visible = $menu.classed('is-visible');
			$menu.classed('is-visible', !visible);
			$toggle.classed('is-visible', !visible);
		});
	}
}

function init() {
	// add mobile class to body tag
	$body.classed('is-mobile', isMobile.any());
	// setup resize event
	window.addEventListener('resize', debounce(resize, 150));
	// setup sticky header menu
	setupStickyHeader();
	// kick off graphic code

  d3.queue(2)
    .defer(d3.json, "assets/data/us-states.json")
    .defer(d3.csv, "assets/data/hateCrimeWithRank.csv", parseCSV)
    .await( (err, geo, data)=>{
      console.log(geo);
      console.log(data);
      const crimeDataWithoutDC = data.filter(t=> t.state!='District of Columbia'&&t.state!='Puerto Rico');
      graphic.init(geo, crimeDataWithoutDC);
    } );

  function parseCSV(d) {
    return {
      'state': d['state'],
      'income': +d['median_household_income'],
      'income_rank': +d['income_rank'],
      'unemployed': +d['share_unemployed_seasonal'],
      'unemployed_rank': +d['unemployed_rank'],
      'metro': +d['share_population_in_metro_areas'],
      'degree': +d['share_population_with_high_school_degree'],
      'noncitizen': +d['share_non_citizen'],
      'poverty': +d['share_white_poverty'],
      'gini': +d['gini_index'],
      'nonwhite':+d['share_non_white'],
      'vote': +d['share_voters_voted_trump'],
      'hate_splc': +d['hate_crimes_per_100k_splc'],
      'hate_fbi': +d['avg_hatecrimes_per_100k_fbi']
    }
  }
}

init();
