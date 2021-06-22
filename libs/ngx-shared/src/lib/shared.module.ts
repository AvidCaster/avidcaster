/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { AlertComponent } from './component/alert';
import { CardComponent } from './component/card/card.component';
import { ConfirmationDialogComponent } from './component/confirm/confirm.component';
import { HintComponent } from './component/hint/hint.component';
import { LoginFormComponent } from './component/login/login-form.component';
import { RegisterFormComponent } from './component/register/register-form.component';
import { RippleComponent } from './component/ripple/ripple.component';
import { UserProfileFormComponent } from './component/user/profile/profile-form.component';
import { AutocompleteDirective, FormAutocompleteDirective } from './directive/input/autocomplete.directive';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, I18nModule],
  declarations: [
    HintComponent,
    AlertComponent,
    CardComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    LoginFormComponent,
    RegisterFormComponent,
    UserProfileFormComponent,
    AutocompleteDirective,
    FormAutocompleteDirective,
  ],
  exports: [
    HintComponent,
    AlertComponent,
    CardComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    LoginFormComponent,
    RegisterFormComponent,
    UserProfileFormComponent,
    AutocompleteDirective,
    FormAutocompleteDirective,
  ],
  providers: [],
})
export class SharedModule {}
