/**
 * Created by liliwen on 2017/1/21.
 */
const d3 = require('d3');

//数据
let dataset = [50, 43, 120, 87, 99, 167, 142];

//svg宽高
let width = '400';
let height = '400';
//svg
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

//处理函数
let rectDispose = rect =>
    rect
        .attr('fill', 'steelblue')
        .attr('x', (d, i) => padding.left + i * rectStep)
        .attr('y', (d, i) => height - padding.bottom - d)
        .attr('width', rectWidth)
        .attr('height', d => d);
let textDispose = text =>
    text
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', (d, i) => padding.left + i * rectStep)
        .attr('y', (d, i) => height - padding.bottom - d)
        .attr('dx', rectWidth / 2)
        .attr('dy', '1em')
        .text(d => d);
//画bar
let rect = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect');
rectDispose(rect);

//文本
let text = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text');
textDispose(text);

//更新重绘
function draw() {
    //矩形处理
    let updateRect = svg.selectAll('rect').data(dataset),
        enterRect = updateRect.enter(),
        exitRect = updateRect.exit();
    //执行处理
    rectDispose(updateRect);
    rectDispose(enterRect.append('rect'));
    exitRect.remove();

    //文字update
    let updateText = svg.selectAll('text').data(dataset),
        enterText = updateText.enter(),
        exitText = updateText.exit();
    textDispose(updateText);
    textDispose(enterText.append('text'));
    exitText.remove();
}

//btn
d3.select('body').insert('button', 'script').attr('id', 'asc');
d3.select('body').insert('button', 'script').attr('id', 'desc');
d3.selectAll('button').data(['升序', '降序']).text(d => d);
d3.select('body').on('click', () => {
    if (d3.event.target.id == 'asc') dataset.sort(d3.ascending);
    else if (d3.event.target.id == 'desc') dataset.sort(d3.descending);
    //重绘
    draw();
});