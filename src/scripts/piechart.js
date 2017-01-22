/**
 * Created by wb-llw259548 on 2017/1/22.
 */
const d3 = require('d3');

//数据
let dataset = [['小米', 60.8], ['三星', 58.4], ['联想', 47.3], ['苹果', 46.6], ['华为', 41.3], ['酷派', 40.1], ['其他', 111.5]];

//宽高内外半径
let width = 400,
    height = 400,
    outerRadius = width / 3,
    innerRadius = 0;

//生成svg
let svg = d3.select('body').insert('svg', 'script').attr('width', width).attr('height', height);
//布局
let pie = d3.layout.pie()
    .startAngle(Math.PI * 0.2)
    .endAngle(Math.PI * 1.5)
    .value(d => d[1]);//指定数据

//重构数据，把数据重构为饼布局所需数据
let piedata = pie(dataset);
console.log(piedata);

//弧生成器
let arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

//颜色
let color = d3.scale.category20();

//添加对应数目的弧数组
let arcs = svg.selectAll('g')
    .data(piedata)
    .enter()
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);//把圆心移动到svg中央

//添加弧的路径元素
arcs.append('path')
    .attr('fill', (d, i) => color(i))
    .attr('d', d => arc(d));
//添加文本
arcs.append('text')
    .text(d => {//计算百分比，并以文本形式输出
        let percent = Number(d.value) / d3.sum(dataset, d => d[1]) * 100;

        return `${percent.toFixed(1)}%`;
    })
    .attr('transform', d => {//调整文本位置
        let x = arc.centroid(d)[0] * 1.4 - 18,
            y = arc.centroid(d)[1] * 1.4;

        return `translate(${x}, ${y})`;
    });

//弧外连线
arcs.append('line')
    .attr('stroke', 'black')
    .attr('x1', d => arc.centroid(d)[0] * 2)
    .attr('y1', d => arc.centroid(d)[1] * 2)
    .attr('x2', d => arc.centroid(d)[0] * 2.2)
    .attr('y2', d => arc.centroid(d)[1] * 2.2);
//弧外文字
arcs.append('text')
    .attr('transform', d => {
        let x = arc.centroid(d)[0] * 2.5,
            y = arc.centroid(d)[1] * 2.5;

        return `translate(${x}, ${y})`;
    })
    .attr('text-anchor', 'middle')
    .text(d => d.data[0]);