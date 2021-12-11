/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { AuthAnonymousGuard, AuthAuthenticatedGuard } from '@fullerstack/ngx-auth';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { DeactivateGuard } from '@fullerstack/ngx-shared';

import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { EmailChangePerformComponent } from './pages/email-change-perform/email-change-perform.component';
import { EmailChangeRequestComponent } from './pages/email-change-request/email-change-request.component';
import { HomeComponent } from './pages/home/home.component';
import { LanguageChangeComponent } from './pages/language-change/language-change.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';
import { PasswordResetPerformComponent } from './pages/password-reset-perform/password-reset-perform.component';
import { PasswordResetRequestComponent } from './pages/password-reset-request/password-reset-request.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TermsComponent } from './pages/terms/terms.component';
import { UserVerifyComponent } from './pages/user-verify/user-verify.component';

export const AppRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    // keep this redirect till chrome extension is fixed
    path: 'ytchat/overlay',
    pathMatch: 'full',
    redirectTo: 'chat/iframe',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: _('APP.HEADLINE'),
    },
  },
  {
    path: 'about/us',
    component: AboutComponent,
    data: {
      title: _('APP.ABOUT'),
    },
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      title: _('COMMON.TERMS_CONDITIONS'),
    },
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('APP.LOGIN'),
    },
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('APP.SIGNUP'),
    },
  },
  {
    path: 'auth/user/verify/:token',
    component: UserVerifyComponent,
    data: {
      title: _('COMMON.ACCOUNT.VERIFY'),
      description: _('APP.DESCRIPTION.ACCOUNT_VERIFY'),
    },
  },
  {
    path: 'user/profile/update',
    component: ProfileUpdateComponent,
    canActivate: [AuthAuthenticatedGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      title: _('COMMON.PROFILE_UPDATE'),
      description: _('APP.DESCRIPTION.PROFILE_UPDATE'),
    },
  },
  {
    path: 'auth/password/change',
    component: PasswordChangeComponent,
    canActivate: [AuthAuthenticatedGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      title: _('COMMON.PASSWORD_CHANGE'),
      description: _('APP.DESCRIPTION.PASSWORD_CHANGE'),
    },
  },
  {
    path: 'auth/password/reset/request',
    component: PasswordResetRequestComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('COMMON.PASSWORD.RESET_REQUEST'),
      description: _('APP.DESCRIPTION.PASSWORD_RESET_REQUEST'),
    },
  },
  {
    path: 'auth/password/reset/:token',
    component: PasswordResetPerformComponent,
    data: {
      title: _('COMMON.PASSWORD.RENEW'),
      description: _('APP.DESCRIPTION.PASSWORD_RENEW'),
    },
  },
  {
    path: 'auth/email/change/request',
    component: EmailChangeRequestComponent,
    canActivate: [AuthAuthenticatedGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      title: _('COMMON.EMAIL.CHANGE_REQUEST'),
      description: _('APP.DESCRIPTION.EMAIL_CHANGE_REQUEST'),
    },
  },
  {
    path: 'auth/email/change/:token',
    component: EmailChangePerformComponent,
    data: {
      title: _('COMMON.ACCOUNT.EMAIL_CHANGE'),
      description: _('APP.DESCRIPTION.EMAIL_CHANGE'),
    },
  },
  {
    path: 'user/language/change',
    component: LanguageChangeComponent,
    canActivate: [AuthAuthenticatedGuard],
    data: {
      title: _('COMMON.LANGUAGE_CHANGE'),
      description: _('APP.DESCRIPTION.LANGUAGE_CHANGE'),
    },
  },
  {
    path: 'contact/us',
    component: ContactUsComponent,
    canDeactivate: [DeactivateGuard],
    data: {
      title: _('COMMON.CONTACT_US'),
      description: _('COMMON.CONTACT_US'),
    },
  },
  {
    path: 'annotate',
    // canActivate: [AuthAuthenticatedGuard],
    // canDeactivate: [DeactivateGuard],
    loadChildren: () => import('@fullerstack/ngx-annotator').then((m) => m.AnnotatorModule),
  },
  {
    path: 'chat',
    // canActivate: [AuthAuthenticatedGuard],
    // canDeactivate: [DeactivateGuard],
    loadChildren: () => import('@fullerstack/ngx-chat').then((m) => m.ChatModule),
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
