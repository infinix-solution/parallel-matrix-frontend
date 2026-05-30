import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteContent, ApiResponse } from '../models';

/**
 * ContentService — single source of truth for /api/site-content.
 *
 * Strategy:
 *   1. Public components read `content()` signal directly (no HTTP).
 *   2. Home component calls `load()` once on init — fetches and caches.
 *   3. If a section component mounts BEFORE home (e.g. deep link or
 *      future routing change), it calls `ensureLoaded()` which uses
 *      shareReplay to make exactly one in-flight request shared across
 *      all subscribers.
 *   4. Admin calls `refresh()` after edits to update the signal.
 *
 * Result: exactly ONE GET /api/site-content per page load, not six.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  /** Reactive content signal — components subscribe via effect() or read directly */
  private contentSignal = signal<SiteContent | null>(null);
  content = this.contentSignal.asReadonly();

  /** Cached observable for in-flight deduplication */
  private fetch$: Observable<ApiResponse<SiteContent>> | null = null;

  /**
   * Force a fetch (used by Home component on init, and by admin after save).
   * Always hits the network.
   */
  load(): Observable<ApiResponse<SiteContent>> {
    this.fetch$ = this.http.get<ApiResponse<SiteContent>>(`${this.base}/site-content`).pipe(
      tap(r => { if (r?.success && r.data) this.contentSignal.set(r.data); }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    return this.fetch$;
  }

  /**
   * Lazy fetch — only triggers a network request if content isn't already loaded
   * AND no fetch is in flight. Section components use this for safety in case
   * they mount before Home (e.g. someone deep-links to /admin).
   */
  ensureLoaded(): Observable<ApiResponse<SiteContent>> {
    if (this.contentSignal()) {
      // Already loaded — return synchronous-like observable
      return new Observable<ApiResponse<SiteContent>>(sub => {
        sub.next({ success: true, data: this.contentSignal()! });
        sub.complete();
      });
    }
    if (this.fetch$) return this.fetch$;  // Reuse in-flight
    return this.load();
  }

  /**
   * Explicit refresh — used by admin tabs after save() so the public site
   * sees changes without a page reload (if user navigates back).
   */
  refresh(): Observable<ApiResponse<SiteContent>> {
    return this.load();
  }

  /** Admin: update content and refresh the cache */
  update(cfg: Partial<SiteContent>): Observable<ApiResponse<SiteContent>> {
    return this.http.put<ApiResponse<SiteContent>>(`${this.base}/admin/site-content`, cfg).pipe(
      tap(r => { if (r?.success && r.data) this.contentSignal.set(r.data); })
    );
  }

  /** Backward-compat: kept so existing admin code calling cnt.get() still works */
  get(): Observable<ApiResponse<SiteContent>> {
    return this.load();
  }

  /** Admin: upload an image (returns URL only — doesn't touch the content cache) */
  uploadImage(file: File): Observable<ApiResponse<{ url: string; filename: string }>> {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<ApiResponse<{ url: string; filename: string }>>(`${this.base}/admin/uploads`, fd);
  }

  /** Resolve a relative /uploads/... URL to a fully-qualified URL */
  resolveUrl(url: string | undefined | null): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('assets/')) return url;
    return `${this.base.replace('/api','')}${url}`;
  }
}
