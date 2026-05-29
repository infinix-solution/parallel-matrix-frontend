import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SliderImage, TeamMember, FormsConfig, ApiResponse, PageConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getSliders(): Observable<ApiResponse<SliderImage[]>> {
    return this.http.get<ApiResponse<SliderImage[]>>(`${this.base}/sliders`);
  }
  getTeam(): Observable<ApiResponse<TeamMember[]>> {
    return this.http.get<ApiResponse<TeamMember[]>>(`${this.base}/team`);
  }
  getFormsConfig(): Observable<ApiResponse<FormsConfig>> {
    return this.http.get<ApiResponse<FormsConfig>>(`${this.base}/forms-config`);
  }

  submitHrEnquiry(payload: FormData): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/enquiries/hr`, payload);
  }
  submitCandidate(payload: FormData): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/enquiries/candidate`, payload);
  }

  uploadSlider(file: File): Observable<ApiResponse<SliderImage>> {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<ApiResponse<SliderImage>>(`${this.base}/admin/sliders`, fd);
  }
  deleteSlider(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/admin/sliders/${id}`);
  }

  createTeam(m: Partial<TeamMember>): Observable<ApiResponse<TeamMember>> {
    return this.http.post<ApiResponse<TeamMember>>(`${this.base}/admin/team`, m);
  }
  updateTeam(id: string, m: Partial<TeamMember>): Observable<ApiResponse<TeamMember>> {
    return this.http.put<ApiResponse<TeamMember>>(`${this.base}/admin/team/${id}`, m);
  }
  deleteTeam(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/admin/team/${id}`);
  }

  updateFormsConfig(cfg: Partial<FormsConfig>): Observable<ApiResponse<FormsConfig>> {
    return this.http.put<ApiResponse<FormsConfig>>(`${this.base}/admin/forms-config`, cfg);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.base}/admin/change-password`, { currentPassword, newPassword });
  }

  // ----- Dynamic Page Builder -----
  getPageConfig(): Observable<ApiResponse<PageConfig>> {
    return this.http.get<ApiResponse<PageConfig>>(`${this.base}/page-config`);
  }

  updatePageConfig(cfg: Partial<PageConfig>): Observable<ApiResponse<PageConfig>> {
    return this.http.put<ApiResponse<PageConfig>>(`${this.base}/admin/page-config`, cfg);
  }
}
