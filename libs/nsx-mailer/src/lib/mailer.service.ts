/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAssetFile } from '@fullerstack/nsx-common';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge } from 'lodash';
import { createTransport } from 'nodemailer';
import { Client as PostmarkClient, Message as PostmarkMessage } from 'postmark';
import { DeepReadonly } from 'ts-essentials';

import { DefaultMailerConfig } from './mailer.default';
import { MailerConfig } from './mailer.model';

@Injectable()
export class MailerService implements OnModuleDestroy {
  readonly options: DeepReadonly<MailerConfig> = DefaultMailerConfig;
  private transporter: any;

  constructor(readonly config: ConfigService) {
    this.options = ldNestMerge(
      { ...this.options },
      this.config.get<MailerConfig>('appConfig.mailerConfig')
    );

    this.transporter = this.createMailerInstance();
  }

  private getActionTemplate(): string {
    return getAssetFile('i18n/email-template.html');
  }

  private createMailerInstance() {
    switch (this.options.provider) {
      case 'Gmail':
        return createTransport({
          service: 'Gmail',
          auth: {
            user: this.config.get<string>('MAILER_API_USERNAME'),
            pass: this.config.get<string>('MAILER_API_PASSWORD'),
          },
        });
      case 'Postmark':
        return new PostmarkClient(this.config.get<string>('MAILER_API_KEY'));
    }
  }

  sendGmail(from: string, to: string, subject: string, text: string) {
    this.transporter.sendMail({ from, to, subject, text });
  }

  sendPostmark(message: PostmarkMessage): Promise<any> {
    return this.transporter.sendEmail(message);
  }

  async onModuleDestroy() {
    this.transporter = null;
  }
}