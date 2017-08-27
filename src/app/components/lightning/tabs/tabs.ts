import {Component, Input, QueryList, ContentChildren, Output, EventEmitter} from '@angular/core';
import {isInt, toBoolean} from '../util/util';
import {NglTab} from './tab';

@Component({
  selector: 'ngl-tabs',
  moduleId: module.id,
  templateUrl: 'tabs.component.html',
})
export class NglTabs {
  @Input() type: 'default' | 'scoped' = 'default';

  @ContentChildren(NglTab) tabs: QueryList<NglTab>;

  activeTab: NglTab;
  selected: string | number | NglTab;
  @Input('selected') set setSelected(selected: string | number | NglTab) {
    if (selected === this.selected) return;

    this.selected = selected;

    if (!this.tabs) return; // Wait for content to initialize

    this.activate();
  }

  @Output() selectedChange = new EventEmitter<NglTab>();

  @Input() set titleCaps(titleCaps: any) {
    this._titleCaps = toBoolean(titleCaps);
  }
  get titleCaps() {
    return this._titleCaps;
  }

  private _titleCaps = true;

  ngAfterContentInit() {
    // Initial selection after all tabs are created
    this.activate();
    if (!this.activeTab) {
      setTimeout(() => this.select(this.tabs.first));
    }
  }

  select(tab: NglTab) {
    this.selectedChange.emit(tab);
  }

  move(evt: Event, moves: number) {
    evt.preventDefault();

    const tabs = this.tabs.toArray();
    const selectedIndex = tabs.indexOf( this.activeTab );
    this.select( tabs[(tabs.length + selectedIndex + moves) % tabs.length] );
  }

  private activate() {
    if (this.activeTab) {
      this.activeTab.active = false;
    }
    this.activeTab = this.findTab();
    if (this.activeTab) {
      this.activeTab.active = true;
    }
  }

  private findTab(value: any = this.selected): NglTab {
    if (value instanceof NglTab) {
      return value;
    }
    if (isInt(value)) {
      return this.tabs.toArray()[+value];
    }
    return this.tabs.toArray().find((t: NglTab) => {
      return t.id && t.id === value;
    });
  }
}
