import { Component, OnInit, ElementRef } from '@angular/core';
import { Editor, Column, GridOption, EditorArguments } from 'angular-slickgrid';

@Component({
  selector: 'app-ng-select-editor',
  template: `
    <ng-select
      [(ngModel)]="currentValue"
      [items]="options"
      (change)="onChange($event)"
      [appendTo]="'body'"
      [clearable]="false"
      [searchable]="true"
      bindLabel="label"
      bindValue="value"
    ></ng-select>
  `,
  styles: [`
    ng-select {
      width: 100%;
    }
  `]
})
export class NgSelectEditorComponent implements Editor, OnInit {
  options: any[] = [];
  currentValue: any;
  args!: EditorArguments;
  columnDef!: Column;

  constructor(private elRef: ElementRef) {}
  dataContext?: any;
  disabled?: boolean | undefined;
  changeEditorOption?: ((optionName: any, newValue: any) => void) | undefined;
  disable?: ((isDisabled?: boolean) => void) | undefined;
  reset?: ((value?: any, triggerCompositeEventWhenExist?: boolean, clearByDisableCommand?: boolean) => void) | undefined;
  save?: (() => void) | undefined;
  cancel?: (() => void) | undefined;
  hide?: (() => void) | undefined;
  show?: (() => void) | undefined;
  position?: ((position: any) => void) | undefined;
  destroy!: () => void;
  isValueTouched?: (() => boolean) | undefined;
  renderDomElement?: ((collection?: any[]) => any | void) | undefined;
  setValue?: ((value: any, isApplyingValue?: boolean, triggerOnCompositeEditorChange?: boolean) => void) | undefined;

  ngOnInit() {
    this.columnDef = this.args.column;
    this.options = this.args?.column?.editor?.params.collection;
    this.currentValue = this.args.item[this.args.column.field];
  }

  init(args: any) {
    this.args = args;
    this.options = this.args.column.editor?.params.collection;
    this.currentValue = this.args.item[this.args.column.field];
    setTimeout(() => this.focus());
  }

  focus() {
    const selectEl = this.elRef.nativeElement.querySelector('ng-select');
    if (selectEl) {
      selectEl.focus();
    }
  }

  onChange(event: any) {
    this.args.grid.getDataItem(this.args.grid.getActiveCell().row)[this.args.column.field] = event;
    this.args.grid.invalidate();
  }

  applyValue(item: any, state: any) {
    item[this.columnDef.field] = state;
  }

  serializeValue() {
    return this.currentValue;
  }

  loadValue(item: any) {
    this.currentValue = item[this.columnDef.field];
  }

  isValueChanged() {
    return this.currentValue !== this.args.item[this.args.column.field];
  }

  validate() {
    return {
      valid: true,
      msg: null
    };
  }
}
