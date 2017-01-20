//  工具方法
define(function (require, module, exports) {

    function getData(url, postData, callBack) {

        $.isLoading({text: "加载数据", class: "fa fa-spinner fa-spin"});
        jQuery.ajax({
            url: url,
            type: "post",
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: postData,
            success: function (data) {

                if (data.jsonDataVO != undefined && data.jsonDataVO != null)
                    data = data.jsonDataVO;

                if (data.noteMsg != undefined && data.noteMsg != "") {
                    alert(data.noteMsg);
                }
                if (data.success == undefined || data.success == true) {
                    callBack(data.data);
                }

                $.isLoading("hide");


            },
            error: function (data) {
                $.isLoading("hide");


            }

        });
    }

    function getDataSync(url, postData, callBack) {

        $.isLoading({text: "加载数据", class: "fa fa-spinner fa-spin"});
        jQuery.ajax({
            url: url,
            type: "post",
            async: false,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: postData,
            success: function (data) {

                if (data.jsonDataVO != undefined && data.jsonDataVO != null)
                    data = data.jsonDataVO;

                if (data.noteMsg != undefined && data.noteMsg != "") {
                    alert(data.noteMsg);
                }
                if (data.success == undefined || data.success == true) {
                    callBack(data.data);
                }

                $.isLoading("hide");


            },
            error: function (data) {
                $.isLoading("hide");


            }

        });
    }

    module.exports = {
        "getData": getData,
        "getDataSync": getDataSync
    };
});
