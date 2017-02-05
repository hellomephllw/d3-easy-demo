/**
 * Created by liliwen on 2017/2/5.
 */
const d3 = require('d3');

//宽高
let width = 500,
    height = 500;

//创建svg
let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);

//边界空白
let padding = {left: 50, right: 50, top: 50, bottom: 50};

//x轴比例尺
let xScale = d3.scale.linear()
    .domain([0, 10])
    .range([padding.left, width - padding.right]);

//y轴比例尺
let yScale = d3.scale.linear()
    .domain([10, 0])
    .range([padding.top, height - padding.bottom]);

//散点图的数据
let dataset = [];

for (let i = 0; i < 150; ++i) {
    dataset.push([Math.random() * 10, Math.random() * 10]);
}

//添加散点
let circles = svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 5)
    .style('fill', 'black');

//刷子
let brush = d3.svg.brush()
    .x(xScale)
    .y(yScale)
    .extent([[0, 0], [0, 0]])
    .on('brush', brushed);

function brushed() {
    let extent = brush.extent(),
        xMin = extent[0][0],
        xMax = extent[1][0],
        yMin = extent[0][1],
        yMax = extent[1][1];
    //散点坐标在选择框范围内，变为红色，否则都为黑色
    circles.style('fill',
        d =>
            d[0] >= xMin && d[0] <= xMax && d[1] >= yMin && d[1] <= yMax ?
                'red' : 'black');
}

//绘制刷子
svg.append('g')
    .call(brush)
    .selectAll('rect')
    .style('fill-opacity', .3);

//绘制xy轴
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');
let yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');
svg.append('g')
    .classed('axis', true)
    .attr('transform', `translate(0, ${height - padding.bottom})`)
    .call(xAxis);
svg.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${padding.left}, .0)`)
    .call(yAxis);