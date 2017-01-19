/**
 * Created by wb-llw259548 on 2017/1/19.
 */
import * as d3 from 'd3';

let width = 600;
let height = 600;
let img_w = 77;
let img_h = 90;

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

let json = require('../lib/relaction.json');

(function (error, root) {

    if (error) {
        return console.log(error);
    }

    root = json;
    console.log(root);

    let force = d3.layout.force()
        .nodes(root.nodes)
        .links(root.edges)
        .size([width, height])
        .linkDistance(200)
        .charge(-1500)
        .friction(0.9)
        .start();

    console.log(root.nodes);
    console.log(root.edges);

    let label_text_1 = svg.append("text")
        .attr("class", "labeltext")
        .attr("x", 10)
        .attr("y", 16)
        .text("运动状态：开始");

    let label_text_2 = svg.append("text")
        .attr("class", "labeltext")
        .attr("x", 10)
        .attr("y", 40)
        .text("拖拽状态：结束");

    let edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    let edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class", "linetext")
        .text(function (d) {
            return d.relation;
        });

    let drag = force.drag()
        .on("dragstart", function (d, i) {
            d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
            label_text_2.text("拖拽状态：开始");
        })
        .on("dragend", function (d, i) {
            label_text_2.text("拖拽状态：结束");
        })
        .on("drag", function (d, i) {
            label_text_2.text("拖拽状态：进行中");
        });

    let nodes_img = svg.selectAll("image")
        .data(root.nodes)
        .enter()
        .append("image")
        .attr("width", img_w)
        .attr("height", img_h)
        .attr("xlink:href", function (d) {
            return d.image;
        })
        .on("mouseover", function (d, i) {
            //显示连接线上的文字
            edges_text.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d) {
                    return 1.0;
                }
            });
        })
        .on("mouseout", function (d, i) {
            //隐去连接线上的文字
            edges_text.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d) {
                    return 0.0;
                }
            });
        })
        .on("dblclick", function (d, i) {
            d.fixed = false;
        })
        .call(drag);

    let text_dx = -20;
    let text_dy = 20;

    let nodes_text = svg.selectAll(".nodetext")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class", "nodetext")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            return d.name;
        });

    //力学图运动开始时
    force.on("start", function () {
        label_text_1.text("运动状态：开始");
    });

    //力学图运动结束时
    force.on("end", function () {
        label_text_1.text("运动状态：结束");
    });

    force.on("tick", function () {

        //修改标签文字
        label_text_1.text("运动状态：进行中");

        //限制结点的边界
        root.nodes.forEach(function (d, i) {
            d.x = d.x - img_w / 2 < 0 ? img_w / 2 : d.x;
            d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
            d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
            d.y = d.y + img_h / 2 + text_dy > height ? height - img_h / 2 - text_dy : d.y;
        });

        //更新连接线的位置
        edges_line.attr("x1", function (d) {
            return d.source.x;
        });
        edges_line.attr("y1", function (d) {
            return d.source.y;
        });
        edges_line.attr("x2", function (d) {
            return d.target.x;
        });
        edges_line.attr("y2", function (d) {
            return d.target.y;
        });

        //更新连接线上文字的位置
        edges_text.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        });
        edges_text.attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });


        //更新结点图片和文字
        nodes_img.attr("x", function (d) {
            return d.x - img_w / 2;
        });
        nodes_img.attr("y", function (d) {
            return d.y - img_h / 2;
        });

        nodes_text.attr("x", function (d) {
            return d.x
        });
        nodes_text.attr("y", function (d) {
            return d.y + img_w / 2;
        });
    });
})();