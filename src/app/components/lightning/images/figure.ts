import {Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'figure[nglFigure]',
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'figure.component.html',
  host: {
    '[class.slds-image]': 'true',
    '[class.slds-image--card]': 'true',
  },
})
export class NglFigure  {
  @Input('nglTitle') title: string = null;

  constructor(public element: ElementRef, public renderer: Renderer2) {  }
};
