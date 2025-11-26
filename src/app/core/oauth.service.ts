import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../Model/user';
import { LocalStorageService } from './local-storage.service';
import { Location } from '@angular/common';
import { LoginService } from '../services/login.service';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject(null);

  targetURL: any;
  DetailingForm: any[] = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private localStorageService: LocalStorageService,
    private loginService: LoginService
  ) {}

  login(form: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/login`, form)
      .pipe(
        tap((response) => {
          // this.user$.next(response.user);  //Uncomment when use this service
          this.setToken('token', response.accessToken);
          this.setToken('refreshToken', response.refreshToken);
        })
      );
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.user$.next(null);
  }

  //Uncomment when use this service
  getCurrentUser(): Observable<User | null> {
    return this.user$.pipe(
      switchMap((user) => {
        // check if we already have user data
        if (user) {
          return of(user);
        }

        const token = this.localStorageService.getItem('token');
        // if there is token then fetch the current user
        if (token) {
          return this.fetchCurrentUser();
        }

        return of(null);
      })
    );
  }
  //Uncomment when use this service

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/current-user`).pipe(
      tap((user) => {
        //Uncomment when use this service
        //this.user$.next(user);
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.localStorageService.getItem('refreshToken');

    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${environment.apiUrl}/refresh-token`,
        {
          refreshToken,
        }
      )
      .pipe(
        tap((response) => {
          this.setToken('token', response.accessToken);
          this.setToken('refreshToken', response.refreshToken);
        })
      );
  }

  private setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }

  //--------------------------------------NEW START------------------------------------------------

  setDetailingForm(list: any) {
    this.DetailingForm = list;
  }
  getDetailingForm() {
    return this.DetailingForm;
  }

  isAuthenticated(): boolean {
    console.log('current URL ->', this.location.path());
    console.log('HERE IN AUTH SERVICE');
    let lCurrentPath = this.location.path();

    let lPathPresent: boolean = false;
    this.DetailingForm.forEach((item) => {
      if (
        lCurrentPath == item.vchTargetURL ||
        this.targetURL == item.vchTargetURL
      ) {
        lPathPresent = true;
      }
    });

    this.targetURL = undefined;
    return lPathPresent;
  }

  // isAuthenticatedrdering(): boolean {
  //   console.log('HERE IN AUTH SERVICE ORDERING');

  //   let lPathPresent: boolean = false;

  //   let lUserType = this.loginService.GetUserType();
  //   let lCurrentPath = this.location.path();
  //   //alert('current User Type-> ' + lUserType);

  //   if (lUserType == 'AD') {
  //     return true;
  //   }
  //   if (lUserType == 'MJ') {
  //     if (this.targetURL) {
  //       if (this.targetURL.includes('drawingrepository' || 'processorder')) {
  //         this.targetURL = undefined;

  //         return true;
  //       }
  //     } else {
  //           this.targetURL = undefined;
  //         return true;
  //       // if (lCurrentPath.includes('drawingrepository' || 'processorder')) {
  //       //   this.targetURL = undefined;

  //       //   return true;
  //       // }
  //     }
  //   }
  //   if (
  //     lCurrentPath.includes('processorder') ||
  //     this.targetURL.includes('processorder')
  //   ) {
  //     if (
  //       lUserType == 'PL' ||
  //       lUserType == 'AD' ||
  //       lUserType == 'PM' ||
  //       lUserType == 'PA' ||
  //       lUserType == 'P1' ||
  //       lUserType == 'P2' ||
  //       lUserType == 'P3' ||
  //       lUserType == 'PU' ||
  //       lUserType == 'TE' ||
  //       lUserType == 'MJ'
  //     ) {
  //       this.targetURL = undefined;

  //       return true;
  //     }
  //   }
  //   this.targetURL = undefined;

  //   return false;
  // }
  isAuthenticatedrdering(): boolean {
    console.log('HERE IN AUTH SERVICE ORDERING');
 
    let lPathPresent: boolean = false;
 
    let lUserType:any = this.loginService.GetUserType();
    if(!lUserType){
      lUserType = localStorage.getItem('UserType')?localStorage.getItem('UserType'):'';
    }
    let lCurrentPath = this.location.path();
    //alert('current User Type-> ' + lUserType);
 

    // If User is "Administrator", allow access to all Pages.
    if (lUserType == 'AD') {
      return true;
    }

    // If User is not "Administrator" and is routing to "ProcessOrder"
    // Check if User is part of the allowed UsersTypes, else restrict access.
    if (this.targetURL || lCurrentPath) {
      // if (
      //   this.targetURL?.includes('drawingrepository') ||
      //   this.targetURL?.includes('processorder') ||
      //   lCurrentPath?.includes('processorder') ||
      //   lCurrentPath?.includes('drawingrepository')
      // )
      if (
        this.targetURL?.includes('processorder') ||
        lCurrentPath?.includes('processorder')
      )  {
        if (
          lUserType == 'PL' ||
          lUserType == 'AD' ||
          lUserType == 'PM' ||
          lUserType == 'PA' ||
          lUserType == 'P1' ||
          lUserType == 'P2' ||
          lUserType == 'P3' ||
          lUserType == 'PU' ||
          lUserType == 'TE' ||
          lUserType == 'MJ'
        ) {
          this.targetURL = undefined;
          return true;
        } else {
          this.targetURL = undefined;
          return false;
        }
      }
    }

    // If User is not "Administrator" and is not routing to ProcessOrder or DrawingRepo, then only retrict for UserType "MJ".
    if (lUserType != 'MJ') {
      this.targetURL = undefined;
      return true;
    }

    // if (
    //   lCurrentPath.includes('processorder') ||
    //   this.targetURL.includes('processorder')
    // ) {
    //   if (
    //     lUserType == 'PL' ||
    //     lUserType == 'AD' ||
    //     lUserType == 'PM' ||
    //     lUserType == 'PA' ||
    //     lUserType == 'P1' ||
    //     lUserType == 'P2' ||
    //     lUserType == 'P3' ||
    //     lUserType == 'PU' ||
    //     lUserType == 'TE' ||
    //     lUserType == 'MJ'
    //   ) {
    //     this.targetURL = undefined;
 
    //     return true;
    //   }
    // }
    this.targetURL = undefined;
    return false;
  }
}
