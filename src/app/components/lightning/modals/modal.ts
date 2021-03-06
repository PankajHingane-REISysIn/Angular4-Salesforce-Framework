import {Component, Input, Output, ElementRef, EventEmitter, HostListener, ViewChild, ContentChild} from '@angular/core';
import {toBoolean, uniqueId} from '../util/util';
import {NglModalFooter} from './footer';
import {NglModalHeaderTemplate} from './header';

@Component({
  selector: 'ngl-modal',
  moduleId: module.id,
  templateUrl: 'modal.component.html',
  host: {
    'tabindex': '0',
  },
})
export class NglModal {
  @Input() header: string = '';
  @Input() size: 'large';

  @Input() set directional(directional: string | boolean) {
    this._directional = toBoolean(directional);
  }
  get directional() {
    return this._directional;
  }

  @ViewChild('closeButton') closeButton: ElementRef;

  headingId = uniqueId('modal_header');

  @Input() set open(_open: any) {
    _open = toBoolean(_open);
    if (_open === this.open) return;

    this._open = _open;
    if (this.open) {
      setTimeout(() => this.focusFirst());
    }
  }
  get open() {
    return this._open;
  }

  @Output() openChange = new EventEmitter();

  @ContentChild(NglModalHeaderTemplate) headerTpl: NglModalHeaderTemplate;

  @ContentChild(NglModalFooter) footer: NglModalFooter;

  private _open: boolean = true;
  private _directional = false;

  @HostListener('keydown.esc', ['$event'])
  close(evt?: Event) {
    if (evt) {
      evt.stopPropagation();
    }
    this.openChange.emit(false);
  }

  focusFirst() {
    this.closeButton.nativeElement.focus();
  }
};
