import {Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'ngl-section',
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'section.component.html',
  host: {
    '[class.slds-section]': 'true',
  },
})
export class NglSection {

  @Input() title: string;

  @HostBinding('class.slds-is-open')
  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  toggle(event: Event) {
    event.preventDefault();
    this.openChange.emit(!this.open);
  }
}
