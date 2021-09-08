import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: AuthService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new AuthService(httpClientSpy as any)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
