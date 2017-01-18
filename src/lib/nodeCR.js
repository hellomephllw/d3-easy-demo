define(function (require, module, exports) {

//  var d3 = require('d3');
    var config = require("./configCR").exports.config;
    // ---------------- Class Node
    // -- group
    // -- circle
    // -- path
    // -- text-flag (normal node value, relation text, that read-only)
    // -- text-memo (normal node memo, relation nodes number, that changable)
    function node() {
        // func: Create SVG Node
        this.CreateSVGNode = function (parentsvg, nodeData) {
            this.nodeData = nodeData;
            this.nodetype = nodeData.type;
            this.nodeflag = nodeData.value;

            this.parentSVG = parentsvg;

            // group
            this.svgGroup = parentsvg.append("g").attr("class",
                this.attr_group_class);

            // circle
            if (this.nodetype != "relation") {
                this.svgCircle = this.svgGroup.append("circle").attr("class",
                    this.circle_normal_class).attr("cx",
                    this.PATH_DEFAULT_RADIUS).attr("cy",
                    this.PATH_DEFAULT_RADIUS);
            } else {
                this.svgCircle = this.svgGroup.append("rect").attr("class",
                    this.circle_normal_class).attr("x", 0).attr("y", 0).attr(
                    "width", this.PATH_DEFAULT_RADIUS * 2).attr("height",
                    this.PATH_DEFAULT_RADIUS * 2);
            }

            // path
            if (this.nodetype == "relation") {  // for Relation Node
                this.svgPath = this.svgGroup.append("path").attr("d", config.getSVGPath[this.relationStatus])
                    .attr("class", this.path_normal);
                var logo_text = this.nodeData.displayName;
                this.svgLogoText = this.svgGroup.append("text").text(logo_text).attr("class", this.path_normal).attr("x", 16).attr("y", 16);
            } else { // for Normal Node
                if (config.nodeLable == "path") {
                    this.svgPath = this.svgGroup.append("path").attr("d", config.getSVGPath[this.nodetype])
                        .attr("class", this.path_normal);
                } else if (config.nodeLable == "text") {
                    this.svgLogoText = this.svgGroup.append("text").text(config.getLogoText[this.nodetype])
                        .attr("class", this.path_normal);
                } else if (config.nodeLable == "smart") {
                    var logo_text = this.nodeflag;
                    var logo_path = config.getSVGPath[this.nodetype];
                    if (logo_path == undefined) {
                        // use text only
                        this.svgLogoText = this.svgGroup.append("text").text(logo_text)
                            .attr("class", this.path_normal);
                    }
                    else {
                        // use both
                        this.svgPath = this.svgGroup.append("path").attr("d", logo_path)
                            .attr("class", this.path_normal);
                        this.svgLogoText = this.svgGroup.append("text").text(logo_text)
                            .attr("class", this.path_normal);
                    }
                }
            }

            // text flag
            if (this.nodeflag.length > 0) {
                this.svgTextFlag = this.svgGroup.append("text").text(
                    "").attr("class", this.node_normal_text_class)
                    .attr("dy", ".35em");
            }

            // text memo

            this.svgTextMemo = this.svgGroup.append("text").text(this.nodeData.displayName).attr(
                "class", this.node_normal_text_class).attr("dy", "1em");

            // Adjust some SVG Positions/Styles
            if (this.nodetype != "relation") {
                // Text flag Under the circle
                if (this.svgTextFlag != null) {
                    this.svgTextFlag.attr("x", this.PATH_DEFAULT_RADIUS).attr(
                        "y", this.attr_circle_r * 2 + 2);
                }

                // Text Memo Under the text
                this.svgTextMemo.attr("x", this.PATH_DEFAULT_RADIUS).attr("y",
                    this.attr_circle_r * 2 + 14);

                // nodeLable: text or smart
                if (config.nodeLable == "text") {
                    this.svgLogoText.attr("x", 15).attr("y", 22);
                }
                else if (config.nodeLable == "smart") {
                    var logo_path = config.getSVGPath[this.nodetype];
                    if (logo_path == undefined) { // text in the middle
                        this.svgLogoText.attr("x", 15).attr("y", 22);
                    }
                    else {
                        this.svgLogoText.attr("x", 15).attr("y", this.attr_circle_r * 2 + 8);
                    }
                }

            } else {
                // Text flag Above the circle
                if (this.svgTextFlag != null) {
                    this.svgTextFlag.attr("x", this.PATH_DEFAULT_RADIUS).attr(
                        "y", this.attr_circle_r * 1.5 + 2);
                }

                // Text memo In the center
                this.svgTextMemo.attr("x", this.PATH_DEFAULT_RADIUS).attr("y",
                    20);

                this.svgPath.attr("x", 15).attr(
                    "y", 22);
            }

            // Data
            this.svgGroup.data([this]);
            if (this.svgCircle != null)
                this.svgCircle.data([this]);
            if (this.svgPath != null)
                this.svgPath.data([this]);
            if (this.svgTextFlag != null)
                this.svgTextFlag.data([this]);
            if (this.svgTextMemo != null)
                this.svgTextMemo.data([this]);

            // Style
            this.SetStyle("normal");

            return this;
        }

        // func: Set Memo
        this.SetNodeMemo = function (thememo) {
            this.nodememo = thememo
            this.svgTextMemo.text(thememo);
        }

        this.SetLogoText = function (text) {
            this.logo_text = text;
            this.svgLogoText.text(text);
        }

        // func: Set Relation Status
        this.SetRelationStatus = function (status) {
            if (this.GetNodeType() != "relation") {
                console.log("Should be a relation node");
                return;
            }

            if (status != "show" && status != "hide") {
                console.log("SetRelationStatus: only two status, hide or show");
                return;
            }
            this.relationStatus = status;
            this.svgPath.attr("d", config.getSVGPath[this.relationStatus]);
        }

        // func: Update DOM, if x/y are given, the node will be moved to the
        // given ones.
        // else, the inner x/y position given by forcelayout, will be used.
        this.UpdateDOM = function (x, y) {
            if (arguments.length) {
                this.x = x;
                this.y = y;
            }
            ;
            if (isNaN(this.x) || isNaN(this.y)) {
                console.log("i3Node::UpdateDOM(), x/y position is NaN");
                return this;
            }
            this.svgGroup.attr("transform", "translate("
                + (this.x - this.PATH_DEFAULT_RADIUS * this.scalex) + ", "
                + (this.y - this.PATH_DEFAULT_RADIUS * this.scaley) + ") "
                + "scale(" + this.scalex + ", " + this.scaley + ") ");
//          this.SetNodeMemo("de:" + this.degree);
        };

        // func: Scale
        this.Scale = function (scale) {
            this.scalex = this.scaley = scale;
        }

        this.onEvent = function (event, callback) {
            this.GetSVGGroup().on(event, callback);
        }
        // func: Gets
        this.GetPosXY = function () {
            return {
                "px": this.x,
                "py": this.py
            };
        }
        this.GetNodeType = function () {
            return this.nodetype;
        }
        this.GetNodeFlag = function () {
            return this.nodeflag;
        }
        this.GetNodeMemo = function () {
            return this.nodememo;
        }
        this.GetIndex = function () {
            return this.index;
        }
        this.Get_attr_group_class = function () {
            return this.attr_group_class;
        }

        this.GetSVGGroup = function () {
            return this.svgGroup;
        }
        this.GetSVGCircle = function () {
            return this.svgCircle;
        }
        this.GetSVGPath = function () {
            return this.svgPath;
        }
        this.GetSVGTextFlag = function () {
            return this.svgTextFlag;
        }
        this.GetSVGTextMemo = function () {
            return this.svgTextMemo;
        }

        this.GetConnectedEdges = function () {
            return this.connectedEdges;
        }

        this.GetRelationStatus = function () {
            if (this.nodetype != "relation") {
                return null;
            } else {
                return this.relationStatus;
            }
        }

        this.GetRelationPathDelta = function () {
            if (this.nodetype != "relation") {
                return null;
            }
            return {
                dx: 0,
                dy: this.PATH_DEFAULT_RADIUS + 4
            };
        }

        // func: Sets
        this.SetIndex = function (index) {
            this.index = index;
        }

        // func: set style
        this.SetStyle = function (state) {
            if (state == "normal") {
                if (this.svgCircle != null) {
//                  this.svgCircle.attr("r", this.attr_circle_r).attr("fill",
//                          this.attr_circle_fill).attr("stroke-width",
//                          this.attr_circle_stroke_width).attr("stroke",
//                          this.attr_circle_stroke_color);

                    this.svgCircle.attr("r", this.attr_circle_r).attr("class", this.circle_normal_class);
                    if (this.nodetype == "relation")
                        this.svgCircle.attr("class", "circle-relation-normal");
                }

                if (this.svgTextFlag != null) {
                    this.svgTextFlag.attr("class", this.node_normal_text_class);
//                  this.svgTextFlag.attr("font-family",
//                          this.attr_text_font_family).attr("font-size",
//                          this.attr_text_font_size).attr("font-weight",
//                          this.attr_text_font_weight).attr("fill",
//                          this.attr_text_fill).attr("opacity",
//                          this.attr_text_opacity);
                }

                this.svgTextMemo
                    .attr("class", this.node_normal_text_class);
//                      .attr("font-family", this.attr_text_font_family).attr(
//                              "font-size", this.attr_text_font_size).attr(
//                              "font-weight", this.attr_text_font_weight)
//                      .attr("fill", this.attr_text_fill).attr("opacity",
//                              this.attr_text_opacity);
            } else if (state == "selected") {
                if (this.svgCircle != null) {
                    this.svgCircle.attr("r", this.attr_circleSel_r).attr("class", this.circle_select_class);

//                  attr(
//                          "fill", this.attr_circleSel_fill).attr(
//                          "stroke-width", this.attr_circleSel_stroke_width)
//                          .attr("stroke", this.attr_circleSel_stroke_color);
                }

                if (this.svgTextFlag != null) {
//                  this.svgTextFlag.attr("font-family",
//                          this.attr_textSel_font_family).attr("font-size",
//                          this.attr_textSel_font_size).attr("font-weight",
//                          this.attr_textSel_font_weight).attr("fill",
//                          this.attr_textSel_fill).attr("opacity",
//                          this.attr_textSel_opacity);
                    this.svgTextFlag.attr("class", this.node_select_text_class);
                }

                this.svgTextMemo.attr("class", this.node_select_text_class);
//              this.svgTextMemo.attr("font-family",
//                      this.attr_textSel_font_family).attr("font-size",
//                      this.attr_textSel_font_size).attr("font-weight",
//                      this.attr_textSel_font_weight).attr("fill",
//                      this.attr_textSel_fill).attr("opacity",
//                      this.attr_textSel_opacity);
            }
        }

        this.setNodeStatus = function (nodeStatus) {
            this.nodeStatus = nodeStatus;
        }

        this.isNodeShow = function () {
            return this.nodeStatus == "show";
        }

        this.isNodeHide = function () {
            return this.nodeStatus == "hide";
        }


        // vars: position
        this.scalex = 0.9;
        this.scaley = 0.9;

        // vars: info
        this.nodetype = ""; // Type 1. mac, user, sim, ... Type 2. relation
        this.nodeflag = ""; // flag of this node, that read-only
        this.nodememo = ""; // memo of this node, that changable

        // only available for relation node
        this.targetNodeType = "";
        // vars: relation only
        this.relationStatus = "show"; // show/hide

        // node status
        this.nodeStatus = "show";

        // vars: svg dom
        this.svgGroup = null;
        this.svgCircle = null;
        this.svgPath = null;
        this.svgLogoText = null;
        this.svgTextFlag = null;
        this.svgTextMemo = null;

        // vars: styles
        this.attr_group_class = "classnodegroup";

        this.circle_normal_class = "circle-normal";
        this.circle_select_class = "circle-select";

        this.attr_circle_r = 22;
//      this.attr_circle_fill = "white";
//      this.attr_circle_stroke_width = 2;
//      this.attr_circle_stroke_color = "skyblue";
        this.attr_circleSel_r = 23;
//      this.attr_circleSel_fill = "white";
//      this.attr_circleSel_stroke_width = 2;
//      this.attr_circleSel_stroke_color = "red";

        this.attr_path_class = "classnodepath";
        this.path_normal = "path_normal";

        this.node_normal_text_class = "node-normal-text";
        this.node_select_text_class = "node-select-text";
//      this.attr_text_font_family = "Microsoft YaHei";
//      this.attr_text_font_size = "10px";
//      this.attr_text_font_weight = "normal";
//      this.attr_text_opacity = 0.9;
//      this.attr_text_fill = "grey";
//      this.attr_textSel_font_family = "Microsoft YaHei";
//      this.attr_textSel_font_size = "12px";
//      this.attr_textSel_font_weight = "bold";
//      this.attr_textSel_opacity = 0.9;
//      this.attr_textSel_fill = "red";

        // vars: path default radius
        this.PATH_DEFAULT_RADIUS = 16;

        // vars: connected edges
        this.connectedEdges = [];

        this.nodeData = null;

        // vars:test data
        this.testd1 = Math.round(Math.random() * 50);
        this.testd2 = Math.round(Math.random() * 50);
        this.testd3 = "abc" + Math.round(Math.random() * 50);
        this.testd4 = Math.round(Math.random() * 50);
        this.testd5 = "abc222" + Math.round(Math.random() * 50);
        this.testd6 = Math.round(Math.random() * 50);
        this.testd7 = Math.round(Math.random() * 50);

        this.tmpSubNodeIds = new Array();

        this.storeTmpNodeId = function (nodeId) {

            for (var index in this.tmpSubNodeIds) {
                if (this.tmpSubNodeIds[index] == nodeId) {
                    return;
                }
            }
            this.tmpSubNodeIds.push(nodeId);
        }

        this.deleteTmpNodeId = function (nodeId) {
            for (var index in this.tmpSubNodeIds) {
                if (this.tmpSubNodeIds[index] == nodeId) {
                    this.tmpSubNodeIds.splice(index, 1);
                }
            }

        }


        //remove this node from parent
        this.removeNode = function () {

            this.svgGroup.remove();
        }

        this.removeConnectedEdge = function (edgeId) {
            for (var i in this.connectedEdges) {
                var nodeEdgeId = this.connectedEdges[i].edgeId;
                if (edgeId == nodeEdgeId) {
                    this.connectedEdges.splice(i, 1);
                    break;
                }
            }
        }


        //only consider target nodes
        this.isNodeRelated = function (nodeId) {

            var targetNodes = this.findTargetNodes();
            for (var index in targetNodes) {
                var node = targetNodes[index];
                var relationNodeId = node.nodeData.id;
                if (relationNodeId == nodeId) {
                    return true;
                }
            }
            return false;

        }

        this.findTargetNodes = function () {

            var nodes = new Array();
            for (var i in this.connectedEdges) {
                var edge = this.connectedEdges[i];
                if (edge.isAutoLink() == false) {
                    var nodeTwo = edge.GetNode2();
                    if (nodeTwo.nodeData.id != this.nodeData.id)
                        nodes.push(nodeTwo);
                }
            }

            return nodes;

        }


        this.clearTmpSubNodes = function () {
            var length = this.tmpSubNodeIds.length;
            this.tmpSubNodeIds.splice(0, length);
        }

        this.GetTmpSubNodesLength = function () {

            return this.tmpSubNodeIds.length;
        }

        this.isNodeIdInTmp = function (nodeId) {
            for (var index in this.tmpSubNodeIds) {
                if (nodeId == this.tmpSubNodeIds[index])
                    return true;
            }

            return false;
        }

        this.hide = function () {
            this.nodeStatus = "hide";
            this.GetSVGGroup().attr("display", "none");
        }

        this.show = function () {
            this.nodeStatus = "show";
            this.GetSVGGroup().attr("display", "show");
        }

        this.isRelationNode = function () {
            return this.nodetype == "relation";
        }

    } // class i3Node

    module.exports = {
        "node": node
    };

});
