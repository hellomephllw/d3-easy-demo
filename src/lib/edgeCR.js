define(function (require, module, exports) {

//	var d3 = require('d3');

    // ---------------- Class i3Edge
    //
    function edge() {
        // func: Create Edge
        this.CreateUEdge = function (parentsvg, node1, node2, length, edgeData) {
            this.isDirected = false;
            this.node1 = node1;
            this.node2 = node2;
            this.length = length;
            this.parentSVG = parentsvg;
            this.edgeId = edgeData.id;
            this.linkType = edgeData.linkType;


            // let the node know, which edge is connected to it.
            node1.GetConnectedEdges().push(this);
            node2.GetConnectedEdges().push(this);

            // SVG
            this.svgPath = this.parentSVG.insert("path",
                "." + node1.Get_attr_group_class()) // before the nodes
                .attr("class", this.link_normal_class)
                .attr("edgeId", this.edgeId);


            // Data
            this.svgPath.data([this]);

            // Style
            this.SetStyle("normal");

            // vars: for force layout
            this.source = this.node1.GetIndex();
            this.target = this.node2.GetIndex();
        };

        // func: update dom
        this.UpdateDOM = function () {
            var curve_start = this.node1.GetPosXY();
            var curve_end = this.node2.GetPosXY();

            if (this.node1.GetNodeType() == "relation") {
                var delta = this.node1.GetRelationPathDelta();
                curve_start.px = curve_start.px + delta.dx;
                curve_start.py = curve_start.py + delta.dy;
            }

            if (isNaN(curve_start.px) || isNaN(curve_start.py)
                || isNaN(curve_end.px) || isNaN(curve_end.py))
                return;

            var curve_cx = (curve_start.px + curve_end.px) * 0.5;
            var curve_cy = (curve_start.py + curve_end.py) * 0.5;
            var curve_dx = curve_end.px - curve_start.px;
            var curve_dy = curve_end.py - curve_start.py;


            var curve_length = Math.sqrt(curve_dy * curve_dy + curve_dx
                    * curve_dx) + 0.01;
            var curve_nx = 25.0 * curve_dx / curve_length;
            var curve_ny = 25.0 * curve_dy / curve_length;

            var curve_ctr_x = curve_cx - curve_ny;
            var curve_ctr_y = curve_cy + curve_nx;

            var path = "M" + curve_start.px + " " + curve_start.py + "Q"
                + curve_ctr_x + " " + curve_ctr_y + " " + curve_end.px
                + " " + curve_end.py;

            this.svgPath.attr("d", path);
        }

        // func: set style
        this.SetStyle = function (type) {
            if (type == "normal") {
                this.svgPath.attr("class", this.link_normal_class);
//				attr("stroke-width", this.attr_path_stroke_width)
//						.attr("stroke", this.attr_path_stroke_color).attr(
//								"fill", this.attr_path_fill).attr(
//								"stroke-dasharray",
//								this.attr_path_stroke_dasharray);
            } else if (type == "selected") {
                this.svgPath.attr("class", this.link_select_class);
//						attr("stroke-width",
//						this.attr_pathSel_stroke_width).attr("stroke",
//						this.attr_pathSel_stroke_color).attr("fill",
//						this.attr_pathSel_fill).attr("stroke-dasharray",
//						this.attr_pathSel_stroke_dasharray);
            }
        }

        // func: get
        this.GetNode1 = function () {
            return this.node1;
        }
        this.GetNode2 = function () {
            return this.node2;
        }
        this.GetLength = function () {
            return this.length;
        }
        this.GetSVGPath = function () {
            return this.svgPath;
        }

        this.onEvent = function (event, callback) {
            this.GetSVGPath().on(event, callback);
        }

        this.removeEdge = function () {
            this.svgPath.remove();
        }

        this.isAutoLink = function () {
            return this.linkType == "autoLink";
        }
        // vars: dom
        this.svgPath = null;

        this.parentSVG = null;

        // vars: basic
        this.isDirected = true;
        this.node1 = null;
        this.node2 = null;
        this.length = 1; // default

        // vars: for force layout
        this.source = null;
        this.target = null;

        // vars: constant style
        this.link_normal_class = "link_normal";

        this.link_select_class = "link_select";

        this.edgeId = null;

        this.is_disabled = false;

        this.linkType = "normal";

//		this.attr_path_stroke_color = "#AAAAAA";
//		this.attr_path_stroke_width = 3;
//		this.attr_path_stroke_dasharray = "0"; // 20,10,5,5,5,10
//		this.attr_path_fill = "none";
//		this.attr_pathSel_stroke_color = "red";
//		this.attr_pathSel_stroke_width = 3;
//		this.attr_pathSel_stroke_dasharray = "0"; // 20,10,5,5,5,10
//		this.attr_pathSel_fill = "none";
    }

    module.exports = {
        "edge": edge
    };

});
