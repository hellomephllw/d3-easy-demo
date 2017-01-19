define(function (require, module, exports) {

    // var d3 = require('d3');
    var map = require("../../js/map");

    var i3Node = require('./nodeCR').exports.node;
    var i3Edge = require('./edgeCR').exports.edge;

    var treeforcelayout = require('./ydforcelayout').exports.treeforcelayout;

    var config = require("./configCR").exports.config;

    // ---------------- Class i3Canvas
    // -- SVG
    // -- BackGround Rect
    // -- Root Node
    // -- Main (nodes, edges)
    function canvas() {
        // func: Initialize
        this.Init = function (rootname) {
            // The Basic SVG
            this.svg = d3.select(rootname).append("svg");
            // this.svg.attr("class", this.canvas_style);
            this.svg.attr("width", this.attr_svgW).attr("height",
                this.attr_svgH);

            // BackGround Rect
            this.svg_rect = this.svg.append("rect").attr("width",
                this.attr_svgW).attr("height", this.attr_svgH).attr(
                "class", this.canvas_background_style).attr("style", "position:absolute;fill:white");

            // Root Node
            this.i3RootNode = new i3Node();
            this.i3RootNode.attr_path_fill = "grey";
            this.i3RootNode.circle_normal_class = "root-node-circle-normal";
            this.i3RootNode.attr_circle_r = 22;
            this.i3RootNode.attr_circleSel_r = 22;
            this.i3RootNode.circle_select_class = "root-node-circle-select";
            this.i3RootNode.CreateSVGNode(this.svg, {
                "type": "plus",
                "value": ""
            });
            this.i3RootNode.UpdateDOM(this.attr_root_circle_cx,
                this.attr_root_circle_cy);
            this.i3RootNode.Scale(0.8);
            this.i3RootNode.GetSVGGroup().attr("cursor", "crosshair");
            this.i3RootNode.GetSVGGroup().attr("style", "position:absolute");

            // Main (nodes, edges)
            this.svg_main_p = this.svg.append("g");
            this.svg_main = this.svg_main_p.append("g");

            // The layouts
            // this.forcelayout = d3.layout.force().size([this.attr_svgW,
            // this.attr_svgH]);
            this.forcelayout = treeforcelayout().size(
                [this.attr_svgW, this.attr_svgH]);

            /*
             this.svg.call( d3.behavior.drag()
             .on("drag",function(d){
             console.log("-----"+d);
             }) );
             */
        }

        // func: Create one node,duplicate
        this.CreateNodeOnMain = function (nodeData) {
            if (this.graphData.nodes.contain(nodeData.id))
                return;
            var onenode = new i3Node();
            onenode.CreateSVGNode(this.svg_main, nodeData);
            onenode.SetIndex(this.graphData.nodes.value.length);
            this.graphData.nodes.put(nodeData.id, onenode);
            return onenode;
        }

        // func: Create one edge
        this.CreateEdgeOnMain = function (sourceId, targetId, length, edgedata) {
            if (this.graphData.edges.contain(edgedata.id) || this.graphData.edges.contain(targetId + "_" + sourceId))
                return;
            var oneedge = new i3Edge(edgedata);
            oneedge.CreateUEdge(this.svg_main, this.graphData.nodes
                .get(sourceId), this.graphData.nodes.get(targetId), length * 0.75, edgedata);
            this.graphData.edges.put(edgedata.id, oneedge);
            return oneedge;
        }

        // events: after every iteration of forcelayout, this function is called
        // This function will read the position of nodes genereated by force
        // layout, and then update doms of nodes and edges.
        this.ForceTick = function () {
            for (var i in this.graphData.nodes.value) {
                var thenode = this.graphData.nodes.value[i];
                thenode.UpdateDOM();
            }

            for (var i in this.graphData.edges.value) {
                var theedge = this.graphData.edges.value[i];
                theedge.UpdateDOM();
            }
        }

        // Func: redraw force layout
        this.UpdateForce = function () {
            this.forcelayout.stop();

            this.forcelayout.nodes(this.graphData.nodes.value).links(
                this.graphData.edges.value).linkDistance(function (d) {
                return d.GetLength();
            }).charge(-900);

            this.forcelayout.start();
        }

        // Func: Gets
        this.Geti3RootNode = function () {
            return this.i3RootNode;
        }
        this.GetGraphData = function () {
            return this.graphData;
        }
        this.GetForceLayout = function () {
            return this.forcelayout;
        }
        // this.GetSVGMainP = function() { return this.svg_main_p; }
        this.GetSVGMain = function () {
            return this.svg_main;
        }
        this.GetBkgRect = function () {
            return this.svg_rect;
        }

        // vars: svg
        this.svg = null;
        this.svg_rect = null;
        this.svg_main = null;
        this.svg_main_p = null;
        this.i3RootNode = null;

        // vars: manage i3 nodes
        this.graphData = {
            nodes: new Map(),
            edges: new Map()
        };

        // vars: layouts
        this.forcelayout = null;

        this.canvas_style = "canvas";
        this.canvas_background_style = "canvas-background";
        // vars: constant style
        this.attr_svgW = config.canvasWidth - 30;
        this.attr_svgH = config.canvasHeight - 10;

        this.attr_root_circle_cx = this.attr_svgW - 30;
        this.attr_root_circle_cy = 35;
        this.attr_root_circle_r = 20;
        this.attr_root_circle_fill = "grey";

        this.attr_root_rect_W = 30;
        this.attr_root_rect_H = 8;
        this.attr_root_rect_fill = "white";

        //hide node
        this.hideNode = function (relationNode, hideSelf) {
            relationNode.SetRelationStatus("hide");
            if (hideSelf)
                relationNode.hide();

            var nodes = relationNode.findTargetNodes();

            for (var i = 0; i < nodes.length; ++i) {
                var n = nodes[i];
                n.hide();

                var nodeId = n.nodeData.id;

                var edges = n.GetConnectedEdges();
                for (var j = 0; j < edges.length; ++j) {
                    var edge = edges[j];

                    var nodeOne = edge.GetNode1();
                    var nodeTwo = edge.GetNode2();

                    var nodeOneId = nodeOne.nodeData.id;
                    var nodeTwoId = nodeTwo.nodeData.id;

                    if (nodeOneId == nodeId && edge.isAutoLink() == false) {
                        this.hideNode(nodeTwo, true);
                    }
                    edge.GetSVGPath().attr("display",
                        "none");
                }
            }
        }

        //show node
        this.showNode = function (relationNode, showSelf) {
            relationNode.SetRelationStatus("show");
            if (showSelf)
                relationNode.show();
            var nodes = relationNode.findTargetNodes();
            for (var i = 0; i < nodes.length; ++i) {
                var n = nodes[i];
                n.show();
                var nodeId = n.nodeData.id;

                var edges = n.GetConnectedEdges();
                for (var j = 0; j < edges.length; ++j) {

                    var edge = edges[j];

                    var nodeOne = edge.GetNode1();
                    var nodeTwo = edge.GetNode2();

                    var nodeOneId = nodeOne.nodeData.id;
                    var nodeTwoId = nodeTwo.nodeData.id;

                    if (nodeOneId == nodeId && edge.isAutoLink() == false) {
                        this.showNode(nodeTwo, true);
                    }

                    if (edge.isAutoLink() == true) {
                        if (nodeTwo.isNodeShow() && nodeOne.isNodeShow()) {
                            edges[j].GetSVGPath().attr("display",
                                "show");
                        }

                    } else {
                        edges[j].GetSVGPath().attr("display",
                            "show");
                    }


                }
            }
        }

        //remove node
        this.removeNode = function (node) {

            if (node == undefined || node.nodeData == undefined || node.nodeData.id == undefined)
                return;

            var nodeId = node.nodeData.id;
            if (this.graphData.nodes.contain(nodeId) != undefined || this.graphData.nodes.contain(nodeId) != null) {
                var tmpNode = this.graphData.nodes.get(nodeId);
                this.graphData.nodes.remove(nodeId);
                tmpNode.removeNode();


                // remove related edges;
                for (var i = node.connectedEdges.length - 1; i >= 0; i--) {
                    var edge = node.connectedEdges[i];
                    var edgeId = edge.edgeId;

                    var nodeOne = edge.GetNode1();
                    var nodeTwo = edge.GetNode2();

                    var nodeOneId = nodeOne.nodeData.id;
                    var nodeTwoId = nodeTwo.nodeData.id;


                    nodeTwo.removeConnectedEdge(edgeId);
                    nodeOne.removeConnectedEdge(edgeId);


                    if (nodeOneId == nodeId && edge.isAutoLink() == false) {
                        this.removeNode(nodeTwo);
                    }


                    //remove from screen
                    this.graphData.edges.remove(edge.edgeId);
                    edge.removeEdge();
                }

            } else {
                return;
            }

        }


    }

    module.exports = {
        "canvas": canvas
    };
});
