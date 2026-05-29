import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, ApiResponse } from '../models';

const TOKEN_KEY = 'pm_admin_token';
const EMAIL_KEY = 'pm_admin_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  isAuthenticated = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));
  email = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.base}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res?.success && res.data?.token) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem(EMAIL_KEY, res.data.email);
            this.isAuthenticated.set(true);
            this.email.set(res.data.email);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.isAuthenticated.set(false);
    this.email.set(null);
  }

  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
}
