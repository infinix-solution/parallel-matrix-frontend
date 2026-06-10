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
import { TabCategorySlidersComponent } from '../tabs/tab-category-sliders.component';

type TabKey = 'sliders' | 'team' | 'forms' | 'builder' | 'content' | 'security' | 'smtp' | 'career-slider' | 'growth-slider';

const SUPER_BADGE = `<span style="font-size:9px;background:linear-gradient(135deg,#d4a84c,#f5cb6f);color:#0a1f44;padding:1px 6px;border-radius:999px;margin-left:4px;vertical-align:middle">SUPER</span>`;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, ToastHostComponent,
    TabSlidersComponent, TabTeamComponent, TabPasswordComponent,
    TabPageBuilderComponent, TabSiteContentComponent, TabSmtpComponent,
    TabCategorySlidersComponent
  ],
  templateUrl: './dashboard.component.html'
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
