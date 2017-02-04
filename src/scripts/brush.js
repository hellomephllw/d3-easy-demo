/**
 * Created by liliwen on 2017/2/2.
 */
'use strict';
const d3 = require('d3');

let brushGroupEle,
    brush;

//宽高
let width = 500,
    height = 500;

//创建svg
let svg = d3.select('body')
    .append('svg')
    .style({border: '1px solid red'})
    .attr('width', width)
    .attr('height', height);

//图形1
let circleEle = svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 30)
    .style('fill', 'black');

//图形2
let rectEle = svg.append('rect')
    .classed('rect', true)
    .attr('x', 150)
    .attr('y', 70)
    .attr('width', 70)
    .attr('height', 60)
    .style('fill', 'black');

//比例尺
let xScale = d3.scale.linear()
    .domain([0, width])//brush.extent显示的范围
    .range([0, width]);//浏览器画布实际范围
let yScale = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

//刷子
brushGroupEle = svg.append('g').classed('brush', true);
createBrush()(brushGroupEle);
//创建刷子
function createBrush() {
    //构建刷子
    brush = d3.svg.brush()
        .x(xScale)
        .y(yScale)
        .extent([[0, 0], [0, 0]])//一出来隐藏刷子
        .on('brushstart', brushStart)
        .on('brush', brushed)
        .on('brushend', brushEnd);

    //渲染刷子
    return function(brushGroupEle) {
        brushGroupEle.call(brush)
            .selectAll('rect')
            .style({'fill-opacity': .3});
    };
}

function brushed() {
    let extent = brush.extent();
    console.log(this == brush);
    // console.log('x方向的下限：' + extent[0][0]);
    // console.log('y方向的下限：' + extent[0][1]);
    // console.log('x方向的上限：' + extent[1][0]);
    // console.log('y方向的上限：' + extent[1][1]);
}

function brushStart() {
    console.log('start');
}

function brushEnd() {
    console.log('end');

    createBrush()(d3.select('.brush'))
}