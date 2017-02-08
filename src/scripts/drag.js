/**
 * Created by wb-llw259548 on 2017/2/8.
 */
const d3 = require('d3');

let circles = [
    {cx: 150, cy: 200, r: 30},
    {cx: 250, cy: 200, r: 30}
];

let width = 500,
    height = 500;

//创建拖拽行为
let drag = d3.behavior.drag()
    .origin((d, i) => ({x: d.cx, y: d.cy}))//起点坐标为被拖动物体的圆心坐标
    // .origin(null)
    .on('dragstart', d => console.log('拖拽开始'))//dragstart的监听器
    .on('dragend', d => console.log('拖拽结束'))//dragend的监听器
    .on('drag', function(d) {//drag的监听器
        //选择当前被拖拽的元素
        d3.select(this)
            //将d3.event.x赋值给被绑定的数据，再将cx属性设置为该值
            .attr('cx', d.cx = d3.event.x)
            //将d3.event.y赋值给被绑定的数据，再将cy属性设置为该值
            .attr('cy', d.cy = d3.event.y);
    });

let svg = d3.select('body').insert('svg', 'script')
    .attr('width', width)
    .attr('height', height);

svg.selectAll('circle')
    .data(circles)
    .enter()
    .append('circle')
    .attr('cx', d => d.cx)
    .attr('cy', d => d.cy)
    .attr('r', d => d.r)
    .attr('fill', 'black')
    .call(drag);