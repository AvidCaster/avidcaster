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

export type FireworkAction = 'start' | 'stop';

export interface FireworksExplosionOptions {
  boxHeight: number;
  boxWidth: number;
  minHeight: number;
  maxHeight: number;
  chance: number;
}
