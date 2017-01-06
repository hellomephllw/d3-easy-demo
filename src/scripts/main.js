import * as d3 from 'd3';

let pEle = d3.select('#p');

d3.selectAll('div').filter('.abc').classed('abc bbb');

let myclass = d3.selectAll('div').filter('.abc').classed('abc');

console.log(myclass);
