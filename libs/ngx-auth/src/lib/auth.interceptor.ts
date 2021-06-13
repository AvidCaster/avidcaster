import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.auth = this.injector.get(AuthService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // include cookie in all request
    request = request.clone({ withCredentials: true });

    // include token only/if we have one
    if (this.auth && this.auth.state.token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `${JWT_BEARER_REALM} ${this.auth.state.token}`,
        },
      });
    }

    return next.handle(request).pipe(
      debounceTime(100),
      map((event) => {
        if (event instanceof HttpResponse && event?.type) {
          return event;
        }
      })
    );
  }
}