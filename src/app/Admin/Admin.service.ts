import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiurl: any = environment.apiUrl;

  constructor(private httpClient: HttpClient, private loginService: LoginService) { }

  GetRole(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl +"Admin/GetRoles");
    //return this.httpClient.get<any[]>("https://localhost:5001/GetRoles");

  }

  GetUserByRoleId(RoleId: number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetUserDetailsByRoleId/${RoleId}`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetUserDetailsByRoleId/${RoleId}`);

  }

  GetPageAccessByRoleId(RoleId: number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetPageAccessByRoleId/${RoleId}`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetPageAccessByRoleId/${RoleId}`);

  }
  GetRolesAndPagesAccessDetails(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetRolesAndPagesAccessDetails`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetRolesAndPagesAccessDetails`);

  }

  GetUserAndPageAccessDetailsByRoleId(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetUserAndPageAccessDetailsByRoleId`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetUserAndPageAccessDetailsByRoleId`);

  }

  GetFormList(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetFormList`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetFormList`);

  }

  GetActiveAllUserDirectory(username:any,password:any): Observable<any> {

    return this.httpClient.get<any[]>(this.apiurl + `Admin/GetActiveAllUserDirectory`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/GetActiveAllUserDirectory`);

  }

  CheckDuplicateRole(rolename: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/CheckDuplicateRole/${rolename}`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/CheckDuplicateRole/${rolename}`);

  }

  InsertNewRoles(obj: any) {
    debugger;

    return this.httpClient.post<any>(this.apiurl + `Admin/InsertNewRoles`,obj);

    //return this.httpClient.post<any>(`https://localhost:5001/InsertNewRoles`, obj);
  }

  InsertNewUSers(obj: any) {
    debugger;

    return this.httpClient.post<any>(this.apiurl + `Admin/InsertUsers`,obj);

    //return this.httpClient.post<any>(`https://localhost:5001/InsertUsers`, obj);
  }

  RemoveUSers(UserIds: string) {
    debugger;

    return this.httpClient.delete<any>(this.apiurl + `Admin/RemoveUserRoles/${UserIds}`);

    //return this.httpClient.delete<any>(`https://localhost:5001/RemoveUserRoles/${UserIds}`);
  }

  UpdateRole(UserId: number, RoleId: number) {
    debugger;

    return this.httpClient.get<any>(this.apiurl + `Admin/UpdateUsersRole/${UserId}/${RoleId}`);

    //return this.httpClient.get<any>(`https://localhost:5001/UpdateUsersRole/${UserId}/${RoleId}`);
  }

  UpdateRoleStatus(obj:any) {
    debugger;

    return this.httpClient.post<any>(this.apiurl + `Admin/UpdateRoleStatus`,obj);

//    return this.httpClient.post<any>(`https://localhost:5001/UpdateRoleStatus`,obj);
  }

  CheckDuplicateUserforRole(loginName: any, RoleId?:number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `Admin/CheckDuplicateUserForRole/${loginName}/${RoleId}`);
    //return this.httpClient.get<any[]>(`https://localhost:5001/CheckDuplicateUserForRole/${loginName}/${RoleId}`);

  }

  InsertUpdateRolePrivilage(obj: any) {
    debugger;

    return this.httpClient.post<any>(this.apiurl + `Admin/InsertUpdateRolePrivilage`,obj);

    //return this.httpClient.post<any>(`https://localhost:5001/InsertUpdateRolePrivilage`, obj);
  }

}
