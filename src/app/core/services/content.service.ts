import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteContent, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  private contentSignal = signal<SiteContent | null>(null);
  content = this.contentSignal.asReadonly();

  get(): Observable<ApiResponse<SiteContent>> {
    return this.http.get<ApiResponse<SiteContent>>(`${this.base}/site-content`).pipe(
      tap(r => { if (r?.success && r.data) this.contentSignal.set(r.data); })
    );
  }

  update(cfg: Partial<SiteContent>): Observable<ApiResponse<SiteContent>> {
    return this.http.put<ApiResponse<SiteContent>>(`${this.base}/admin/site-content`, cfg).pipe(
      tap(r => { if (r?.success && r.data) this.contentSignal.set(r.data); })
    );
  }

  uploadImage(file: File): Observable<ApiResponse<{ url: string; filename: string }>> {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<ApiResponse<{ url: string; filename: string }>>(`${this.base}/admin/uploads`, fd);
  }

  /** Resolve an image URL — handles relative /uploads paths from the API */
  resolveUrl(url: string | undefined | null): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('assets/')) return url;
    return `${this.base.replace('/api','')}${url}`;
  }
}
