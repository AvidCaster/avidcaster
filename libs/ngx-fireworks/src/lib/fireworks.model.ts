/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export type Point = {
  x: number;
  y: number;
};

export interface ParticleOptions {
  position: Point;
  isRocket?: boolean;
  hue?: number;
  brightness?: number;
}

export interface ActionOptions {
  cw: number;
  ch: number;
  maxRockets: number;
  numParticles: number;
  rocketInitialPoint: number;
  cannons: Point[];
}

export interface FireworksOptions {
  maxRockets?: number;
  numParticles?: number;
  explosionMinHeight?: number;
  explosionMaxHeight?: number;
  explosionChance?: number;
  rocketSpawnInterval?: number;
  width?: number;
  height?: number;
  rocketInitialPoint?: number;
  cannons?: Point[];
}

export interface FireworksExplosionOptions {
  boxHeight: number;
  boxWidth: number;
  minHeight: number;
  maxHeight: number;
  chance: number;
}
