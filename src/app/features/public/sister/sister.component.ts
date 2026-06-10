import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';

@Component({
  selector: 'app-sister',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./sister.component.css'],
  templateUrl: './sister.component.html'
})
export class SisterComponent implements OnInit {
  private content = inject(ContentService);

  isLoading = computed(() => this.content.content() === null);
  data = computed<SisterCompanySection | null>(() => this.content.content()?.sisterCompany ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
