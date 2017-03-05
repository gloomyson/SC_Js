"use strict";
exports.__esModule = true;
var hello_1 = require("./hello");
var testing_1 = require("@angular/core/testing");
describe('hello component', function () {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                hello_1.HelloComponent
            ]
        });
        testing_1.TestBed.compileComponents();
    }));
    it('should render hello world', function () {
        var fixture = testing_1.TestBed.createComponent(hello_1.HelloComponent);
        fixture.detectChanges();
        var hello = fixture.nativeElement;
        expect(hello.querySelector('h1').textContent).toBe('Hello World!');
    });
});
//# sourceMappingURL=hello.spec.js.map