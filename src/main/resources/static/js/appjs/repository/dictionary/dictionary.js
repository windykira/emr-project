$(function () {
    //初始化数据集
    loadDataDictionary();
    $(".dataGroup").hide();
    $(".dataElement").hide();


    //数据组操作
    $(".add-group").click(function () {
        addDataGroup();
    });
    $(".group-delete").click(function () {
        deleteDataGroup();
    });
    $(".group-save").click(function () {
        updateDataGroup();
    });

    //数据元操作
    $(".add-element").click(function () {
        addDataElement();
    });
    $(".element-delete").click(function () {
        deleteDataElement();
    });
    $(".element-save").click(function () {
        updateDataElement();
    });

    //数据元值域操作
    $(".add-value").click(function () {
        addDataElementValue();
    });
    $(".value-delete").click(function () {
        deleteElementValue();
    });

    $("#searchName").keyup(function () {
        selectNode($("#searchName").val());
    });

});

function selectNode(id) {
    if (id != '') {
        //var nodes = zTree.getNodesByParamFuzzy("name", searchName, null);
        var node = zTree.getNodeByParam("id",id);
        zTree.selectNode(node);
    }
}

var currentSelectedNode = "";

function deleteElementValue() {

    var rows = $('#elementValuesTable').bootstrapTable('getSelections');
    if (rows.length == 0) {
        layer.alert('请选择要删除的数据元值域。');
        return;
    }

    layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
        btn: ['确定', '取消']
    }, function () {
        var ids = new Array();
        $.each(rows, function (i, row) {
            ids[i] = row['pkDataEleVal'];
        });
        $.ajax({
            type: 'POST',
            data: {
                "ids": ids
            },
            url: '/repository/dataelementvalues/batchDelete',
            success: function (r) {
                if (r.code == 1) {
                    layer.msg(r.msg);
                    $('#elementValuesTable').bootstrapTable('refresh');
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    }, function () {
    });
}

function addDataElementValue() {

    layer.open({
        type: 2,
        title: "新增数据元值域",
        shadeClose: true,
        area: ['780px', '400px'],
        skin: 'layui-layer-molv',
        offset: 't',
        content: "/repository/dataelementvalues/add"
    })
}

function addDataElement() {

    var selectedNodes = zTree.getSelectedNodes();
    if (selectedNodes.length == 0) {
        layer.alert('请选择父节点。');
        return;
    }

    layer.open({
        type: 2,
        title: "新增数据元",
        shadeClose: true,
        area: ['780px', '400px'],
        skin: 'layui-layer-molv',
        offset: 't',
        content: "/repository/dataelement/add"
    })
}

function addDataGroup() {

    var selectedNodes = zTree.getSelectedNodes();
    if (selectedNodes.length == 0) {
        layer.alert('请选择父节点。');
        return;
    }

    layer.open({
        type: 2,
        title: "新增数据组",
        shadeClose: true,
        area: ['780px', '400px'],
        skin: 'layui-layer-molv',
        offset: 't',
        content: "/repository/datagroup/add"
    })
}

function updateDataGroup() {
    $("#ID").val(zTree.getSelectedNodes()[0].pkBd);
    $.ajax({
        url: "/repository/datagroup/update",
        type: "post",
        data: $('#dataGroupForm').serialize(),
        success: function (r) {
            if (r.code == 1) {
                loadDataDictionary();
                layer.msg("更新成功");
            } else {
                layer.msg(r.msg);
            }
        }
    });
}

function updateDataElement() {
    $("#pkDataElemt").val(zTree.getSelectedNodes()[0].pkBd);
    $.ajax({
        url: "/repository/dataelement/update",
        type: "post",
        data: $('#dataElementForm').serialize(),
        success: function (r) {
            if (r.code == 1) {
                loadDataDictionary();
                layer.msg("更新成功");
            } else {
                layer.msg(r.msg);
            }
        }
    });
}

function deleteDataGroup() {

    var selectedNodes = zTree.getSelectedNodes();
    if (selectedNodes.length == 0) {
        alert("请选择要删除的数据组。");
        return;
    }
    var parentId = selectedNodes[0].pId;
    layer.confirm('确定要删除选中的数据组？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: "/repository/datagroup/delete",
            type: "post",
            data: {
                dataDictionaryId: selectedNodes[0].id
            },
            success: function (r) {
                if (r.code == 1) {
                    layer.msg("删除成功");
                    currentSelectedNode = zTree.getNodeByParam("id",parentId);
                    loadDataDictionary();
                    $(".dataGroup").hide();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

function deleteDataElement() {

    var selectedNodes = zTree.getSelectedNodes();
    if (selectedNodes.length == 0) {
        alert("请选择要删除的数据元。");
        return;
    }
    var parentId = selectedNodes[0].pId;
    layer.confirm('确定要删除选中的数据元？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: "/repository/dataelement/delete",
            type: "post",
            data: {
                dataElementId: selectedNodes[0].pkBd
            },
            success: function (r) {
                if (r.code == 1) {
                    layer.msg("删除成功");
                    currentSelectedNode = zTree.getNodeByParam("id",parentId);
                    loadDataDictionary();
                    $(".dataElement").hide();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

var zTree = "";
function loadDataDictionary() {

    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                currentSelectedNode = treeNode;
                switch (treeNode.nodeType) {
                    case "1":
                        $.ajax({
                            type: "GET",
                            url: "/repository/datagroup/get/" + treeNode.id,
                            success: function (data) {
                                $('#dataGroupForm').initForm(data);
                                $(".dataElement").hide();
                                $(".dataGroup").show();
                            }
                        });
                        break;
                    case "2":
                        $.ajax({
                            type: "GET",
                            url: "/repository/dataelement/get/" + treeNode.id,
                            success: function (data) {
                                $('#dataElementForm').initForm(data);
                                $(".dataGroup").hide();
                                $(".dataElement").show();
                                $('#codeDeForValue').val(data.codeDe);
                                loadElementValues(data.pkDataElemt);
                            }
                        });
                        break;
                }
            }
        }
    };

    $.ajax({
        type: "GET",
        url: "/repository/dictionary/tree",
        success: function (tree) {
            zTree = $.fn.zTree.init($("#dataDictionaryTree"), setting, tree);
            /*if (currentSelectedNode == "") {
                zTree.expandAll(false);
            } else {
                zTree.expandNode(zTree.getNodeByParam("id",currentSelectedNode.id,null));
            }*/
            zTree.setting.view.expandSpeed = "";
             zTree.expandAll(false);
             zTree.setting.view.expandSpeed = "fast";
             selectNode(currentSelectedNode.id)
        }
    });
};

function loadElementValues(pkDataElemt) {

    $("#elementValuesTable").bootstrapTable('destroy');
    $('#elementValuesTable')
        .bootstrapTable(
            {
                method: 'get', // 服务器数据的请求方式 get or post
                url: "/repository/dataelementvalues/list/" + pkDataElemt, // 服务器数据的加载地址
                striped: true, // 设置为true会有隔行变色效果
                dataType: "json", // 服务器返回的数据类型
                pagination: true, // 设置为true会在底部显示分页条
                // queryParamsType : "limit",
                // //设置为limit则会发送符合RESTFull格式的参数
                singleSelect: false, // 设置为true将禁止多选
                iconSize: 'outline',
                toolbar: '#exampleToolbar',
                // contentType : "application/x-www-form-urlencoded",
                // //发送到服务器的数据编码类型
                pageSize: 10, // 如果设置了分页，每页数据条数
                pageNumber: 1, // 如果设置了分布，首页页码
                //search: true, // 是否显示搜索框
                //showColumns: true, // 是否显示内容下拉框（选择显示的列）
                sidePagination: "client", // 设置在哪里进行分页，可选值为"client" 或者
                // "server"
                // queryParams : queryParams,
                // //请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果
                // queryParamsType = 'limit' ,返回参数必须包含
                // limit, offset, search, sort, order 否则, 需要包含:
                // pageSize, pageNumber, searchText, sortName,
                // sortOrder.
                // 返回false将会终止请求
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        field: 'pkDataEleVal',
                        title: '序号',
                        formatter: function (value, row, index) {
                            return index + 1;
                        }
                    },
                    {
                        field: 'codeDeVal',
                        title: '值'
                    },
                    {
                        field: 'nameDeVal',
                        title: '值含义'
                    },
                    {
                        field: 'describe',
                        title: '说明'
                    },
                    {
                        title: '操作',
                        field: 'pkDataEleVal',
                        align: 'center',
                        formatter: function (value, row, index) {
                            var e = '<button  class="btn btn-primary' + '" href="#"  onclick="updateElementValue(\''
                                + value
                                + '\')">编辑</button> ';
                            return e;
                        }
                    }]
            });
}

function updateElementValue(elementValueId) {

    layer.open({
        type: 2,
        title: "数据元值域编辑",
        shadeClose: true,
        area: ['780px', '400px'],
        skin: 'layui-layer-molv',
        content: "/repository/dataelementvalues/edit/" + elementValueId
    })
}