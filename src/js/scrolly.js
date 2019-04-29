import enterView from "enter-view";
import Map from './map.js';
import lineChart from './lineChart';
import scatterPlot from './scatterPlot';

let dataAttr = 0;
let crimeData, geoData, crimeDataWithoutDC;
console.log('!!!scrolly!!!');
const sel = '.graphic_scrolly_content';
function init(geo, data) {
  console.log('scrolly init');
  crimeData = data;
  geoData = geo;
  crimeDataWithoutDC = crimeData.filter(t=> t.state!='District of Columbia');

  enterView({
    selector: sel,
    offset: 0.5,
    enter: el => {
      dataAttr= +(d3.select(el).attr('data-attr')) ;
      d3.select(el).classed('active', true);
      console.log('enter: ', dataAttr);
      updateGraphic( dataAttr );
      return
    },
    progress: (el, progress)=>{
      const percent = +(progress.toFixed(2));
      return
    },
    exit: el => {
      dataAttr= (+ (d3.select(el).attr('data-attr'))-1)>0? (+ (d3.select(el).attr('data-attr'))-1): 0;
      updateGraphic( dataAttr );
      return
    }
  });
}

function updateGraphic(attr) {
  switch (attr) {
    case 0:
      Map.updateMapColor(crimeDataWithoutDC, 'hate_splc');
      highlightChangeColor(geoData, crimeDataWithoutDC, '#scrolly_content_0', 'hate_splc');
      // highlightZoom(geoData, '#scrolly_content_0');

      break;
    case 1:
      Map.updateMapColor(crimeDataWithoutDC, 'hate_fbi');
      highlightChangeColor(geoData, crimeDataWithoutDC, '#scrolly_content_1', 'hate_fbi');

      break;
    case 2:
      Map.init(geoData, crimeData);
      Map.updateMapColor(crimeDataWithoutDC, 'hate_fbi');
      highlightChangeColor(geoData, crimeDataWithoutDC, '#scrolly_content_2', 'hate_fbi');
      break;
    case 3:
      Map.updateMapColor(crimeDataWithoutDC, 'hate_fbi');
      scatterPlot.init(geoData, crimeData, 'vote', 'hate_fbi');
      break;

    case 4:
      scatterPlot.init(geoData, crimeData, 'vote', 'hate_fbi');
      scatterPlot.highlightState(['Massachusetts', 'New Jersey']);
      break;
    case 5:
      scatterPlot.init(geoData, crimeData, 'degree', 'hate_fbi');
      scatterPlot.highlightState(['Massachusetts', 'North Dakota']);
      break;
      // scatterPlot.highlightState(['Massachusetts']);
    case 6:
      scatterPlot.init(geoData, crimeData, 'noncitizen', 'hate_fbi');
      scatterPlot.highlightState(['South Dakota', 'North Dakota']);
      break;

    default:
      break;
  }
}

function highlightZoom(geoData, id) {
  const highlights = d3.select(id).selectAll('.highlight').nodes();
  highlights.forEach( h=>{
    const state = d3.select(h).html();
    let path;
    d3.select(h).on('mouseover', function() {
      path = geoData.features.filter(t=> t['properties']['name'] == state );
      Map.zoomToState(path[0]);
    }).on('mouseout', function() {
      Map.zoomToState(path[0]);
    })
  });
}

function highlightChangeColor(geoData, crimeData, id, attr) {
  const highlights2 = d3.select(id).selectAll('.highlight').nodes();
  highlights2.forEach( h=>{
    let path;
    d3.select(h).on('mouseover', function() {
      const state = d3.select(h).html();
      path = geoData.features.filter(t=> t['properties']['name'] == state );
      Map.updateMapColor(crimeData, attr, [state])
    }).on('mouseout', function() {
      Map.updateMapColor(crimeData, attr)
    })
  });
}

export default { init }
