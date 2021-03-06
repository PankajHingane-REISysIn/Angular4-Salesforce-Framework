import {Directive, Input, ElementRef, Renderer2} from '@angular/core';
import {replaceClass} from '../util/util';

@Directive({
  selector: '[nglButton]',
})
export class NglButton {

  private _type: string;
  @Input() set nglButton(type: 'success' | 'neutral' | 'brand' | 'destructive' | 'inverse') {
    replaceClass(this, `${this.prefix}${this._type}`, type ? `${this.prefix}${type}` : '');
    this._type = type;
  }

  private prefix = `slds-button--`;
  constructor(public element: ElementRef, public renderer: Renderer2) {
    this.renderer.addClass(this.element.nativeElement, 'slds-button');
  }

};
