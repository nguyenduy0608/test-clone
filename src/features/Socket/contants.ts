export enum NotificationType {
    // --- general-------
    Season = 'season',
    Harvest = 'harvest',
    Task = 'task',
    Another = 'another',
    //----Season------------
    NewSeason = 'new_season', //Vụa mùa mới
    CompletedSeason = 'completed_season', //Hoàn thành vụ mùa
    InActiveSeason = 'in_active_season', // Dừng canh tác vụ mùa
    InActivePlantbedSeason = 'in_active_plantbed_season', //Dừng canh tác trên luống của vụ mùa
    //----Harvest------------
    HarvestPreparation = 'harvest_preparation', //Cách ngày thu hoạch dự kiến 10 ngày
    IsBeingHarvested = 'is_being_harvested', //Vụ mùa đang diễn ra thu hoạch
    CompletedHarvest = 'completed_harvest', //Kết thúc đợt thu hoạch
    //----Task------------
    NewTask = 'new_task', // Giao công việc mới
    UpdatedTask = 'updated_task', //Cập nhật công việc
    CanceledTask = 'canceled_task', //Huỷ công việc
    ClosedTask = 'closed_task', //Huỷ công việc
    CompletedTask = 'completed_task', //Công việc hoàn thành
    DoneTask = 'done_task', //Công việc người được giao hoàn thành
    SystemTask = 'system_task', //Thông báo công việc từ hệ thống
    BeforeTask = 'before_task', //Trước thực hiện công việc
    NotCompletedTask = 'not_completed_task', //Công việc chưa hoàn thành
    InProgressTask = 'in_progress_task', //Công việc đang được thực hiện
    //----Diary------------
    NewDiary = 'new_diary', // Nhật ký mới
    //----Document------------
    NewDocument = 'new_document', // Tài liệu mới
    //----Message------------
    NewPropose = 'new_propose', // Đề xuất mới
    NewMessage = 'new_message', // Tin nhắn mới
}
export const TASK = [
    'new_task', // Giao công việc mới
    'updated_task', // Cập nhật công việc
    'canceled_task', // Huỷ công việc
    'closed_task', // Huỷ công việc
    'completed_task', // Công việc hoàn thành
    'done_task', // Công việc người được giao hoàn thành
    'system_task', // Thông báo công việc từ hệ thống
    'before_task', // Trước thực hiện công việc
    'not_completed_task', // Công việc chưa hoàn thành
    'in_progress_task',
];
export const HARVEST = [, 'is_being_harvested', 'completed_harvest'];
export const SEASON = [
    'new_season',
    'completed_season',
    'in_active_season',
    'in_active_plantbed_season',
    'harvest_preparation',
];
export const MESAGE = ['new_message'];
export const DIARY = ['new_diary'];
export const DOCCUMENT = ['new_document'];
export const PROPOSE = ['new_propose'];
