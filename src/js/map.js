import isMobile from './utils/is-mobile';
const container =d3.select('#graphicContainer');
import pathMouseOver from './pathMouseOver';

let Width = +(container.style('width').slice(0, -2)), Height = +(container.style('height').slice(0, -2));
const Margin ={ t: 10, r: 10, b:10, l:10 };
let mapScale = isMobile.any()? 1.3*Width: 0.7*Width;
let projection = d3.geoAlbersUsa()
  .translate([Width/2, Height/2])
  .scale([mapScale]);

const mapColor = [
  '#f1eef6',
  '#bdc9e1',
  '#74a9cf',
  '#2b8cbe',
  '#045a8d',
];
// const mapColor = [
//   '#d01c8b',
//   '#f1b6da',
//   '#f7ed8e',
//   '#b8e186',
//   '#4dac26',
// ];
let pathProjection = d3.geoPath()
  .projection(projection);
const mainColor = '#1e2c5b';
let geoJson, crimeData;
let mapping=d3.map();

let centered;
function init(geo, data) {
  geoJson = geo;
  crimeData = data;

  mapping = d3.map(crimeData, d=>d.state);
  const NJ =  mapping.get('New Jersey');
  console.log(NJ);

  console.log('Width&Height: ', Width, Height);
  const svgSelect = container.selectAll('.mapSVG')
    .data([1]);
  const svgEnter = svgSelect.enter()
    .append('svg')
    .attr('class', 'mapSVG');

  svgEnter.append("g")
    .attr("class", "states");
  // svgEnter.append('g')
  //   .attr('class', 'circlesG');
  // svgEnter.append('g')
  //   .attr('class', 'routeG');
  svgEnter.append('g')
    .attr('class', 'xAxis');
  svgEnter.append('g')
    .attr('class', 'yAxis');
  svgEnter.append('g')
    .attr('class', 'xLabel');
  svgEnter.append('g')
    .attr('class', 'yLabel');

  const svg = svgSelect.merge(svgEnter)
    .attr('transform', 'translate(0, 0)')
    .attr('width', Width)
    .attr('height', Height);

  const stateG = svg.selectAll('.states')
  //.attr('transform', `translate(${Width/2}, ${Height/2})`)
    .attr('transform', `translate(${Margin.l}, ${Margin.t})`)
    .attr('height', Height-Margin.t-Margin.b)
    .attr('width', Width-Margin.l-Margin.r);



  const pathSelect = stateG
    .selectAll(".statePath")
    .data(geo.features, d=>d['id']);

  const pathEnter = pathSelect
    .enter()
    .append("path")
    .attr('id', d=>(d.properties['name']).replace(' ', '_'))
    .attr('class', 'statePath');

  const geoPath = pathSelect.merge(pathEnter);

  geoPath
    .transition()
    .duration(400)
    .attr('transform', 'translate(0, 0)')
    .attr("d", function(d) {
      return pathProjection(d)
    })
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.6)
    .attr('stroke-dasharray', '3 3')
    .attr('stroke', mainColor)
    .attr('opacity', 0.8);


  // geoPath.on('click', zoomToState);
  updateMapColor(crimeData, 'hate_splc');
  pathMouseOver.init(crimeData);
}

function updateMapColor( crimeData, attr, state=[]) {

  d3.select('.xAxis').classed('active', false);
  d3.select('.yAxis').classed('active', false);
  d3.select('.xLabel').classed('active', false);
  d3.select('.yLabel').classed('active', false);
  const min = d3.min(crimeData, d=>d[attr]|| Infinity);
  const max = d3.max(crimeData, d=>d[attr]);
  const colorFn = d3.scaleLinear().domain([min, max]).range([mapColor[0], mapColor[4]]);

  d3.selectAll(".statePath")
    // .transition()
    // .duration(400)
    .attr('fill', d=> {
      const stateName = d.properties.name;
      const stateData = mapping.get(stateName);
      if(stateData){
          return colorFn(stateData[attr])
      } else{
        return '#666'
      }
    }).attr('stroke', d=>{
    const stateName = d.properties.name;
      if(state.indexOf(stateName)>-1){
        return 'gold'
      } else{
        return mainColor
      }
  }).attr('stroke-dasharray', d=>{
    const stateName = d.properties.name;
    if(state.indexOf(stateName)> -1){
      return '0 0'
    } else{
      return '3 3'
    }
  }).attr('stroke-width', d=>{
    const stateName = d.properties.name;
    if(state.indexOf(stateName)> -1){
      return 5
    } else{
      return 1
    }
  })

}

function resize() {
  Width = +(container.style('width').slice(0, -2));
  Height = +(container.style('height').slice(0, -2));
  mapScale = isMobile.any()? 1.3*Width: Width;
  projection = d3.geoAlbersUsa()
    .translate([Width/2, Height/2])
    .scale([mapScale]);
  pathProjection = d3.geoPath()
    .projection(projection);
  init(geoJson, crimeData);
}

function zoomToState(d) {
  console.log(d);
    let x, y, k;

  if (d && centered !== d) {
    var centroid = pathProjection.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = Width / 2;
    y = Height / 2;
    k = 1;
    centered = null;
  }
  const statesG = d3.select('.states');

  statesG.selectAll(".statePath")
      .classed("active", centered && function(d) { return d === centered; });

  statesG.transition()
      .duration(750)
      .attr("transform", "translate(" + Width / 2 + "," + Height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}



export default { init, updateMapColor, resize, zoomToState }
