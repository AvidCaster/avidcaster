import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Global, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { JwtDto } from '@fullerstack/api-dto';

import {
  AuthStatusDto,
  AuthTokenDto,
  ChangePasswordInput,
  ChangePasswordRequestInput,
  UserCreateInput,
  UserCredentialsInput,
} from './auth.model';
import { AuthService } from './auth.service';
import {
  CookiesDecorator,
  UsePermissions,
  RequestDecorator,
  ResponseDecorator,
  UseRoles,
} from './auth.decorator';
import { SecurityService } from './auth.security.service';

import { AuthGuardGql, AuthGuardRoles } from './auth.guard';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';

@Resolver((of) => AuthTokenDto)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService
  ) {}

  @Mutation((returns) => AuthTokenDto)
  async authSignup(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCreateInput
  ) {
    const user = await this.authService.createUser(data);
    return this.issueToken(user, request, response);
  }

  @Mutation((returns) => AuthTokenDto)
  async authLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCredentialsInput
  ) {
    const user = await this.authService.authenticateUser(data);
    return this.issueToken(user, request, response);
  }

  private issueToken(
    user: User,
    request: HttpRequest,
    response: HttpResponse
  ): AuthTokenDto {
    const payload: JwtDto = {
      userId: user.id,
      sessionVersion: user.sessionVersion,
    };

    request.user = user;
    this.securityService.setHttpCookie(payload, response);
    const token = this.securityService.generateAccessToken(payload);

    return { ok: true, token };
  }

  @Mutation((returns) => AuthTokenDto)
  async authRefreshToken(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload: JwtDto = this.securityService.verifyToken(
      cookies[AUTH_SESSION_COOKIE_NAME]
    );
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid or expired session');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Error - Invalid or inactive user');
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(
        'Error - Invalid session or remotely terminated'
      );
    }

    return this.issueToken(user, request, response);
  }

  @UseGuards(AuthGuardGql)
  @Mutation((returns) => AuthTokenDto)
  async authChangePassword(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload: ChangePasswordInput
  ) {
    const user = await this.securityService.changePassword(
      request.user as User,
      payload.oldPassword,
      payload.newPassword,
      payload.resetOtherSessions
    );

    return this.issueToken(user, request, response);
  }

  @Mutation((returns) => AuthStatusDto)
  async authResetPasswordRequest(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload?: ChangePasswordRequestInput
  ) {
    const user = await this.securityService.validateUserByEmail(payload.email);

    // send email out

    return { ok: true };
  }

  @UseGuards(AuthGuardGql)
  @Mutation((returns) => AuthTokenDto)
  async authResetPassword(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('id') payload?: string
  ) {
    // verify one-time hash key
    const user = await this.securityService.resetPassword(request.user as User);

    return { ok: true };
  }
}
