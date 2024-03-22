import { TestBed } from '@angular/core/testing';

import { HttpRestAuthInterceptor } from './http-rest-auth-interceptor.service';

describe('HttpRestAuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpRestAuthInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: HttpRestAuthInterceptor = TestBed.inject(HttpRestAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
