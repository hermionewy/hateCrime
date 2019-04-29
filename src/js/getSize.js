const container =d3.select('#graphicContainer');
let Width = +(container.style('width').slice(0, -2)),
  Height = +(container.style('height').slice(0, -2));
const Margin ={ t: 10, r: 10, b:10, l:10 };

function init() {
  return { 'w': Width, 'h': Height, 'm': Margin }
}

function resize() {
  Width = +(container.style('width').slice(0, -2));
  Height = +(container.style('height').slice(0, -2));
  return { 'w': Width, 'h': Height, 'margin': Margin }
}
export default { init }
