/**
 * Created by wb-llw259548 on 2017/1/18.
 */
import * as d3 from 'd3';

//svg宽高
let width = 500,
    height = 500;

//节点原始数据
let nodes = [
    {name: 'James'},
    {name: 'Irvin'},
    {name: 'Love'},
    {name: '队友'},
    {name: '亲戚'}
];
//连线原始数据
let edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 1, target: 4},
    {source: 1, target: 5},
    {source: 1, target: 6}
];

//创建svg
let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);

//力布局
let force = d3.layout.force()
    .nodes(nodes)
    .links(edges)
    .size([width, height])//作用范围
    .linkDistance(90)//连线距离
    .charge(-400);//节点电荷数
//开启力布局
force.start();

//颜色生成器
let colorGenerator = d3.scale.category20();

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
    .style('fill', (d, i) => colorGenerator(i))
    .call(force.drag);//允许拖动

//绘制文字
let texts = svg.selectAll('.forceText')
    .data(nodes)
    .enter()
    .append('text')
    .classed('forceText', true)
    .attr('dx', '-.3em')
    .attr('dy', '.4em')
    .text(d => d.name);

//tick事件监听器
force.on('tick', () => {
    //更新连线坐标
    lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    //更新节点坐标
    circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    //更新节点上文字的坐标
    texts
        .attr('x', d => d.x)
        .attr('y', d => d.y);
});