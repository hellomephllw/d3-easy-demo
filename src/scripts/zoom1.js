/**
 * Created by wb-llw259548 on 2017/3/3.
 */
const d3 = require('d3');

let svgEleD3 = d3.select(document.body).insert('svg', 'script')
    .attr('width' ,800)
    .attr('height', 800)
    .style({
        'border': '1px solid gray'
    });

let zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on('zoom', function(d) {
        console.log(d3.event.translate);
        console.log(d3.event.scale);
        d3.select(this).attr('transform',
            // 'translate(' + d3.event.translate + ')'
            // +
            'scale(' + d3.event.scale + ')'
        );
        console.log(this);
    });

let circles = [
    {cx: 150, cy: 200, r: 30},
    {cx: 220, cy: 200, r: 30},
    {cx: 150, cy: 270, r: 30},
    {cx: 220, cy: 270, r: 30}
];

let g = svgEleD3.append('g').attr('width', 1000).attr('height', 1000)
    .call(zoom);

g.selectAll('circle')
    .data(circles)
    .enter()
    .append('circle')
    .attr('cx', d => d.cx)
    .attr('cy', d => d.cy)
    .attr('r', d => d.r)
    .attr('fill', 'black');

g.append('rect').attr('width', 800).attr('height', 800).style('fill', 'transparent');

let btn = d3.select(document.body).insert('button', 'script').text('btn');
let scale = 1;
btn.on('click', function() {
    console.log(d3.event.scale);
    scale += .1;
    g.attr('transform',
        // 'translate(' + d3.event.translate + ')' +
        'scale(' + scale + ')'
    );
});