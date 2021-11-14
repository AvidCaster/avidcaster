/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@fullerstack/ngx-config';
import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class SystemElectronInterceptor implements HttpInterceptor {
  constructor(readonly config: ConfigService) {}
  /**
   *
   * @param request outgoing request object
   * @param next next interceptor to call
   * @returns observable of http event type
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
     * Electron is not using http://, instead it uses file://
     */
    if (this.config.options.platform !== 'electron') {
      return next.handle(request);
    }

    if (request.url.startsWith('/')) {
      request = request.clone({
        url: `.${request.url}`,
      });
      console.log('hello', request.url);
    }

    return next.handle(request);
  }
}
