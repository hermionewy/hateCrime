import Map from './map';

const div = document.getElementById("myDropdown");
const a = div.getElementsByTagName("a");
const input = document.getElementById("myInput");
const dropdownData =[
  {'attr': 'income', 'desp': 'Median household income'},
  {'attr': 'unemployed', 'desp': 'Share unemployed seasonal'},
  {'attr': 'metro', 'desp': 'Share population in metro areas'},
  {'attr': 'degree', 'desp': 'Share population with high school degree'},
  {'attr': 'noncitizen', 'desp': 'Share non citizen'},
  {'attr': 'poverty', 'desp': 'Share white poverty'},
  {'attr': 'gini', 'desp': 'Gini index'},
  {'attr': 'nonwhite', 'desp': 'Share non white'},
  {'attr': 'vote', 'desp': 'Share voters voted trump'},
  {'attr': 'hate_splc', 'desp': 'Hate crimes per 100k splc'},
  {'attr': 'hate_fbi', 'desp': 'Avg hatecrimes per 100k fbi'},
];
const mapping = d3.map(dropdownData, d=>d.desp);
function init(crimeData){

  input
    .onmouseover =function () {
    d3.select('.myDropdownList').classed('show', true);
  };
  input
    .onclick =function (e) {
    d3.selectAll('.dept_list').style('display', '');
    d3.select('#myDropdownList').classed('show', true);
  };
  updateDropdownList(crimeData);


  input.onkeyup = function () {
    d3.select('.myDropdownList').classed('show', true);
    filterFunction();
  };

}

function updateDropdownList(crimeData) {
  const listSelect = d3.select('#myDropdownList')
    .selectAll('.dept_list')
    .data(dropdownData);

  const listEnter = listSelect
    .enter()
    .append('a')
    .attr('class', 'dept_list');

  listSelect.merge(listEnter)
    .html(t=> t.desp);

  listSelect.exit().remove();

  clickOnA(crimeData);
}

function filterFunction() {
  let filter, i;
  filter = input.value.toUpperCase();
  for (let i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
    //a[0].style.display = ""; // this is used to show the first option like "All" or "average". Disabled here.
  }
}
function clickOnA(data) {
  document.getElementById('content').onclick = function (e) {
    if(e.target.id !='myDropdownList'&& e.target.id!='myInput'){
      d3.select('#myDropdownList').classed('show', false);
    }
  };
  for (let i = 0; i < a.length; i++) {
    const Acontent = a[i].innerHTML;
    a[i].onclick = function(e){
      input.value = Acontent;
      Map.updateMapColor(data, (mapping.get(Acontent))['attr']);
      // const geoId = a[i].getAttribute('data-id');
      // const divId = 'area'+ geoId;
      // const filteredData = data.filter( town=> town['geoid2'] == geoId );
      // topList.listClicked(filteredData[0], i);
      // const targetElem = document.getElementById(divId),
      //   containerElem= document.getElementById('topListDiv');
      // scrollToTarget(targetElem, containerElem);
      //
      // d3.selectAll('.list-title').classed('active', false);
      // d3.select('#'+divId).select('.list-title').classed('active', true);
      // d3.select('#myDropdownList').classed('show', false);
      //
      // d3.selectAll('.list-desp').classed('active', false);
      // d3.select('#'+divId).select('.list-desp').classed('active', true );
    }
  }
}

export default {init}
