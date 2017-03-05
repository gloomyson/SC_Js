import {HelloComponent} from './hello';
import {TestBed, async} from '@angular/core/testing';

describe('hello component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelloComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render hello world', () => {
    const fixture = TestBed.createComponent(HelloComponent);
    fixture.detectChanges();
    const hello = fixture.nativeElement;
    expect(hello.querySelector('h1').textContent).toBe('Hello World!');
  });
});
