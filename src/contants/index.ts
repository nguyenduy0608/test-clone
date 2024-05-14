export const STATUS = {
    active: 1,
    unActive: 0,
};

export const ROLE = {
    ROOT_ADMIN: 'admin',
    MANAGER: 'manager',
    TECHNICIAN: 'technician',
    CARETAKER: 'caretaker', // kế toán
    MANAGER_TECHNICIAN: 'manager_technician', // quản lý kho
};

export const TYPE_FLOWER = {
    GROW_ONE: 'grown_one',
    GROWN_MANY_TIMES: 'grown_many_times',
    PERENNIAL: 'perennial',
    // grown_one: cây 1 lần
    // grown_many_times: cây nhiều lần
    // perennial: cây lâu năm
};
export const PROPOSE_STATUS = {
    INPROGRESS: 'in_progress', // Đang chờ xử lí
    PROCESSED: 'processed', // Đã xử lí
    Rejected: 'rejected',
};
export const TYPE_OPTION = {
    NONE: 'none',
    DAILY: 'daily',
    DAYSOFWEEKS: 'days_of_week',
    EXACTDATES: 'exact_dates',
};
export const STATUS_REPORTCONFIG = {
    Completed: 'completed',
    ManyHarvests: 'many_harvests',
    InActive: 'in_active',
    // grown_one: cây 1 lần
    // grown_many_times: cây nhiều lần
    // perennial: cây lâu năm
};
export const STATUS_SEASON = {
    InProgress: 'in_progress', // Đang trồng
    Completed: 'completed', // Hoàn thành
    InActive: 'in_active', // Ngừng hoạt động
    ManyHavests: 'many_harvests', //
};
export const TimeType = {
    DATE: 'date',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter',
    YEAR: 'year',
};
export const STATUS_WORK = {
    InProgress: 'in_progress', // Đang thực hiện
    Completed: 'completed', // Hoàn thành
    InActive: 'closed', // Kết thúc
    InPending: 'pending', // chờ tiếp nhận
    InCancel: 'canceled', //hủy
};

export const IStatus = {
    UNACTIVE: 0,
    ACTIVE: 1,
};

export enum NotificationType {
    ALL = 1, // thông báo tất cả.
    ORDER_SHOP = 2, // thông báo trạng thái đơn hàng.
    COMMENT_POST = 3, // thông báo có người bình luận bài viết.
    LIKE_POST = 4, // thông báo có người thích bài viết.
    SEND_COMMENT = 5, // thông báo shop trả lời bình luận
    LIKE_COMMENT = 6, // thông báo shop thích bình luận
    SHOP_CREATE_LIVESTREAM = 7, // thông báo shop tạo livestream
    REGISTER_USER = 8, // thông báo đăng kí tài khoản thành công được cộng điểm.
    PURCHASE_GIFT = 9, // thông báo có yêu cầu đổi quà web admin.
    CONFIRM_PURCHASE_GIFT = 10, // Thông báo trạng thái đổi quà của bạn.
    NEW_ORDER = 11, // Thông báo shop có đơn hàng cần duyệt.
    GIFT_EXCHANGE = 12, // Thông báo trừ điểm.
    NEWS_POST = 13, // Thông báo bài viết.
    REFERRAL_APP = 14, // Giới thiệu APP thành công.
    PROMOTION_POINT = 15, // Cộng điểm khi đặt hàng thành công.
    REFERRAL_CODE = 16, // Cộng điểm khi nhập mã thành công.
    NEW_MESSAGE = 17, // Có tin nhắn mới.
    ORDER_CANCEL = 18, // kHÁCH HÀNG HỦY ĐƠN HÀNG.
    REQUESTED_FLOWER_DELIVERY = 19,
    APROVE_FLOWER_DELIVERY = 20, // Chấp nhận điện hoa.
    REJECT_FLOWER_DELIVERY = 21, // Từ chối điện hoa.
    REJECT_PURCHASE_GIFT = 22, // Từ chối yêu cầu đổi quà
    SUBTRACT_POINT = 23, // Thông báo trừ điểm
    ADD_POINT = 24, // Cộng điểm
    NEW_REVIEW = 25, // Tạo review
    COIN = 26, // Nạp xu
    NEWS = 27, //Thông báo tin tức
}

export enum GENDER {
    Male = 'male',
    Female = 'female',
    Another = 'another',
}

export enum NEWS_STATUS {
    POST = 'active',
    DRAFT = 'draft',
}

export const ExpenseType = {
    LANDRENTS: 'land_rents',
    LABORCOSTS: 'labor_costs',
    PAKAGINGCOSTS: 'pakaging_costs',
    ANOTHERCOSTS: 'another_costs',
    CULTIVARSCOSTS: 'cultivars_costs',
    PESTICIDESCOSTS: 'pesticides_costs',
    FERTILIZERSCOSTS: 'fertilizers_costs',
};

export const MEDIA_TYPE = {
    IMAGE: 1,
    VIDEO: 0,
};
export const MODE_MESSAGE = {
    DEFAULT: 1,
    SEARCH: 2,
    NOT_READ: 3,
};
export const IS_READ = {
    READ: 1,
    NOT_READ: 0,
};
