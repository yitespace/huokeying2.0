// const host = "https://api.course.yilutongedu.com.cn";   //测试环境
const host = "https://api.camp.huokeying.com.cn"; // 后端api地址

let apiUrl = {

    loginUrl: host + "/api/auth/account_login",                           // 用户登录

    getUserList: host + "/api/private/user/get",                           // 获取用户列表
    user_info: host + "/api/private/user/info",                           // 获取用户列表
    create_user: host + "/api/private/user/create",                          // 创建用户
    update_user: host + "/api/private/user/update",                          // 修改用户

    getQNToken: host + "/api/private/qn/token/get",                  // 上传图片需要获取的地址和token

    GET_MENU_LIST: host + "/api/private/menu/recursion",                          // 菜单递归列表

    GET_ADMIN_ROLE_DETAIL: host + "/api/private/user/admin_role/info",                 // 系统角色详情

    GET_COACH_LIST: host + "/api/public/coach/get",                          // 教练-列表-分页
    GET_COACH_DETAIL: host + "/api/public/coach/info",                          // 教练-列表-详情
    CREATE_COACH: host + "/api/private/coach/admin/create",                          // 人员-新增
    UPDATE_COACH: host + "/api/private/coach/admin/update",                          // 人员-更改


    GET_TRAVEL_USER_LIST: host + "/api/private/travel_user/get",                          // 出行列表


    GET_RETAIL_GOODS_LIST: host + "/api/private/retail/goods/get_list",                          // 获取商品列表
    GET_ALL_RETAIL_GOODS_LIST: host + "/api/private/retail/goods/get_all",                          // 获取商品全部
    GET_RETAIL_GOODS_DETAIL: host + "/api/private/retail/goods/get",                          // 获取商品详情
    CREATE_RETAIL_GOODS: host + "/api/private/retail/goods/add",                          // 创建商品
    UPDATE_RETAIL_GOODS: host + "/api/private/retail/goods/update",                          // 修改商品
    UPDATE_SALES_STATUS: host + "/api/private/retail/goods/update_sales_status",                          // 修改售卖状态
    UPDATE_SPEC_STATUS: host + "/api/private/retail/goods/update_spec_status",                          // 修改规格状态



    GET_COUPON_LIST: host + "/api/private/coupon/admin/get",                          // 优惠券-列表分页
    GET_COUPON_DETAIL: host + "/api/private/coupon/admin/info",                          // 优惠券-详情
    CREATE_COUPON: host + "/api/private/coupon/admin/create",                          // 优惠券新增
    DISTRIBUTE_COUPON: host + "/api/private/coupon/admin/distribute",                          // 发放（生成券码）

    GET_RETAIL_ORDER_LIST: host + "/api/private/retail_order/get_list",                          // 订单列表
    GET_RETAIL_ORDER_DETAIL: host + "/api/private/retail_order/get_detail",                          // 订单详情

    GET_BANNER_LIST: host + "/api/public/banner/get",                          // banner-列表-分页
    GET_BANNER_DETAIL: host + "/api/public/banner/info",                          // banner详情
    UPDATE_BANNER_STATUS: host + "/api/private/banner/admin/status",                          // 修改状态
    CREATE_BANNER: host + "/api/private/banner/admin/create",                          // 新增Banner
    UPDATE_BANNER: host + "/api/private/banner/admin/update",                          // 修改Banner

    GET_QUICK_LINK_LIST: host + "/api/private/quick_link/admin/get",                          // 金刚区-列表-分页
    GET_QUICK_LINK_DETAIL: host + "/api/private/quick_link/admin/info",                          // 金刚区-详情
    UPDATE_QUICK_LINK: host + "/api/private/quick_link/admin/update",                          // 修改金刚区

    GET_ACTIVE_REVIEW_LIST: host + "/api/private/active_review/admin/get",                          // 活动列表-分页
    GET_ACTIVE_REVIEW_DETAIL: host + "/api/private/active_review/admin/info",                          // 活动详情
    CREATE_ACTIVE_REVIEW: host + "/api/private/active_review/admin/create",                          // 新增活动
    UPDATE_ACTIVE_REVIEW: host + "/api/private/active_review/admin/update",                          // 修改活动
    UPDATE_ACTIVE_REVIEW_STATUS: host + "/api/private/active_review/admin/status",                          // 修改活动状态
    GET_COMMENT_LIST: host + "/api/private/active_review/admin/comment/get",                          // 评论列表 
    DEL_COMMENT: host + "/api/private/active_review/admin/comment",                          // 删除评论 

    GET_RECOMMEND_LIST: host + "/api/private/recommend/admin/get",                          // 专区列表-分页
    GET_RECOMMEND_DETAIL: host + "/api/private/recommend/admin/info",                          // 专区详情
    UPDATE_RECOMMEND: host + "/api/private/recommend/admin/update",                          // 修改专区列表

    RELATED_COACH_SIGN: host + "/api/private/coach/admin/sign",                          // 关联签约

    GET_RECURSION_LIST: host + "/api/private/retail/goods/column/get_recursion",                          // 栏目递归列表
    CREATE_GOODS_COLUMN: host + "/api/private/retail/goods/column/add",                          // 创建栏目
    UPDATE_GOODS_COLUMN: host + "/api/private/retail/goods/column/update",                          // 修改栏目

    GET_VERIFY_TEAM_LIST: host + "/api/private/verify_team/admin/get",                          // 旅行团-列表-分页
    CLOSE_VERIFY_TEAM: host + "/api/private/verify_team/admin/close",                          // 关闭旅行团 
    GET_VERIFY_TEAM_DETAIL: host + "/api/private/verify_team/admin/info",                          // 旅行团-详情
    GET_RELATION_ORDER_LIST: host + "/api/private/verify_team/admin/order_candidate_list",                          // 旅行团-候选列表
    CREATE_VERIFY_TEAM: host + "/api/private/verify_team/admin/create",                          // 新建旅行团
    UPDATE_VERIFY_TEAM: host + "/api/private/verify_team/admin/update",                          // 修改旅行团
    VERIFY_ORDER: host + "/api/private/verify_team/admin/verify",                          // 订单核销

    
}

export default apiUrl;
