/**
 * Created by liliwen on 2017/1/19.
 */
import * as d3 from 'd3';

/**数据*/
let width = 400, height = 400;

let nodes = [
    {name: '0'},
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'}
];

let edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 1, target: 4},
    {source: 1, target: 5},
    {source: 1, target: 6}
];

let color = d3.scale.category20();

/**布局*/
let force = d3.layout.force()
    .nodes(nodes)
    .links(edges)
    .size([width, height])
    .linkDistance(90)
    .charge(-400);

force.start();

console.log(nodes);
console.log(edges);

/**绘制*/
let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);
//绘制连线
let lines = svg.selectAll('.forceLine')
    .data(edges)
    .enter()
    .append('line')
    .classed('forceLine', true)
    .style('stroke', '#ccc')
    .style('stroke-width', 1);
//绘制节点
let circles = svg.selectAll('.forceCircle')
    .data(nodes)
    .enter()
    .append('circle')
    .classed('forceCircle', true)
    .attr('r', 20)
    .style('fill', (d, i) => color(i));
//绘制文字
let texts = svg.selectAll('.forceText')
    .data(nodes)
    .enter()
    .append('text')
    .classed('forceText', true)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text(d => d.name);

//tick事件的监听器
force.on('tick', () => {
    //更新连线的端点坐标
    lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    //更新节点坐标
    circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    //更新节点文字的坐标
    texts
        .attr('x', d => d.x)
        .attr('y', d => d.y);
});

//指定事件
force.on('start', function() {
    console.log('开始运动！');
});

force.on('end', function() {
    console.log('结束运动！');
});

//指定事件
let drag = force.drag()
    .on('dragstart', function() {
        d3.select(this).style('fill', 'orange')
    })
    .on('dragend', function(d, i) {
        d3.select(this).style('fill', color(i))
    })
    .on('drag', function(d, i) {
        d3.select(this).style('fill', 'yellow')
    });

//注册事件
circles.call(drag);