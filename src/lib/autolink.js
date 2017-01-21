define(function (require, module, exports) {

//	var d3 = require('d3');
    var config = require("./configCR").exports.config;

    function setNodeIntelligentLink(sourceNode, targetNode) {
        var sourceId = sourceNode.nodeData.id;
        var targetId = targetNode.nodeData.id;


        var oneedge = config.network.getCanvas().CreateEdgeOnMain(sourceId,
            targetId, 200, {
                "id": ("autoLink_" + sourceId + targetId)
                //				"id" : ("autoLink_" + sourceId + targetId +  Math.round(Math.random() * 50)

            });
        oneedge.is_disabled = true;  // important, for forcelayout
//		oneedge.attr_path_stroke_color = "orange";
//		oneedge.attr_path_stroke_width = 1;
//		oneedge.attr_path_stroke_dasharray = "5 5";
//		oneedge.attr_pathSel_stroke_color = "orange";
//		oneedge.attr_pathSel_stroke_width = 3;	
//		oneedge.attr_pathSel_stroke_dasharray = "5 5";

        oneedge.linkType = "autoLink";
        oneedge.link_normal_class = "auto_link_normal";
        oneedge.link_select_class = "auto_link_select";

        oneedge.SetStyle("normal");
    }

    this.matchColumns = [];

    // ---------------- Intelligent Finder
    function autoLink() {
        // demo
        var columns = config.getAutoLinkColumns
        if (columns != null) {
            var keys = config.network.getCanvas().GetGraphData().nodes.keys;
            var len = keys.length
            var isConnected = true;
            for (i = 0; i < len; i++) {
                var key = keys[i];
                var node1 = config.network.getCanvas().GetGraphData().nodes.get(key);

                if (node1 == null || node1 == undefined) continue;

                if (node1.GetSVGGroup().attr("display") == "none") {
                    continue;
                }

                if (node1.GetNodeType() == "relation") {
                    continue;
                }

                for (j = i + 1; j < len; j++) {
                    var key2 = keys[j];
                    var node2 = config.network.getCanvas().GetGraphData().nodes.get(key2);

                    if (node2 == null || node2 == undefined) continue;
                    if (node2.GetSVGGroup().attr("display") == "none" || node2.GetNodeType() == "relation") {
                        continue;
                    }


                    for (var k = 0; k < columns.length; k++) {
                        var matchCol = columns[k];

                        var valueOne = node1.nodeData[matchCol];
                        var valueTwo = node2.nodeData[matchCol];


                        if (valueOne == undefined || valueTwo == undefined || valueOne != valueTwo) {
                            isConnected = false;
                            break;
                        }
                    }


                    var sourceId = node1.nodeData.id;
                    var targetId = node2.nodeData.id;


                    var edgeId = "autoLink_" + sourceId + targetId;
                    if (config.network.getCanvas().GetGraphData().edges.contain(edgeId)) {
                        continue;
                    }


                    if (isConnected) {
                        setNodeIntelligentLink(node1, node2);
                    }

                    isConnected = true;
                }


            }

            config.network.getCanvas().UpdateForce();

        }
    }


    module.exports = {
        "autoLink": autoLink
    };
});
