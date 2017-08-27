import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'ngl-pill',
  moduleId: module.id,
  templateUrl: 'pill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-pill]': 'true',
  },
})
export class NglPill {
  removable: boolean;
  unlinked: boolean = true;

  @Output() nglPillRemove = new EventEmitter();

  constructor(public detector: ChangeDetectorRef) {}

  remove() {
    this.nglPillRemove.emit(null);
  }
}
