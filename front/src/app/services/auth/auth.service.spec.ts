import { fakeAsync, TestBed } from '@angular/core/testing';
import { User } from 'src/app/models/user.model';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

interface LoginResponse {
  message: string;
  token?: string;
  user?: User
}

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

  it('should log in', (done: DoneFn) => {
    fakeAsync(() => {
      const expectedResponse: LoginResponse = {
        message: 'Ha iniciado sesión exitosamente',
        user: {
          _id: 'bfkgjfkgfjkgjfkgfj',
          name: 'Lucas',
          lastname: 'Quintanilla',
          email: 'hola@mail.com',
          isAdmin: true,
          isBanned: false
        },
        token: 'kgjfkgfdkgfdkgjkdfgjkfg'
      }
      httpClientSpy.get.and.returnValue(of(expectedResponse));
  
      service.logIn({email: 'hola@mail.com', password: '12345678'}).subscribe(
        response => {
          expect(response).toEqual(expectedResponse, 'user logged');
          done();
        },
        done.fail
      )
    })
  })
});
