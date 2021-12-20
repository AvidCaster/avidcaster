/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, OnDestroy } from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';

import { defaultFireworksOptions } from './fireworks.default';
import { FireworksOptions } from './fireworks.model';
import { Fireworks } from './fireworks.util';

@Injectable()
export class FireworksService implements OnDestroy {
  private finishCallbacks: Array<() => void> = [];
  private ctx: CanvasRenderingContext2D;
  private options = defaultFireworksOptions();
  private fireworks: Fireworks;
  private width: number;
  private height: number;

  private interval;
  private rafInterval;

  constructor(readonly logger: LoggerService) {
    this.logger.debug('FireworksService Started! ... ');
  }

  init(canvasEl: HTMLElement, ctx: CanvasRenderingContext2D, options?: FireworksOptions): void {
    this.options = { ...this.options, ...options };
    this.width = canvasEl.offsetWidth;
    this.height = canvasEl.offsetHeight;
    this.ctx = ctx;
    this.fireworks = new Fireworks({
      maxRockets: this.options.maxRockets,
      numParticles: this.options.numParticles,
      cw: this.width,
      ch: this.height,
      rocketInitialPoint: this.options.rocketInitialPoint,
      cannons: this.options.cannons,
    });
    this.updateActionDimensions(this.width, this.height);
  }

  resize(width: number, height: number): void {
    this.updateActionDimensions(width, height);
  }

  start(): void {
    if (this.interval) {
      this.stop();
    }

    this.interval = setInterval(
      () => this.fireworks.spawnRockets(),
      this.options.rocketSpawnInterval
    );
    this.rafInterval = requestAnimationFrame(() => this.update());
  }

  stop(): void {
    if (this.fireworks) {
      this.fireworks.clear();
      this.pause();
      cancelAnimationFrame(this.rafInterval);
      this.finish();
    }
  }

  private pause(): void {
    clearInterval(this.interval);
    cancelAnimationFrame(this.rafInterval);
    this.interval = null;
  }

  private updateActionDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.fireworks.ch = height;
    this.fireworks.cw = width;
  }

  private clear(force = false): void {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = `rgba(0, 0, 0 ${force ? '' : ', 0.5'})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'lighter';
  }

  private finish(): void {
    this.clear(true);
    this.rafInterval = null;
    this.finishCallbacks.forEach((cb) => cb());
  }

  update(): void {
    this.clear();

    for (const particle of this.fireworks.entries()) {
      particle.draw(this.ctx);
      particle.update();

      if (particle.shouldRemove(this.width, this.height)) {
        this.fireworks.delete(particle);
      } else if (
        particle.shouldExplode({
          boxWidth: this.width,
          boxHeight: this.height,
          minHeight: this.options.explosionMinHeight,
          maxHeight: this.options.explosionMaxHeight,
          chance: this.options.explosionChance,
        })
      ) {
        this.fireworks.explode(particle);
      }
    }

    if (this.interval || this.fireworks.size() > 0) {
      this.rafInterval = requestAnimationFrame(() => this.update());
    } else {
      this.finish();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    cancelAnimationFrame(this.rafInterval);
    this.fireworks.destroy();
    this.fireworks = null;
  }
}
