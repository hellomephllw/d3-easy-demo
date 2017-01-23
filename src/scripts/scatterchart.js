/**
 * Created by wb-llw259548 on 2017/1/23.
 */
const d3 = require('d3');

//圆心数据
let centerData = [
    [0.5, 0.5], [0.7, 0.8], [0.4, 0.9],
    [0.11, 0.32], [0.88, 0.25], [0.75, 0.12],
    [0.5, 0.1], [0.2, 0.3], [0.4, 0.1],
    [0.6, 0.7]
];

//svg宽高
let width = 400,
    height = 400;
//添加svg
let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);

//x、y轴宽度
let xAxisWidth = 300,
    yAxisWidth = 300;
//x、y轴比例尺
let xScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(centerData, d => d[0])])
    .range([0, xAxisWidth]);
let yScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(centerData, d => d[1])])
    .range([0, yAxisWidth]);
let yScaleForAxis = d3.scale.linear()
    .domain([0, 1.2 * d3.max(centerData, d => d[1])])
    .range([yAxisWidth, 0]);

//外边距
let padding = {top: 30, right: 30, bottom: 30, left: 30};

//绘制圆形
let circle = svg.selectAll('circle')
    .data(centerData)
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('cx', d => padding.left + xScale(d[0]))
    .attr('cy', d => height - padding.bottom - yScale(d[1]))
    .attr('r', 5);

//绘制xy轴
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');
let yAxis = d3.svg.axis()
    .scale(yScaleForAxis)
    .orient('left');
svg.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${padding.left}, ${height - padding.bottom})`)
    .call(xAxis);
svg.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${padding.left}, ${height - padding.bottom - yAxisWidth})`)
    .call(yAxis);