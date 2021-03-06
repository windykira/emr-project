package com.haoze.controller.kb;

import com.github.pagehelper.Page;
import com.haoze.common.annotation.Note;
import com.haoze.common.model.PaginationResult;
import com.haoze.common.model.QueryParam;
import com.haoze.common.model.ResponseResult;
import com.haoze.model.emr.emrwriting.entity.EmrCataLogEntity;
import com.haoze.model.repository.entity.DataElementEntity;
import com.haoze.model.repository.entity.DataElementValuesEntity;
import com.haoze.model.repository.vo.DataDictionaryVO;
import com.haoze.model.system.role.entity.EmrRoleEntity;
import com.haoze.service.repository.DataElementService;
import com.haoze.service.repository.DataElementValuesService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 数据元值域控制器信息。
 * @author maxl
 * @time 2018-07-18。
 */
@RequestMapping("repository/dataelementvalues")
@Controller
public class DataElementValuesController {

    @Autowired
    DataElementValuesService dataElementValuesService;
    @Autowired
    DataElementService dataElementService;

    private String prefix = "repository/dictionary/dataelementvalues";

    @GetMapping("/{dataElementId}")
    String elementValues(Model model,@PathVariable("dataElementId") String dataElementId) {

        DataElementEntity dataElementEntity = dataElementService.get(dataElementId);
        model.addAttribute("codeDe",dataElementEntity.getCodeDe());
        model.addAttribute("nameDe",dataElementEntity.getNameDe());
        model.addAttribute("dataElementId",dataElementId);
        return prefix + "/dataelementvalues";
    }

    @GetMapping("/list")
    @ResponseBody
    PaginationResult list(@RequestParam Map<String, Object> params) {

        QueryParam queryParam = new QueryParam(params);
        Page<DataElementValuesEntity> elementValues = dataElementValuesService.list(queryParam);
        int total = dataElementValuesService.count(queryParam);
        PaginationResult paginationResult = new PaginationResult(elementValues, total);
        return paginationResult;
    }

    @GetMapping("/list/{dataElementId}")
    @ResponseBody
    List<DataElementValuesEntity> list(@PathVariable("dataElementId") String dataElementId) {
        QueryParam queryParam = QueryParam.getDefaultQueryParam();
        queryParam.put("dataElementId",dataElementId);
        List<DataElementValuesEntity> elementValues = dataElementValuesService.list(queryParam);
        return elementValues;
    }

    @Note("新增数据元值域")
    //@RequiresPermissions("repository:dataGroup:add")
    @GetMapping("/add")
    String add() {

        return prefix + "/add";
    }

    @GetMapping("/edit/{elementValueId}")
    String edit(Model model, @PathVariable("elementValueId") String elementValueId) {

        DataElementValuesEntity dataElementValuesEntity = dataElementValuesService.get(elementValueId);
        DataElementEntity dataElementEntity = dataElementService.get(dataElementValuesEntity.getPkDataElemt());
        model.addAttribute("dataElementValues",dataElementValuesEntity);
        model.addAttribute("nameDe",dataElementEntity.getNameDe());
        return prefix+"/edit";
    }

    @PostMapping("/update")
    @ResponseBody
    ResponseResult update(DataElementValuesEntity dataElementValuesEntity) {
        return dataElementValuesService.update(dataElementValuesEntity);
    }

    @Note("新增数据元值域")
    //@RequiresPermissions("repository:dataGroup:add")
    @PostMapping("/save")
    @ResponseBody
    ResponseResult save(DataElementValuesEntity dataElementValuesEntity) {
        return dataElementValuesService.insert(dataElementValuesEntity);
    }

    @PostMapping("/delete")
    @ResponseBody
    ResponseResult delete(String dataElementValuesId) {
        return dataElementValuesService.delete(dataElementValuesId);
    }

    @Note("批量删除数据元值域")
    @PostMapping("/batchDelete")
    @ResponseBody
    ResponseResult batchDelete(@RequestParam("ids[]") String[] ids) {
        return dataElementValuesService.batchDelete(ids);
    }

    @PostMapping("/exist")
    @ResponseBody
    boolean exist(@RequestParam Map<String, Object> params) {
        int count = dataElementValuesService.countExact(new QueryParam(params));
        return count == 0;
    }
}
