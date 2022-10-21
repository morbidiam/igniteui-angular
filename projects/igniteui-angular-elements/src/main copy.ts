import { DOCUMENT } from '@angular/common';
import { createEnvironmentInjector, createPlatform, enableProdMode, EnvironmentInjector, importProvidersFrom, Injector, NgZone, PLATFORM_ID, ɵINJECTOR_SCOPE } from '@angular/core';
import { BrowserModule, ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxGridComponent } from 'igniteui-angular';
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
customElements.define("igc-grid", grid);
