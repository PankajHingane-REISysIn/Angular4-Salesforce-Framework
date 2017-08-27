import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'ngl-badge',
  moduleId: module.id,
  templateUrl: 'badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglBadge {
  @Input() type: string;
};
