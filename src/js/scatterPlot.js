console.log('!!!scatter plot!!!');
import getSize from './getSize';

let mapping=d3.map();
const size = getSize.init();
const width = size.w, height = size.h, margin = size.m;
const innerWidth = width - margin.l - margin.r;
const innerHeight = height - margin.t - margin.b;
const mainColor = '#1e2c5b';
function init(geoData, crimeData, xAttr, yAttr) {
  const svg = d3.select('.mapSVG');

  let xExtent = d3.extent(crimeData, d=>d[xAttr]);
  let yExtent = d3.extent(crimeData, d=>d[yAttr]);
  // if(xExtent[1]<=1 && xExtent[0]>0){
  //   xExtent =[0, xExtent[1]]
  // }
  // if(yExtent[1]<=1 && yExtent[0]>0){
  //   yExtent = [0, yExtent[1]]
  // }

  const scaleX = d3.scaleLinear()
    .domain( xExtent )
    .range([width/3, width*0.9]);
  const scaleY = d3.scaleLinear()
    .domain(yExtent)
    .range([height*0.8, height*0.2]);

  mapping = d3.map(crimeData, d=>d.state);
  const NJ =  mapping.get('New Jersey');
  const statePath = svg.selectAll('.statePath')
      .data(geoData.features);
  const stateEnter = statePath
      .enter()
      .append('path')
      .attr('class', 'statePath');
  statePath.exit().remove();

  statePath.merge(stateEnter)
    .attr('d', d=>{
      const stateData = mapping.get(d.properties.name);
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(6);
      return arcGenerator( { startAngle:0, endAngle:Math.PI*2 } );
    })
    .transition()
    .duration(700)
    .attr('transform', function(d,i) {
      const stateData = mapping.get(d.properties.name);
      if(stateData){
        return `translate(${ scaleX(stateData[xAttr]) }, ${scaleY( stateData[yAttr] )})`;
      }
      return `translate(0, 0)`;
    })
    .attr('stroke-dasharray', '0 0')
    .transition()
    .duration(700);

  d3.selectAll('.xAxis')
    .classed('active', true)
    .attr('transform', `translate( 0, ${height*0.2} )`)
    .call(d3.axisBottom(scaleX).tickSize(height*0.6).ticks(5));

  d3.selectAll('.yAxis')
    .classed('active', true)
    .attr('transform', `translate( ${width/3}, 0 )`)
    .call(d3.axisLeft(scaleY).tickSize(0));

  const xLabelG= d3.selectAll('.xLabel').classed('active', true);
  const xLabelSelect = xLabelG
    .selectAll('.xLabelText')
    .data([1]);
  const xLabelEnter = xLabelSelect.enter()
    .append('text')
    .attr('class', 'xLabelText');

  xLabelSelect.merge(xLabelEnter)
    .attr("x", width*0.4)
    .attr("y", height*0.8+50)
    .attr("dx", "0.32em")
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .text(getLabel(xAttr));

  const yLabelG= d3.selectAll('.yLabel').classed('active', true)
  const yLabelSelect = yLabelG
    .selectAll('.yLabelText')
    .data([1]);
  const yLabelEnter = yLabelSelect.enter()
    .append('text')
    .attr('class', 'yLabelText');

  yLabelSelect.merge(yLabelEnter)
    .attr("transform", "rotate(-90)")
    .attr("y", width/3-60)
    .attr("x", - (height / 2))
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text(getLabel(yAttr));

}

function getLabel(attr) {
  const labelContent={
    'income': 'Median household income',
    'vote': 'Percent of the population voted for Donald Trump',
    'degree': 'Percent of adults 25 and older with at least a high school degree',
    'unemployment': '2016 seasonally adjusted unemployment',
    'nonwhite': 'Percent poverty among white people',
    'noncitizen': 'Percent noncitizen population',
    'metro': 'Percent population in metropolitan areas',
    'poverty': 'Percent poverty among white people',
    'hate_fbi': 'Average annual hate crimes per 100,000 residents',
  };

  return labelContent[attr]
}

function highlightState(arr=[]) {
  d3.selectAll('.statePath')
    .attr('stroke', mainColor)
    .attr('stroke-width', '1')
    .attr('stroke-dasharray', '0 0');

  arr.forEach(t=>{
    const tSlug = t.replace(' ', '_');
    d3.select('#'+tSlug)
      .attr('stroke', 'gold')
      .attr('stroke-width', '5')
      .attr('stroke-dasharray', '0 0');
  })
}
export default { init, highlightState }
