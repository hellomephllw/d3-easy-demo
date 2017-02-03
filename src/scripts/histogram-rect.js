/**
 * Created by wb-llw259548 on 2017/1/24.
 */
const d3 = require('d3');

//正态分布生成器，170为平均值，10为标准差
let rand = d3.random.normal(170, 10);

//正态分布值集合
let dataset = [];

//生成100个随机数
for (let i = 0; i < 100; ++i) {
    dataset.push(rand());
}

//直方图布局数据
let binNum = 20,
    rangeMin = 130,
    rangeMax = 210;
//直方图布局生成器
let histogram = d3.layout.histogram()
    .range([rangeMin, rangeMax])
    .bins(binNum)
    .frequency(true);
//生成直方图布局数据
let histogramData = histogram(dataset);

//svg宽高
let width = 600,
    height = 600;
//svg
let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);
//外边距
let padding = {top: 30, right: 30, bottom: 30, left: 30};

//x坐标轴数据
let xAxisWidth = 450,
    xTicks = histogramData.map(d => d.x);
//x轴比例尺
let xScale = d3.scale.ordinal()
    .domain(xTicks)
    .rangeRoundBands([0, xAxisWidth], 0.1, 1);
//x坐标轴
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.format('.0f'));
//绘制x轴
svg.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${padding.left}, ${height - padding.bottom})`)
    .call(xAxis);

//y坐标轴数据
let yAxisWidth = 450;
//y轴比例尺
let yScale = d3.scale.linear()
    .domain([d3.min(histogramData, d => d.y), d3.max(histogramData, d => d.y)])
    .range([0, yAxisWidth]);
//绘制矩形
let gRect = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${-padding.bottom})`);
gRect.selectAll('rect')
    .data(histogramData)
    .enter()
    .append('rect')
    .classed('rect', true)
    .attr('x', (d, i) => xScale(d.x))
    .attr('y', (d, i) => height - yScale(d.y))
    .attr('width', (d, i) => xScale.rangeBand())
    .attr('height', (d, i) => yScale(d.y));

console.log(histogramData);