import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isLogin: BehaviorSubject<boolean>


  // jagdishh_ttl@natsteel.com.sg
  // AD

  // 1067141619@qq.com
  // CU

  GroupName = '';//'jagdishh_ttl@natsteel.com.sg';
  UserType = '';//'AD'
  DisplayName = '';
  UserID:any  = 0;
  HolidayList:any=[];
  customerList_Ordering: any;
  projectList_Ordering: any;

  ValidatedAddress: any;

  constructor() {
    this.isLogin = new BehaviorSubject(false)
  }

  SetGroupName(groupName: any) {
    this.GroupName = groupName;
  }
  SetUserType(userType: any) {
    this.UserType = userType;
  }
  SetDisplayName(displayName: any) {
    this.DisplayName = displayName;
  }

  SetHoliday(holidayList: any) {
    this.HolidayList = holidayList;
  }

  GetGroupName() {
    return this.GroupName;
  }
  GetUserType() {
    return this.UserType;
  }
  GetDislayName() {
    return this.DisplayName;
  }


  SetUserId(UserId: any) {
    this.UserID = UserId;
  }
  GetUserId() {
    return this.UserID;
  }

  GetHoliday() {
    return this.HolidayList;
  }

}
