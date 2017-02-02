/**
 * Created by liliwen on 2017/2/2.
 */
'use strict';
const d3 = require('d3');

let brushEle;

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
    .attr('x', 150)
    .attr('y', 70)
    .attr('width', 70)
    .attr('height', 60)
    .style('fill', 'black');

//比例尺
let xScale = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);
let yScale = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

//创建刷子
let brush = d3.svg.brush()
    .x(xScale)
    .y(yScale)
    .extent([[0, 0], [100, 100]])
    .on('brush', brushed)
    .on('brushstart', brushStart)
    .on('brushend', brushEnd);

brushEle = svg.append('g')
    .call(brush)
    .selectAll('rect')
    .style({'fill-opacity': .3, 'opacity': 0});

function brushed() {
    let extent = brush.extent();
    // console.log('x方向的下限：' + extent[0][0]);
    // console.log('y方向的下限：' + extent[0][1]);
    // console.log('x方向的上限：' + extent[1][0]);
    // console.log('y方向的上限：' + extent[1][1]);
}

function brushStart() {
    brushEle.style({opacity: 1});
}

function brushEnd() {
    brushEle.style({opacity: 0});
}