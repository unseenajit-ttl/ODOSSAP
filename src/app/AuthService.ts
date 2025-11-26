import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService  {
    getToken(): string | null {
      return localStorage.getItem('jwtToken');
    }
  
    isAuthenticated(): boolean {
      // Implement token validation logic here
      const token = this.getToken();
      // Check token expiration, signature, etc.
      return !!token;
    }
  }








}












