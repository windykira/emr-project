package com.haoze.service.system;

import com.haoze.common.model.ResponseResult;
import com.haoze.common.model.Tree;
import com.haoze.model.system.menu.entity.EmrMenuEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 菜单数据服务接口。
 * @author maxl
 * @time 2018-05-07。
 */
@Service
public interface EmrMenuService {


    /**
     * 新增菜单
     * @param menu
     * @return
     */
    ResponseResult save(EmrMenuEntity menu);

    /**
     * 删除菜单
     * @param menuID
     * @return
     */
    ResponseResult remove(String menuID);

    /**
     * 更新菜单
     * @param menu
     * @return
     */
    ResponseResult update(EmrMenuEntity menu);

    /**
     * 获取树形菜单数据
     * @return
     */
    Tree<EmrMenuEntity> getTree();

    /**
     *获取树形菜单数据
     * @param roleId
     * @return
     */
    Tree<EmrMenuEntity> getTree(String roleId);

    /**
     * 查询当前用户关联菜单
     * @param userID
     * @return
     */
    List<Tree<EmrMenuEntity>> listMenuTree(String userID);

    /**
     * 查询当前用户具有权限
     * @param userID
     * @return
     */
    Set<String> listUserPermissions(String userID);

    Set<String> listUserRoles(String userID);

    /**
     * 查詢菜單列表
     * @param params
     * @return
     */
    List<EmrMenuEntity> listMenus(Map<String, Object> params);

    /**
     * 根据ID获取菜单信息
     * @param menuID
     * @return
     */
    EmrMenuEntity get(String menuID);
    
    List<Map> getSubMenuByName(String name);
}
