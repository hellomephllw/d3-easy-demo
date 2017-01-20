define(function (require, module, exports) {
    // var d3 = require('d3');

    var config = require("./configCR").exports.config;

    var i3Node = require('./nodeCR').exports.node;

    var i3Edge = require('./edgeCR').exports.edge;

    var i3Canvas = require('./canvasCR').exports.canvas;

    var autoLink = require("./autolink").exports.autoLink;

    // var clearPropertyTable = require("./propertyTable").exports.clearPropertyTable;

    // vars: canvas
    canvas = new i3Canvas();

    // ---------------- Class networkgraph
    //
    // Func: Go
    GO = function () {
        // Init Canvas
        canvas.Init("div#demoContent");
        //根节点事件绑定
//		getCanvas().Geti3RootNode().onEvent("mouseenter", function(d) {
//			config.network.SetNodeSelected(d)
//		});
        // Events: tick of forcelayout
        getCanvas().GetForceLayout().on("tick", function () {
            config.network.getCanvas().ForceTick();
        });

        // Events: node drag, set this node selected, and edge de-selected
        getCanvas().GetForceLayout().drag().on("dragstart", function (i3node) {
            config.network.getSelectedElements().selectedNode = i3node;
            config.network.getSelectedElements().selectedEdge = null;
            config.network.SetNodeSelected(i3node);

            config.network.getSelectedElements().isMouseMoved = false;
        });

        // / Events: node move, set mouse is moved
        getCanvas().GetForceLayout().drag().on("drag", function (i3node) {
            config.network.getSelectedElements().isMouseMoved = true;
        });

        // getCanvas().GetForceLayout().drag().on("dragend",
        // function(i3node) { console.log("dragend: ",
        // i3node.GetNodeFlag()); });

        // Events: white space click, de-select all
        this.getCanvas().GetBkgRect().on(
            "click",
            function () {
                config.network.getSelectedElements().selectedNode = config.network
                    .getSelectedElements().selectedEdge = null;
                config.network.SetNoneSelected();
                clearPropertyTable();
            });

        // Update Force
        canvas.UpdateForce();
    };

    // Func: events of i3node
    AssignEventsToi3Node = function (i3node) {
        customNodeEvents(i3node);
        // Events: Node Drag
        i3node.GetSVGGroup().call(getCanvas().GetForceLayout().drag);

    };

    // 批量修改默认节点行为，单独一个node可以直接调用
    // node.onEvent("event",function);
    var customNodeEvents = function (node) {
//		// Events: Mouse Enter
        node.onEvent("mouseenter", function (d) {
            // if no selected edge/node
            if (getSelectedElements().selectedNode == null
                && getSelectedElements().selectedEdge == null)
                SetNodeSelected(d);
        });

        // Events: Mouse Double Click
        node.onEvent("dblclick", function (d) {
            i3NodeOnMouseDblClick(d);
        });


        // When click mouseup, if mouse not move, then trigger show/hide events
        if (i3node.GetNodeType() == "relation") {

            i3node.GetSVGGroup().on(
                "mouseup",
                function (d) {
                    if (config.network.getSelectedElements().isMouseMoved)
                        return;

                    var result = [];
                    alert(d.GetRelationStatus());
                    if (d.GetRelationStatus() == "show") {
                        d.SetRelationStatus("hide");

                        result = config.network.getCanvas().GetForceLayout()
                            .enable_disable_subtree(d, true);

                        for (var i = 0; i < result.length; ++i) {
                            var n = result[i];
                            n.GetSVGGroup().attr("display", "none");

                            var edges = n.GetConnectedEdges();
                            for (var j = 0; j < edges.length; ++j) {
                                edges[j].GetSVGPath().attr("display",
                                    "none");
                            }
                        }
                    } else if (d.GetRelationStatus() == "hide") {
                        d.SetRelationStatus("show");

                        result = config.network.getCanvas().GetForceLayout()
                            .enable_disable_subtree(d, false);

                        for (var i = 0; i < result.length; ++i) {
                            var n = result[i];
                            n.GetSVGGroup().attr("display", "show");

                            var edges = n.GetConnectedEdges();
                            for (var j = 0; j < edges.length; ++j) {
                                edges[j].GetSVGPath().attr("display",
                                    "show");
                            }
                        }
                    }

                });
        }
    };

    function assignNodesEvents(callback) {
        customNodeEvents = callback;
    }

    // Func: events of i3edge
    AssignEventsToi3Edge = function (i3edge) {
        // Events: Mouse Enter
        i3edge.onEvent("mouseenter", function (d) {
            // if no selected edge/node
            if (config.network.getSelectedElements().selectedNode == null
                && config.network.getSelectedElements().selectedEdge == null)
                config.network.SetEdgeSelected(d);
        });
    }

    //修改边的默认事件处理行为
    function assignEdgesEvents(callback) {
        AssignEventsToi3Edge = callback;
    }

    // Events Handler: i3node mousedblclick
    i3NodeOnMouseDblClick = function (i3node) {
        // Clear options
        var selector = document.getElementById("idnodepopselect");
        for (var i = selector.options.length - 1; i >= 0; i--)
            selector.remove(i);

        // Read relation options and then pop Window
        if (i3node.GetNodeType() != "relation") {
            var relations = config.getRelationName[i3node.GetNodeType()];

            var tmp = [];
            for (var relation in relations) {
                var relationName = relations[relation];
                var relationValue = "" + relation;
                tmp.push({
                    value: relationValue,
                    text: relationName
                });
            }
            if (!tmp.length) {
                tmp.push({
                    value: "n/a",
                    text: "暂无关系支持"
                });
            }

            for (var i = 0; i < tmp.length; i++) {
                var newOption = document.createElement("option");
                newOption.setAttribute("value", tmp[i].value);
                newOption.appendChild(document.createTextNode(tmp[i].text));
                selector.appendChild(newOption);
            }

            d3.select("#idnodepop").classed("hidden", false);
            jQuery('#myModa2').modal('show');
        } else {
            console.log("弹出结果集选择窗口");
        }
    }

    // Func: Create node from root node
    addNodeFromRoot = function (nodeData) {
        // Read selected option
        jQuery('#myModal').modal('hide');
        var obj = document.getElementById("idrootnodepopselect");
        var index = obj.selectedIndex;
        var type = obj.options[index].value;
        var text = obj.options[index].text;
        var flag = document.getElementById("idinputtext").value;

        // Create
        var theNewNode = canvas.CreateNodeOnMain(nodeData);
        AssignEventsToi3Node(theNewNode);
        theNewNode.core = false;

        // Update Force
        canvas.UpdateForce();
        return theNewNode;
    }

    // Func: Create node from root node
    addNode = function (nodeData, callback) {
        // Create
        var theNewNode = canvas.CreateNodeOnMain(nodeData);
        AssignEventsToi3Node(theNewNode);
        theNewNode.core = false;

        if (callback) {
            callback(theNewNode);
        }
        // Update Force
        canvas.UpdateForce();
        return theNewNode;
    }

    // Func: exploreNode, create nodes via given relation
    exploreNode = function (nodeDatas, edgeDatas) {
        // Read option
        // var obj = document.getElementById("idnodepopselect");
        // var index = obj.selectedIndex;
        // var relationShip = obj.options[index].value;
        // var text = obj.options[index].text;

        // Explore: 1. link length and relation scale
        var lengthscale = d3.scale.linear().domain([1, 2]).range([90, 150]);
        var relationNodeScale = 0.9;

        // Explore: 2. Read the selected node and read result(TODO)
//		var selected = selectedElements.selectedNode;
//		var selecteNodeType = selected.GetNodeType();

        var newNodes = [];
        var newEdges = [];

//		if (config.getRelationResultType[selecteNodeType] == undefined)
//			return;
        if (nodeDatas != null) {
            for (var i = 0; i < nodeDatas.length; i++) {
                var nodeData = nodeDatas[i];
                if ("relation" == nodeData.type) {

                    // check whether relation node already exists in canvas
                    if (config.network.getCanvas().graphData.nodes.contain(nodeData.id)) {
                        var node = config.network.getCanvas().graphData.nodes.get(nodeData.id);
                        node.displayName = nodeData.displayName;
                        continue;
                    }


                    // Explore: 3. Create relation node
                    var relationNode = config.network.getCanvas().CreateNodeOnMain(
                        nodeData);
                    if (relationNode) {
                        relationNode.Scale(relationNodeScale);
                        relationNode.SetNodeMemo(nodeData.menuVO.menuName);
                        config.network.AssignEventsToi3Node(relationNode);
                        newNodes.push(relationNode);
                    }
                } else {
                    // var nodeText = resultResultType + "-"
                    // + Math.floor(Math.random() * 100);
                    var onenode = config.network.getCanvas().CreateNodeOnMain(
                        nodeData);
                    if (onenode) {
                        config.network.AssignEventsToi3Node(onenode);
                        newNodes.push(onenode);
                    }
                }
            }
        }


        if (edgeDatas != null) {
            for (var i = 0; i < edgeDatas.length; i++) {
                var edgeData = edgeDatas[i];
                if ("relation" == edgeData.linkType) {
                    // Explore: 4. Connect realtion node to selected node
                    var relationEdge = config.network.getCanvas().CreateEdgeOnMain(
                        edgeData.source.id, edgeData.target.id,
                        lengthscale(4), edgeData);
                    if (relationEdge) {
                        config.network.AssignEventsToi3Edge(relationEdge);
                        newEdges.push(relationEdge);
                    }
                } else {
                    var edge = config.network.getCanvas().CreateEdgeOnMain(
                        edgeData.source.id, edgeData.target.id,
                        lengthscale(2), edgeData);
                    if (edge) {
                        config.network.AssignEventsToi3Edge(edge);
                        newEdges.push(edge);
                    }
                }

            }
        }

        autoLink();
        // Update Force
        config.network.getCanvas().UpdateForce();

        return {"nodes": newNodes, "edges": newEdges};
    }

    // Func: select node
    SetNodeSelected = function (i3node) {
        if (i3node == null)
            return;

        // empty other selected state obj
        SetNoneSelected();

        // select this edge and its two nodes
        selectedStateObj.push(i3node);
        var edges = i3node.GetConnectedEdges();
        for (var i in edges) {
            selectedStateObj.push(edges[i]);

            selectedStateObj.push(edges[i].node1);
            selectedStateObj.push(edges[i].node2);
        }
        for (var i in selectedStateObj) {
            d = selectedStateObj[i];
            d.SetStyle("selected");
        }
    }

    // Func: select edge
    SetEdgeSelected = function (i3edge) {
        if (i3edge == null)
            return;

        // empty other selected state obj
        SetNoneSelected();

        // select this edge and its two nodes
        selectedStateObj.push(i3edge);
        selectedStateObj.push(i3edge.GetNode1());
        selectedStateObj.push(i3edge.GetNode2());

        for (var i in selectedStateObj) {
            d = selectedStateObj[i];
            d.SetStyle("selected");
        }
    }

    // Func: empty all selected state
    SetNoneSelected = function () {
        for (var i in selectedStateObj) {
            d = selectedStateObj[i];
            d.SetStyle("normal");
        }
        selectedStateObj.length = 0;
    }

    // Func: Get
    getCanvas = function () {
        return canvas;
    }

    getSelectedElements = function () {
        return selectedElements;
    }

    // vars: mouse
    selectedElements = {
        // selectedNodeIndex:null,
        selectedNode: null,
        selectedEdge: null,

        isMouseMoved: false
    };

    // vars: selected nodes/edges
    selectedStateObj = [];

    localModule = {
        "onClickRootNode": onClickRootNode,
        "onClickBackground": onClickBackground,
        "selectedElements": selectedElements,
        "addNodeFromRoot": addNodeFromRoot,
        "addNode": addNode,
        "exploreNode": exploreNode,
        "assignEdgesEvents": assignEdgesEvents,
        "assignNodesEvents": assignNodesEvents,
        "setCanvasWidthHeight": setCanvasWidthHeight,
        "removeNode": removeNode,
        "getCanvas": getCanvas
    };

    config.network = localModule;
    GO();
    // config.network.GO();

    // click root node
    function onClickRootNode(callback) {
        // Events: root node
        //alert(callback);
        config.network.getCanvas().Geti3RootNode().onEvent("click", callback);
    }

    // click root node
    function onClickBackground(callback) {
        // Events: root node
        config.network.getCanvas().GetBkgRect().on("dblclick", callback);
    }

    function setCanvasWidthHeight(width, height) {
        canvas.attr_svgW = width;
        canvas.attr_svgH = height;
    }

    function removeNode(node) {
        canvas.removeNode(node);
    }


    module.exports = localModule;
});
