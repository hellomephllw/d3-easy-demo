/**
 * Created by liliwen on 2017/1/21.
 */
import * as d3 from 'd3';

//数据
let dataset = [50, 43, 120, 87, 99, 167, 142];

//svg宽高
let width = '400';
let height = '400';

let svg = d3.select('body')
            .insert('svg', 'script')
            .attr('width', width)
            .attr('height', height);

//边距
let padding = {left: 20, top: 20, right: 20, bottom: 20};

//柱的总体宽度(包括空白边)
let rectStep = 35;
//柱的宽度
let rectWidth = 30;

//画bar
let rect = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('fill', 'steelblue')
    .attr('x', function(d, i) {
        return padding.left + i * rectStep;
    })
    .attr('y', function (d, i) {
        return height - padding.bottom - d;
    })
    .attr('width', rectWidth)
    .attr('height', function(d) {
        return d;
    });

//文本
let text = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .attr('x', function (d, i) {
        return padding.left + i * rectStep;
    })
    .attr('y', function(d, i) {
        return height - padding.bottom - d;
    })
    .attr('dx', rectWidth / 2)
    .attr('dy', '1em')
    .text(function(d) {
        return d;
    });
