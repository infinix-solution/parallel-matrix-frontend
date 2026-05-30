import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

const TOKEN_KEY = 'pm_admin_token';
const EMAIL_KEY = 'pm_admin_email';
const ROLE_KEY = 'pm_admin_role';

export interface LoginResponse {
  token: string;
  email: string;
  role: 'admin' | 'superadmin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  isAuthenticated = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));
  email = signal<string | null>(localStorage.getItem(EMAIL_KEY));
  role = signal<'admin' | 'superadmin' | null>(
    (localStorage.getItem(ROLE_KEY) as any) || null
  );

  isSuperAdmin = computed(() => this.role() === 'superadmin');

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.base}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res?.success && res.data?.token) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem(EMAIL_KEY, res.data.email);
            localStorage.setItem(ROLE_KEY, res.data.role || 'admin');
            this.isAuthenticated.set(true);
            this.email.set(res.data.email);
            this.role.set(res.data.role || 'admin');
          }
        })
      );
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/auth/forgot-password`, { email });
  }

  verifyResetToken(token: string): Observable<ApiResponse<{ email: string }>> {
    return this.http.get<ApiResponse<{ email: string }>>(`${this.base}/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/auth/reset-password`, { token, newPassword });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.isAuthenticated.set(false);
    this.email.set(null);
    this.role.set(null);
  }

  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
}
