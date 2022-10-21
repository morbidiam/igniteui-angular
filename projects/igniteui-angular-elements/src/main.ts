import {
    IgxGridComponent
} from 'igniteui-angular';
import { registerConfig } from "./analyzer/elements.config";
import { appRef } from "./utils/app-ref";
import { createIgxCustomElement } from './app/create-custom-element';

const grid = createIgxCustomElement<IgxGridComponent>(IgxGridComponent, { injector: appRef.injector, registerConfig });

let renderer = () => {};
let marker = '';
function setTemplateRenderer(rendererFunc: () => void) {
    marker = 'iIzHere';
    console.log(marker);
    renderer = rendererFunc;
}

export { grid as IgcGridComponent, setTemplateRenderer }
