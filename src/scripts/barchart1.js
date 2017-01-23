/**
 * Created by wb-llw259548 on 2017/1/23.
 */
const d3 = require('d3');

//数据
let dataset = [50, 43, 120, 87, 99, 167, 142];
let vals = ['张三', '李四', '王五', '郑六', 'Darren', 'Jacky', 'Thomas'];

//x、y轴宽度
let xAxisWidth = 300,
    yAxisWidth = 300;
//x轴比例尺
let xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, xAxisWidth], 0.2);
//y轴比例尺
let yScale = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .rangeRound([0, yAxisWidth]);
let yScaleForAxis = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .rangeRound([yAxisWidth, 0]);

//svg宽高
let width = '400',
    height = '400';
//svg
let svg = d3.select('body')
    .insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);

//边距
let padding = {left: 30, top: 20, right: 20, bottom: 20};

//画坐标轴
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d => vals[d]);
let yAxis = d3.svg.axis()
    .scale(yScaleForAxis)
    .orient('left');
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding.left}, ${height - padding.bottom})`)
    .call(xAxis);
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding.left}, ${height - padding.bottom - yAxisWidth})`)
    .call(yAxis);

//处理函数
let rectDispose = rect =>
    rect
        .attr('fill', 'steelblue')
        .attr('x', (d, i) => padding.left + xScale(i))
        .attr('y', (d, i) => height - padding.bottom - yScale(d))
        .attr('width', xScale.rangeBand())
        .attr('height', d => yScale(d));
let textDispose = text =>
    text
        .attr('fill', '#fff')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', (d, i) => padding.left + xScale(i))
        .attr('y', (d, i) => height - padding.bottom - yScale(d))
        .attr('dx', xScale.rangeBand() / 2)
        .attr('dy', '1em')
        .text(d => yScale(d));
//画bar
let rect = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect');
rectDispose(rect);

//文本
let text = svg.selectAll('.num')
    .data(dataset)
    .enter()
    .append('text')
    .classed('num', true);
textDispose(text);