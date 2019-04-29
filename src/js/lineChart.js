import getSize from './getSize';

const size = getSize.init();
const width = size.w, height = size.h, margin = size.m;
const innerWidth = size.w-margin.l-margin.r, innerHeight = size.h-margin.t-margin.b;
let crimeData;
let mapping=d3.map();
function lineGenerator(obj, xScale, yScale) {
  const arr = getLineObj( obj, ['income_rank', 'poverty_rank', 'degree_rank', 'vote_rank'] );
  console.log('lineGenerator: ', arr);
  let line = d3.line()
    .y(d => {
      console.log('line!!!!!!!!!!!', d);
      return yScale(d['value'])
    })
    .x((d, i) => xScale(i))
    .curve(d3.curveMonotoneY);
  console.log( 'lineGenerator: ', line(arr));
  return line(arr.value)
}

function init(data) {
  console.log(data);
  crimeData = data;
  mapping = d3.map(data, d=>d.state);
  console.log('InnerSizes: ', innerWidth, innerHeight);
  const svg = d3.select('.mapSVG');
  const stateG = svg.selectAll('.states');
  const allPath = stateG.selectAll(".statePath");
  console.log('line chart init');
  const xScale = d3.scaleLinear().domain([0, 5]).range([margin.l, innerWidth]);
  const yScale = d3.scaleLinear().domain([0, 51]).range([innerHeight, margin.t]);
  allPath
    .attr('d', d=>lineGenerator(d, xScale, yScale))
    .attr('fill', 'none')
    .attr('stroke-dasharray', '0 0')
}

function getLineObj(obj, attrs=[]) {
  const name = obj.properties['name'];
  const newObj = mapping.get(name);
  let arr=[];
  if(newObj){
    attrs.forEach( attr=>{
      arr.push( {'attr': attr, 'value': newObj[attr] } )
    });
    return {
      'state': name,
      'value': arr
    }
  } else {
    return {
      'state': name,
      'value': arr
    }
  }
}

export default { init }
