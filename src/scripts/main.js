let d3 = require('d3');

let width = 600,
    height = 600;

//svg
let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

//线性比例尺
let xScale = d3.scale.linear()
    .domain([0, 10])
    .range([0, 300]);

//坐标轴
let axisDataModel = d3.svg.axis()
    .scale(xScale)//结合比例尺
    .orient('bottom');

let axisLeft = d3.svg.axis()
    .scale(xScale)
    .orient('left')
    .ticks(10);

let axisRight = d3.svg.axis()
    .scale(xScale)
    .orient('right')
    .tickValues([3, 4, 5, 6, 7]);

let axisTop = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .tickPadding(10)
    .tickFormat(d3.format('$0.1f'))
    .ticks(5)
    .tickSize(20, 10);

//绘制
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(80, 80)')
    .call(axisTop);

console.log(d3.range(3));