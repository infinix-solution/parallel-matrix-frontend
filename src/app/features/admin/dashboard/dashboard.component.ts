import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastHostComponent } from '../../../shared/toast-host/toast-host.component';
import { TabSlidersComponent } from '../tabs/tab-sliders.component';
import { TabTeamComponent } from '../tabs/tab-team.component';
import { TabPasswordComponent } from '../tabs/tab-password.component';
import { TabPageBuilderComponent } from '../tabs/tab-page-builder.component';
import { TabSiteContentComponent } from '../tabs/tab-site-content.component';
import { TabSmtpComponent } from '../tabs/tab-smtp.component';

type TabKey = 'sliders' | 'team' | 'forms' | 'builder' | 'content' | 'security' | 'smtp';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, ToastHostComponent,
    TabSlidersComponent, TabTeamComponent, TabPasswordComponent,
    TabPageBuilderComponent, TabSiteContentComponent, TabSmtpComponent
  ],
  template: `
    <div class="adm-shell">
      <div class="adm-top">
        <div class="container row">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="assets/logo.jpeg" alt="" style="width:42px;height:42px;border-radius:10px;padding:3px;background:#fff;box-shadow:var(--shadow-sm)">
            <div>
              <div style="font-family:'Sora',sans-serif;font-weight:800;color:var(--navy)">
                Admin Dashboard
                <span *ngIf="auth.isSuperAdmin()"
                      style="font-size:10px;background:linear-gradient(135deg,#d4a84c,#f5cb6f);color:#0a1f44;padding:2px 8px;border-radius:999px;margin-left:8px;letter-spacing:.1em;vertical-align:middle">
                  SUPER
                </span>
              </div>
              <div style="font-size:12px;color:var(--mute)">Signed in as {{ auth.email() }}</div>
            </div>
          </div>
          <div style="display:flex;gap:10px">
            <a class="adm-btn ghost" href="/" target="_blank">View site &#x2197;</a>
            <button class="adm-btn danger" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="adm-tabs">
          <button [class.active]="tab==='sliders'" (click)="tab='sliders'">🖼 Image Slider</button>
          <button [class.active]="tab==='team'"    (click)="tab='team'">👥 Leadership Team</button>
          <button [class.active]="tab==='builder'" (click)="tab='builder'">🧩 Page Builder</button>
          <button *ngIf="auth.isSuperAdmin()" [class.active]="tab==='content'" (click)="tab='content'">
            🎨 Site Content
            <span style="font-size:9px;background:#d4a84c;color:#0a1f44;padding:1px 6px;border-radius:999px;margin-left:4px;vertical-align:middle">SUPER</span>
          </button>
          <button *ngIf="auth.isSuperAdmin()" [class.active]="tab==='smtp'" (click)="tab='smtp'">
            📧 Email Settings
            <span style="font-size:9px;background:#d4a84c;color:#0a1f44;padding:1px 6px;border-radius:999px;margin-left:4px;vertical-align:middle">SUPER</span>
          </button>
          <button [class.active]="tab==='security'" (click)="tab='security'">🔐 Security</button>
        </div>

        <app-tab-sliders      *ngIf="tab==='sliders'"></app-tab-sliders>
        <app-tab-team         *ngIf="tab==='team'"></app-tab-team>
        <app-tab-page-builder *ngIf="tab==='builder'"></app-tab-page-builder>
        <app-tab-site-content *ngIf="tab==='content' && auth.isSuperAdmin()"></app-tab-site-content>
        <app-tab-smtp         *ngIf="tab==='smtp'    && auth.isSuperAdmin()"></app-tab-smtp>
        <app-tab-password     *ngIf="tab==='security'"></app-tab-password>
      </div>
    </div>
    <app-toast-host></app-toast-host>
  `
})
export class DashboardComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  tab: TabKey = 'sliders';

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
