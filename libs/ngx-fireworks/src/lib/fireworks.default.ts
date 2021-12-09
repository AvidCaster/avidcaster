/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { cloneDeep as ldDeepClone } from 'lodash-es';

import { FireworksOptions } from './fireworks.model';

export const DefaultFireworksOptions: FireworksOptions = {
  rocketSpawnInterval: 150,
  maxRockets: 3,
  numParticles: 100,
  explosionMinHeight: 0.2,
  explosionMaxHeight: 0.8,
  explosionChance: 0.08,
  width: 400,
  height: 200,
  rocketInitialPoint: null,
  cannons: [],
};

export const defaultFireworksOptions = (): FireworksOptions => {
  return ldDeepClone(DefaultFireworksOptions);
};
