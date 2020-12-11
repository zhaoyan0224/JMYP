# 聚美优品项目

## 首页

    1.点击 "请登录" 跳转到 login 页面；

    2.头部 input 框带有搜索引擎功能

    3.点击 导航栏下的"极速免税店" 跳转到 list 商品列表页面

    4.移入 导航区下的"美妆商城"显示下拉菜单

    5.移入头部 "我的聚美" 和 "更多"，显示下拉菜单

    6.页面 banner 部分是渐隐渐现轮播图
## 列表页

    1.利用jQuery向数据库发送请求，拿到数据渲染到页面

    2.分类标签包含三级筛选，排序方式点击切换正序和倒序

    3.使用jQuery-pagination插件实现分页器效果

    4.点击商品文字，可跳转到详情页

    5.点击头部"我的购物车"，可跳转到购物车页面

    6.点击 "加入购物车" 会将该物品添加到我的购物车内；点击 "去结算"可跳转到购物车页面

## 详情页

    1.光标在详情图上移动时有放大镜效果

    2.点击 + 按钮增加一个数量，点击 - 按钮减少一个数量，当数量值为1时不会出现负数

    3.点击"加入购物车"会将该物品添加到我的购物车内;点击"继续去购物"可跳转到list页面;点击头部 "去购物车结算"可跳转到 cart页面

## 购物车页

    1.带有单选全选功能，点击全选之后，显示总共物品数量以及总金额

    2.点击删除，物品将会移除;车内商品全部删除后会显示"购物车内没有商品"

    3.点击 +/- 改变商品数量值

    4.点击"继续购物"可跳回到 list 页面

## 登录页

    1.点击登录发送请求，接收到请求返回值，判断账户密码是否正确。用户密码正确跳转到首页，如果账户密码不正确输入框会题是账户密码错误
