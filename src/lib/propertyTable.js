//  节点信息的属性表格
define(function (require, module, exports) {

    var config = require("./configCR").exports.config;

    var getData = require("./utility").exports.getData;

    var dynamicLoadPropertyValue = function (event) {
        var postData = {};
        var buttonElement = event.data.button;
        postData["nodeType"] = buttonElement.attr("nodeType");
        postData["nodeValue"] = buttonElement.attr("nodeValue");
        postData["propertyName"] = buttonElement.attr("propertyName");
        getData("/cra/getPropertyValue.json", postData, function (data) {

            buttonElement.html(data);
            buttonElement.removeClass("specialText");
            buttonElement.off('click');
        })
    }

    jQuery("#nodeTable").dynatable({
        features: {
            paginate: false,
            sort: false,
            pushState: false,
            search: false,
            recordCount: false,
            perPageSelect: false
        },
        dataset: {
            records: []
        }
    });

    jQuery("#nodeTable th").each(function () {
        var propertyName = $(this).text();
        if (propertyName == "nodeInfo") {
            $(this).text("节点属性");
        }
    });

    jQuery("#nodeTable").show();


    function isNumber(text) {
        var regu = "^[0-9]+(\.[0-9]+)?$";
        var re = new RegExp(regu);
        return re.test(text)
    }

    function isInArray(value, array) {
        for (var index in array) {
            var textValue = array[index];
            if (textValue == value)
                return true;
        }
        return false;
    }


    var updatePropertyTable = function (data, nodeData) {
        var propertyTable = jQuery("#nodeTable").data("dynatable");
        var nodeType = nodeData.type;
        var sensitiveArray = new Array();
        if (nodeData.sensitiveValue != "") {
            sensitiveArray = nodeData.sensitiveValue.split(";");
        }


        if (config.nodePropertyDisplayCfg == undefined || config.nodePropertyDisplayCfg[nodeType] == undefined)
            return;

        var nodeCfg = config.nodePropertyDisplayCfg[nodeType];


        var array = new Array();
        for (var index in data) {
            var notFound = true;
            for (var cfgName in nodeCfg) {
                var cfgItem = nodeCfg[cfgName];
                if (cfgItem.fieldKey == index) {
                    if (isInArray(index, sensitiveArray)) {
                        array.push({"nodeInfo": index + ":  " + "<text class='specialText' style='margin-left:5px;' nodeType='" + nodeData.type + "' nodeValue='" + nodeData.value + "' propertyName='" + index + "'>" + "加载属性" + "</text>"});
                    } else {
                        if (cfgItem.displayType == "money" && isNumber(data[index])) {
                            var text = (data[index] / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
                            array.push({"nodeInfo": cfgItem.fieldName + ":  " + text});
                        } else {
                            array.push({"nodeInfo": cfgItem.fieldName + ":  " + data[index]});
                        }
                    }

                    notFound = false;
                }
            }

            if (notFound) {
                if (isInArray(index, sensitiveArray)) {
                    array.push({"nodeInfo": index + ":  " + "<text class='specialText' style='margin-left:5px;'  nodeType='" + nodeData.type + "' nodeValue='" + nodeData.value + "' propertyName='" + index + "'>" + "加载属性" + "</text>"});
                } else {
                    array.push({"nodeInfo": index + ":" + data[index]});
                }
            }


        }


        var json = {"records": array};
        propertyTable.records.updateFromJson(json);
        propertyTable.dom.update();


        jQuery("#nodeTable>tbody>tr>td").each(function () {
            jQuery(this).css({"text-align": "left"});
        })

        jQuery("#nodeTable>tbody>tr>td>text").each(function () {
            var buttonElement = jQuery(this);
            buttonElement.on("click", {button: buttonElement}, dynamicLoadPropertyValue);
        });
    };

    var clearPropertyTable = function () {
        var propertyTable = jQuery("#nodeTable").data("dynatable");
        var array = new Array();
        var json = {"records": array};
        propertyTable.records.updateFromJson(json);
        propertyTable.dom.update();

    };

    module.exports = {
        "updatePropertyTable": updatePropertyTable,
        "clearPropertyTable": clearPropertyTable
    };
});
