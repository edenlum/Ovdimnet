from typing import Optional, List, Any
from pydantic import BaseModel, Field

# wt_activities.json
class WtActivity(BaseModel):
    sid: int
    aid: int
    atype: int
    billtype: int
    aname: str
    account_no: Optional[Any]
    activity_number: str
    status_code: int
    atype_subclass: int
    payroll_activity_code: Optional[Any]
    activity_color: Optional[Any]
    std_by_dow_dt: bool

class WtActivities(BaseModel):
    wt_activities: List[WtActivity]

# wt_activitytypes.json
class WtActivityType(BaseModel):
    sid: int
    atype: int
    atname: str
    at_alias: Optional[Any]

class WtActivityTypes(BaseModel):
    wt_activitytypes: List[WtActivityType]

# wt_day_types.json
class WtDayType(BaseModel):
    sid: int
    day_type_id: int
    day_type_color: str
    day_type_name: str
    for_planit: bool
    for_budget: bool
    shifts_templates_special_days: bool

class WtDayTypes(BaseModel):
    wt_day_types: List[WtDayType]

# wt_employeetypes.json
class WtEmployeeTypes(BaseModel):
    sid: int
    etype: int
    etname: str
    std_hours_day: Optional[Any]
    std_hours_month: Optional[Any]
    std_hours_week: Optional[Any]
    sun: Optional[Any]
    mon: Optional[Any]
    tue: Optional[Any]
    wed: Optional[Any]
    thu: Optional[Any]
    fri: Optional[bool]
    sat: Optional[Any]
    workday_start_time: str
    percentage_job: Optional[Any]
    tsa_cols_p: bool
    tsa_table: bool
    hours_to_days_rate: int
    diff_ppid: Optional[Any]
    cut_by_pp_ppid: Optional[Any]
    need_app_rej_on_manual: bool
    display_diff: bool
    calc_3month_std_by_actual_days: bool
    calc_3month_std_by_all_std_days: bool
    allowed_delay_minutes: int
    display_day_wo_reporting: bool
    hourly_agreement: bool

# wt_et_cols_defs.json
class WtEtColDef(BaseModel):
    sid: int
    pcol_number: int
    pcol_name: str
    pcol_units: int
    relevant_in_days: bool
    relevant_in_hours: bool
    manual_feed_daily_utype_list: List[Any]
    manual_feed_pp_utype_list: List[Any]
    manual_feed_daily_report_dependance: bool
    daily_report_display_only: bool
    is_break_pcol: bool
    mf_report_display_only: bool
    display_as_units: bool
    for_calculate3monthstd: bool
    overtime: bool
    cont_vacation: bool
    show_in_client_actuals: bool
    external_pcol: str
    vacation_quota: Optional[Any]
    payroll_pcol: Optional[Any]
    std_by_dow_dt: bool
    is_break_return_pcol: bool
    pcol_description: Optional[Any]
    sickness_quota: Optional[Any]

class WtEtColsDefs(BaseModel):
    wt_et_cols_defs: List[WtEtColDef]

# wt_et_cols_display.json
class WtEtColDisplay(BaseModel):
    sid: int
    etype: int
    pcol_number: int
    show_as_col: bool
    show_col_order: int
    show_as_table: bool
    show_as_row: bool
    etcd_id: int

# wt_et_dt.json
class WtEtDtItem(BaseModel):
    sid: int
    etype: int
    day_type_id: int
    std: int
    break_pid_list: Optional[Any]
    break_pid2_list: Optional[Any]
    break_aid_list: Optional[Any]
    break_did_list: Optional[Any]
    break_lid_list: Optional[Any]
    break_cid_list: Optional[Any]
    break_from_hour: Optional[Any]
    break_to_hour: Optional[Any]
    day_work_jgid: Optional[int]
    day_part: int
    std_absence: int
    std_by_plan: bool
    min_interval_between_shifts: str
    absence_wo_dt: bool

# wt_et_pcols.json (schema inferred from first item)
class WtEtPcol(BaseModel):
    sid: int
    etype: int
    day_type_id: int
    pcol_name: str
    pcol_bin_from: int = Field(description="The start of the pcol bin in seconds. should be zero for the first entry and the end of the previous entry for the rest.")
    pcol_bin_to: int = Field(description="The end of the pcol bin in seconds")
    per_job: bool
    pid_list: List[Any]
    pid2_list: List[Any]
    aid_list: List[Any]
    did_list: List[Any]
    lid_list: List[Any]
    cid_list: List[Any]
    cmplt_diff: bool
    pcol_diff_part: int
    hrs_return_amount: int
    hrs_return_absolute: bool
    job_min_hrs: Optional[int]
    job_max_hrs: Optional[int]
    time_from: Optional[str]
    time_to: Optional[str]
    per_job_not_in: bool
    atype_list: List[Any]
    special_back_to_bucket_part: int
    time_start_filter_from: Optional[Any]
    time_start_filter_to: Optional[Any]
    time_end_filter_from: Optional[Any]
    time_end_filter_to: Optional[Any]
    continuum_n_from: Optional[Any]
    continuum_n_to: Optional[Any]
    cut_by_pp_sum_pcol_number: Optional[Any]
    cut_by_pp_sum_from: int
    cut_by_pp_sum_to: int
    description: str
    count_reports_filter_from: Optional[Any]
    count_reports_filter_to: Optional[Any]
    season_ppid: Optional[Any]
    season_pp: Optional[Any]
    shift_num_filter: int
    total_hours_day_from: Optional[Any]
    total_hours_day_to: Optional[Any]
    total_work_hours_day_from: Optional[Any]
    total_work_hours_day_to: Optional[Any]
    first_rep_start_time_filter_from: Optional[Any]
    first_rep_start_time_filter_to: Optional[Any]
    add_to_basic_etype: bool
    get_from_basic_etype: bool
    no_display: bool
    count_reports_filter_all_rows: bool
    billtype_list: List[Any]
    etp_id: int

class Configs(BaseModel):
    wt_employeetypes: WtEmployeeTypes
    wt_et_cols_display: List[WtEtColDisplay]
    wt_et_dt: List[WtEtDtItem]
    # wt_et_pcols: List[WtEtPcol]
