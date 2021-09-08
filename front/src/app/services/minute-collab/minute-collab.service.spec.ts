import { TestBed } from '@angular/core/testing';
import { MinuteCollabSocket } from 'src/app/sockets/minute-collab.socket'
import { AuthService } from '../auth/auth.service';

import { MinuteCollabService } from './minute-collab.service';

describe('MinuteCollabService', () => {
  let service: MinuteCollabService;
  let socket: MinuteCollabSocket;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [socket, auth]});
    service = TestBed.inject(MinuteCollabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
