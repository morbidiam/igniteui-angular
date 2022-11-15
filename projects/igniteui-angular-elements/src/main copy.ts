import { DOCUMENT } from '@angular/common';
import { createEnvironmentInjector, createPlatform, enableProdMode, EnvironmentInjector, importProvidersFrom, Injector, NgZone, PLATFORM_ID, ɵINJECTOR_SCOPE } from '@angular/core';
import { BrowserModule, ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    IgxActionStripComponent,
    IgxColumnComponent,
    IgxColumnGroupComponent,
    IgxColumnLayoutComponent,
    IgxGridComponent,
    IgxGridEditingActionsComponent,
    IgxGridPinningActionsComponent,
    IgxGridToolbarActionsComponent,
    IgxGridToolbarComponent,
    IgxGridToolbarExporterComponent,
    IgxGridToolbarHidingComponent,
    IgxGridToolbarPinningComponent,
    IgxGridToolbarAdvancedFilteringComponent,
    IgxGridToolbarTitleComponent,
    IgxHierarchicalGridComponent,
    IgxPaginatorComponent,
    IgxPivotGridComponent,
    IgxRowIslandComponent,
    IgxTreeGridComponent,
    IgxPivotDateDimension,
    IgxPivotNumericAggregate,
    IgxPivotDateAggregate,
    IgxPivotTimeAggregate,
    IgxPivotAggregate,
    NoopPivotDimensionsStrategy
} from 'igniteui-angular';
import { registerConfig } from './analyzer/elements.config';
// import { createApplication } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { createIgxCustomElement } from './app/create-custom-element';
import { environment } from './environments/environment';

const rootInjector = Injector.create({
    name: 'Root?',
    // providers: [ {provide: PLATFORM_ID, useValue: 'browser'}, { provide: ɵINJECTOR_SCOPE, useValue: 'platform' }, {provide: DOCUMENT, useValue: document, deps: []} ]
    providers: [{ provide: ɵINJECTOR_SCOPE, useValue: 'platform' }, ...ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS]
})
const platform = createPlatform(rootInjector);
const ngZone = new NgZone({});
const injector = createEnvironmentInjector([importProvidersFrom(BrowserModule), importProvidersFrom(BrowserAnimationsModule), {provide: NgZone, useValue: ngZone}], platform.injector as EnvironmentInjector);

const grid = createIgxCustomElement<IgxGridComponent>(IgxGridComponent, { injector: injector, registerConfig });
Object.defineProperty(grid, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid"
});

const treegrid = createIgxCustomElement(IgxTreeGridComponent, { injector: injector, registerConfig });
Object.defineProperty(treegrid, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-tree-grid"
});

const hgrid = createIgxCustomElement(IgxHierarchicalGridComponent, { injector: injector, registerConfig });
Object.defineProperty(hgrid, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-hierarchical-grid"
});

const pivot = createIgxCustomElement(IgxPivotGridComponent, { injector: injector, registerConfig });
Object.defineProperty(pivot, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-pivot-grid"
});

const ri = createIgxCustomElement(IgxRowIslandComponent, { injector: injector, registerConfig } );
Object.defineProperty(ri, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-row-island"
});

const columnGroups = createIgxCustomElement<IgxColumnGroupComponent>(IgxColumnGroupComponent, { injector: injector, registerConfig });
Object.defineProperty(columnGroups, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-column-group"
});

const columnLayout = createIgxCustomElement<IgxColumnLayoutComponent>(IgxColumnLayoutComponent, { injector: injector, registerConfig });
Object.defineProperty(columnLayout, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-column-layout"
});

const column = createIgxCustomElement<IgxColumnComponent>(IgxColumnComponent, { injector: injector, registerConfig });
Object.defineProperty(column, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-column"
});

const pager = createIgxCustomElement(IgxPaginatorComponent, { injector: injector, registerConfig });
Object.defineProperty(pager, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-paginator"
});

const toolbar = createIgxCustomElement(IgxGridToolbarComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbar, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar"
});

const actionStrip = createIgxCustomElement(IgxActionStripComponent, { injector: injector, registerConfig });
Object.defineProperty(actionStrip, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-action-strip"
});
const editingActions = createIgxCustomElement(IgxGridEditingActionsComponent, { injector: injector, registerConfig });
Object.defineProperty(editingActions, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-editing-actions"
});
const pinningActions = createIgxCustomElement(IgxGridPinningActionsComponent, { injector: injector, registerConfig });
Object.defineProperty(pinningActions, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-pinning-actions"
});

/**
 * WARN: createCustomElement default setup is ONLY FOR ROOT ELEMENTS!
 * TODO: MUST be the parent injector!!!!! Otherwise NullInjectorError: No provider for IgxToolbarToken!
 * TODO: In order to provide the parent injector correctly, this can ONLY be registered/initialized
 * after the parent is CREATED - i.e. this should be a custom form of *child def for igc-grid-toolbar*
 * which means custom factory more than likely to handle the component creation process.
 */
const toolbarTitle = createIgxCustomElement(IgxGridToolbarTitleComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarTitle, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-title"
});

const toolbarActions = createIgxCustomElement(IgxGridToolbarActionsComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarActions, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-actions"
});

const toolbarHiding = createIgxCustomElement(IgxGridToolbarHidingComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarHiding, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-hiding"
});

const toolbarPinning = createIgxCustomElement(IgxGridToolbarPinningComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarPinning, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-pinning"
});

const toolbarExport = createIgxCustomElement(IgxGridToolbarExporterComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarExport, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-exporter"
});

const toolbarFilter = createIgxCustomElement(IgxGridToolbarAdvancedFilteringComponent, { injector: injector, registerConfig });
Object.defineProperty(toolbarFilter, 'tagName', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "igc-grid-toolbar-advanced-filtering"
});

export {
    treegrid as IgcGridComponent,
    grid as IgcTreeGridComponent,
    hgrid as IgcHierarchicalGridComponent,
    pivot as IgcPivotGridComponent,
    ri as IgcRowIslandComponent,
    columnGroups as IgcColumnGroupComponent,
    columnLayout as IgcColumnLayoutComponent,
    column as IgcColumnComponent,
    pager as IgcPaginatorComponent,
    toolbar as IgcGridToolbarComponent,
    actionStrip as IgcActionStripComponent,
    editingActions as IgcGridEditingActionsComponent,
    pinningActions as IgcGridPinningActionsComponent,
    toolbarTitle as IgcGridToolbarTitleComponent,
    toolbarActions as IgcGridToolbarActionsComponent,
    toolbarHiding as IgcGridToolbarHidingComponent,
    toolbarPinning as IgcGridToolbarPinningComponent,
    toolbarExport as IgcGridToolbarExporterComponent,
    toolbarFilter as IgcGridToolbarAdvancedFilteringComponent,
    // component API. TODO: Generate all?
    IgxPivotDateDimension as IgcPivotDateDimension,
    IgxPivotNumericAggregate as IgcPivotNumericAggregate,
    IgxPivotDateAggregate as IgcPivotDateAggregate,
    IgxPivotTimeAggregate as IgcPivotTimeAggregate,
    IgxPivotAggregate as IgcPivotAggregate,
    NoopPivotDimensionsStrategy
}
