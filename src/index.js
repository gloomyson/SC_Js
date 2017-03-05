"use strict";
exports.__esModule = true;
require("core-js/client/shim");
require("zone.js/dist/zone");
require("@angular/common");
require("rxjs");
require("./index.scss");
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_1 = require("./app");
if (process.env.NODE_ENV === 'production') {
    core_1.enableProdMode();
}
else {
    Error['stackTraceLimit'] = Infinity; // tslint:disable-line:no-string-literal
    require('zone.js/dist/long-stack-trace-zone'); // tslint:disable-line:no-var-requires
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_1.AppModule);
//# sourceMappingURL=index.js.map