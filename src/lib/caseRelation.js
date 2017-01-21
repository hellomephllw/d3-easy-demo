define(function (require, module, exports) {

    var ng = require('./networkgraphCR');
    var autoLink = require('./autolink').exports.autoLink;
    var config = require("./configCR").exports.config;

    // var updatePropertyTable = require("./propertyTable").exports.updatePropertyTable;
    var refreshPagingTable = require("./nodePage").exports.refreshPagingTable;
    var getData = require("./utility").exports.getData;
    var getDataSync = require("./utility").exports.getDataSync;

    var showExtendNodeModal = require("./extendNode").exports.showExtendNodeModal;
    var confirmExtendNodeModal = require("./extendNode").exports.confirmExtendNodeModal;

    var showNodePageModal = require("./nodePage").exports.showNodePageModal;

    // prevent enter key submit
    jQuery(window).keydown(function (event) {

        if (event.keyCode == 13) {

            event.preventDefault();
            return false;
        }

    });


    // initial entity type list
    // Modified by zongzheng , change to syncMode to insurance all icon loaded
    getDataSync("/cra/loadEntityTypeList.json", null, function (data) {
        var selector = document.getElementById("idrootnodepopselect");
        config.entityDescCfg = data;
        var entityArrays = data;
        for (var key in entityArrays) {
            // init entity select options
            var newOption = document.createElement("option");
            newOption.setAttribute("value", entityArrays[key].nodeType);
            newOption.appendChild(document.createTextNode(decodeURI(entityArrays[key].nodeDesc)));
            selector.appendChild(newOption);

            // added by xubo.wuxb,load icon
            var entityType = entityArrays[key].nodeType;
            config.getSVGPath[entityType] = entityArrays[key].icon;
        }

    });

    getData("/cra/getAllEntityFieldCfg.json", null, function (data) {
        config.nodePropertyDisplayCfg = data;
    });


    // 点击root node 事件处理
    ng.exports.onClickRootNode(function () {
        jQuery("#myModal").modal("show");
    });


    // 设置自动匹配,需要在type中配置节点的需匹配字段
    ng.exports.onClickBackground(autoLink);
    ng.exports.assignNodesEvents(function (node) {


        if (node.GetNodeType() == "relation") {
            node.onEvent("dblclick", function (node) {
                showNodePageModal(node);
            });

            node.onEvent("mousedown", function (node) {
                if (d3.event.which == 3) {
                    showNodePageModal(node);
                    d3.event.defaultPrevented = true;
                }
            });

        } else {
            node.onEvent("dblclick", function (node) {

                getData("/cra/getRelationEntityCount.json", node.nodeData, function (data) {
                    showExtendNodeModal(data);
                });

            });

            node.onEvent("mouseover", function (node) {
                var selectedNode = ng.exports.selectedElements.selectedNode;
                if (selectedNode == null || selectedNode == undefined) {
                    var properties = node.nodeData.properties;
                    updatePropertyTable(properties, node.nodeData);
                }
            });


            node.onEvent("mousedown", function (node) {
                if (d3.event.which = 1) {
                    var properties = node.nodeData.properties;
                    updatePropertyTable(properties, node.nodeData);
                }

            });


            //    node.onEvent("contextmenu",function(node){
            //	    if(d3.event.which == 3){
            //	     //    d3.event.cancelBubble = true;
            //		//	 d3.event.returnValue = false;
            //		//	 d3.event.defaultPrevented = true;
            //	    }
            //
            //			//
            //
            //	})


        }


        // When click mouseup, if mouse not move, then trigger show/hide events
        if (node.GetNodeType() == "relation") {
            node.GetSVGPath().on(
                "mousedown",
                function (d) {
                    //if (config.network.getSelectedElements().isMouseMoved)
                    //	return;

                    var result = [];
                    if (d.GetRelationStatus() == "show") {
                        ng.exports.getCanvas().hideNode(d, false);
                    } else if (d.GetRelationStatus() == "hide") {
                        ng.exports.getCanvas().showNode(d, false);
                    }

                });
        }

    });

    // 点击添加按钮，添加root node
    jQuery("#idinputbutton").click(function () {
        var nodeType = jQuery("#idrootnodepopselect").val();
        var nodeValue = jQuery("#idinputtext").val();
        if (nodeValue == "" || jQuery.trim(nodeValue) == "") {
            alert("输入不能为空");
            return;
        }
        var postData = {};
        postData["type"] = nodeType;
        postData["value"] = nodeValue;
        getData("getEntity.json", postData, function (data) {
            ng.exports.addNodeFromRoot(data);

            autoLink();
        });

    });

    jQuery('#mymodal2-sure').click(confirmExtendNodeModal);

    // query from task search , parse result to display
    var isQueryFromTaskSearch = jQuery("#queryFromTaskSearch").val();
    if (isQueryFromTaskSearch) {
        var taskQueryResult = jQuery("#taskQueryResult").val();
        if (!taskQueryResult) {
            return;
        }

        var tasksResult = jQuery.parseJSON(taskQueryResult);
        if (tasksResult.data.length == 0) {
            alert("没有查询到数据，请重新选择查询");
            return;
        }

        var nodes = tasksResult.data;
        for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
            var eachNode = nodes[nodeIndex];
            ng.exports.addNode(eachNode);
        }

    }

});
