/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { sanitizeJsonStringOrObject, signObject } from '@fullerstack/ngx-shared';
import { StoreService } from '@fullerstack/ngx-store';
import { SystemService } from '@fullerstack/ngx-system';
import { UixService } from '@fullerstack/ngx-uix';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith, pick as ldPick } from 'lodash-es';
import { EMPTY, Observable, Subject, filter, fromEvent, merge, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import {
  ANNOTATOR_ERASER_LINE_WIDTH_EXTRA_WIDTH,
  ANNOTATOR_FADER_ALPHA_DELTA_STEP,
  ANNOTATOR_URL_FULLSCREEN_LIST,
  defaultAnnotatorConfig,
  defaultAnnotatorState,
  defaultLine,
} from './annotator.default';
import {
  ANNOTATOR_STORAGE_KEY,
  AnnotatorState,
  Line,
  LineAttributes,
  Point,
} from './annotator.model';

@Injectable()
export class AnnotatorService implements OnDestroy {
  private nameSpace = 'ANNOTATOR';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AnnotatorState> = defaultAnnotatorState();
  stateSub$: Observable<AnnotatorState>;
  private onStorageOb$: Observable<Event>;
  private undoOb$ = new Subject<void>();
  private redoOb$ = new Subject<void>();
  private trashOb$ = new Subject<void>();
  private saveOb$ = new Subject<void>();
  undo$ = this.undoOb$.asObservable();
  redo$ = this.redoOb$.asObservable();
  trash$ = this.trashOb$.asObservable();
  save$ = this.saveOb$.asObservable();
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly router: Router,
    readonly zone: NgZone,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly system: SystemService,
    readonly uix: UixService,
    readonly layout: LayoutService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ layout: defaultAnnotatorConfig() }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.onStorageOb$ = fromEvent(this.uix.window, 'storage').pipe(
      filter((event: StorageEvent) => !!event.newValue)
    );

    this.claimSlice();
    this.subState();
    this.subStorage();
    this.initState();
    this.layout.registerHeadlessPath(ANNOTATOR_URL_FULLSCREEN_LIST);
    this.logger.info(`[${this.nameSpace}] AnnotatorService ready ...`);
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    if (!this.options?.layout?.logState) {
      this.claimId = this.store.claimSlice(this.nameSpace);
    } else {
      this.claimId = this.store.claimSlice(this.nameSpace, this.logger.debug.bind(this.logger));
    }
  }

  /**
   * Sanitize state
   * @param state state object or stringify json
   * @returns state object
   */
  private sanitizeState(state: AnnotatorState | string): AnnotatorState {
    let sanitized = sanitizeJsonStringOrObject<AnnotatorState>(state);
    if (sanitized) {
      const validKeys = Object.keys(defaultAnnotatorState());
      sanitized = ldPick(sanitized, validKeys) as AnnotatorState;
    }
    sanitized = ldMergeWith(defaultAnnotatorState(), sanitized, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );
    return sanitized;
  }

  /**
   * Initialize Layout state, flatten state, remove any array and object values
   */
  private initState() {
    const storageState = this.uix.localStorage.getItem(ANNOTATOR_STORAGE_KEY);
    const state = this.sanitizeState(storageState);
    this.store.setState(this.claimId, {
      ...state,
      appName: this.options.appName,
      eraser: false,
    });
  }

  /**
   * Subscribe to Layout state changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<AnnotatorState>(this.nameSpace);

    this.stateSub$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (newState) => {
          this.state = { ...defaultAnnotatorState(), ...newState };
          this.uix.localStorage.setItem(
            ANNOTATOR_STORAGE_KEY,
            JSON.stringify(signObject(this.state))
          );
        },
      });
  }

  private subStorage() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$
        .pipe(
          filter((event: StorageEvent) => event.key === ANNOTATOR_STORAGE_KEY),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (event: StorageEvent) => {
            const storageState = sanitizeJsonStringOrObject<AnnotatorState>(event.newValue);
            const state = this.sanitizeState(storageState);
            this.zone.run(() => {
              this.setState({ ...defaultAnnotatorState(), ...state });
            });
          },
        });
    });
  }

  setState(newState: Partial<AnnotatorState>) {
    this.store.setState(this.claimId, {
      ...this.state,
      ...newState,
    });
  }

  undo() {
    this.undoOb$.next();
  }

  redo() {
    this.redoOb$.next();
  }

  trash() {
    this.trashOb$.next();
  }

  /**
   * Merges canvas events into a single stream
   * @param canvasEl canvas element
   * @param eventNames event names
   * @returns observable of events
   */
  fromEvents(canvasEl: HTMLElement, eventNames: string[]): Observable<Event> {
    return eventNames.reduce(
      (prev, name) => merge(prev, fromEvent(canvasEl, name, { passive: true })),
      EMPTY
    );
  }

  /**
   * Given an optional line object, it returns the line object with attributes
   * @param initial initial line object
   * @returns line object
   */
  cloneLine(initial?: Partial<Line>): Line {
    return ldDeepClone({
      ...(initial || defaultLine()),
      attributes: {
        lineCap: this.state.lineCap,
        lineJoin: this.state.lineJoin,
        lineWidth: this.state.eraser
          ? this.state.lineWidth + ANNOTATOR_ERASER_LINE_WIDTH_EXTRA_WIDTH
          : this.state.lineWidth,
        strokeStyle: this.state.eraser ? this.state.bgColor : this.state.strokeStyle,
      },
      eraser: this.state.eraser,
    }) as Line;
  }

  /**
   * Returns the current attributes of canvas
   * @returns line attributes
   */
  getCanvasAttributes(): LineAttributes {
    return {
      lineCap: this.state.lineCap,
      lineJoin: this.state.lineJoin,
      lineWidth: this.state.lineWidth,
      strokeStyle: this.state.strokeStyle,
    };
  }

  /**
   * Given an attribute object, it applies the attribute to the line object
   * @param attr canvas context attributes
   * @param ctx canvas context
   */
  setCanvasAttributes(ctx: CanvasRenderingContext2D, attr: Partial<AnnotatorState>) {
    if (attr) {
      ctx.lineCap = attr.lineCap;
      ctx.lineJoin = attr.lineJoin;
      ctx.lineWidth = attr.lineWidth;
      ctx.strokeStyle = attr.strokeStyle;
    }
  }

  /**
   * Draw a single dot on the canvas
   * @param dot coordinate of a dot
   * @param ctx canvas context
   */
  drawDotOnCanvas(dot: Point, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(dot.x, dot.y);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Given two points, draws a line between them on the canvas
   * @param to coordinates of the end point
   * @param from coordinates of the start point
   */
  drawFromToOnCanvas(to: Point, from: Point, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Creates a svg element path
   * @param from coordinates of the start point
   * @param to coordinates of the end point
   * @param svgEl svg element
   * @param attr svg attributes
   * @returns svg path element
   */
  drawLineOnSVG(from: Point, to: Point, svgEl: HTMLElement, attr: LineAttributes): SVGLineElement {
    const rect = <SVGLineElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg:line');

    rect.setAttributeNS(null, 'x1', from.x.toString());
    rect.setAttributeNS(null, 'y1', from.y.toString());
    rect.setAttributeNS(null, 'x2', to.x.toString());
    rect.setAttributeNS(null, 'y2', to.y.toString());
    rect.setAttributeNS(null, 'stroke', attr.strokeStyle);
    rect.setAttributeNS(null, 'stroke-linejoin', attr.lineJoin);
    rect.setAttributeNS(null, 'stroke-width', attr.lineWidth.toString());
    rect.setAttributeNS(null, 'fill-opacity', '0');

    svgEl.appendChild(rect);
    return rect;
  }

  /**
   * Given multiple points, draw a line between them
   * @param line line information including points and attributes of a line
   */
  drawLineOnCanvas(line: Line, ctx: CanvasRenderingContext2D) {
    const { visible, points } = line;
    if (visible && points.length) {
      const start = points[0];

      const origAttr = this.getCanvasAttributes();
      this.setCanvasAttributes(ctx, line.attributes);

      ctx.beginPath();

      if (points.length < 3) {
        ctx.arc(start.x, start.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
        ctx.fill();
      } else {
        ctx.lineTo(start.x, start.y);
        let idx: number;
        for (idx = 1; idx < points.length - 2; idx++) {
          const from = points[idx];
          const to = points[idx + 1];
          const mid: Point = {
            x: (to.x + from.x) / 2,
            y: (to.y + from.y) / 2,
          };
          ctx.quadraticCurveTo(from.x, from.y, mid.x, mid.y);
        }
        ctx.quadraticCurveTo(points[idx].x, points[idx].y, points[idx + 1].x, points[idx + 1].y);
      }
      ctx.stroke();

      this.setCanvasAttributes(ctx, origAttr);
    }
  }

  /**
   * Make the last visible line hidden
   * @param lines lines to draw
   */
  undoLastLine(lines: Line[]) {
    // working from the end of the array, make n + 1 hidden, where n is the last visible line
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].visible) {
        lines[i].visible = false;
        return;
      }
    }
  }

  /**
   * Make the first hidden line visible
   * @param lines lines to draw
   */
  redoLastLine(lines: Line[]) {
    // handle when all are hidden
    if (lines.length) {
      if (!lines[0].visible) {
        lines[0].visible = true;
        return;
      }
    }

    // checking from end, make n + 1 visible, where n is the last visible line
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].visible) {
        const idx = i === lines.length - 1 ? i : i + 1;
        lines[idx].visible = true;
        return;
      }
    }
  }

  /**
   * Given a line, it adds the points of the line
   * @param point - {x, y}
   * @returns true if the point was indeed added
   */
  addPoint(point: Point, line: Line): boolean {
    const next = this.roundPoint(point);

    if (line.points.length > 0) {
      const prev = line.points[line.points.length - 1];
      if (this.skipPoint(prev, next)) {
        // add point only if point is not to close to previous point
        return false;
      }
    }

    line.points.push(next);

    return !this.skipPoint(line.points[0], next);
  }

  /**
   * If the point is too close to the previous point, it is not added
   * @param point - {x, y}
   * @returns true if the point is too close to the last point
   */
  skipPoint(prev: Point, next: Point): boolean {
    return Math.abs(next.x - prev.x) < 1 && Math.abs(next.y - prev.y) < 1;
  }

  /**
   * Rounds a point to the nearest integer
   * @param point - {x, y}
   * @returns rounded point
   */
  roundPoint(point: Point): Point {
    return {
      x: Math.round(10 * point.x) / 10,
      y: Math.round(10 * point.y) / 10,
    };
  }

  /**
   * Resets the canvas
   * @param canvasEl canvas element
   * @param ctx canvas context
   */
  resetCanvas(canvasEl: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }

  /**
   * Reduce the alpha by a given delta for a given canvas
   * @param canvasEl canvas element
   * @param ctx canvas context
   * @param alphaDelta alpha delta reduction delta
   */
  reduceCanvasAlpha = (
    canvasEl: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    alphaDelta = ANNOTATOR_FADER_ALPHA_DELTA_STEP
  ) => {
    const screenData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
    for (let i = 3; i < screenData.data.length; i += 4) {
      screenData.data[i] -= alphaDelta;
    }
    ctx.putImageData(screenData, 0, 0);
  };

  /**
   * Returns coordinates of the mouse relative to the canvas
   * @param event event - mouse or touch event
   * @param rect rect - canvas element
   * @returns point - {x, y}
   */
  getEventPoint(event: MouseEvent | TouchEvent): Point {
    let point: Point = { x: 0, y: 0 };

    if (event instanceof MouseEvent) {
      point = {
        x: event.clientX,
        y: event.clientY,
      };
    } else if (event instanceof TouchEvent) {
      point = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }

    return point;
  }

  isBackgroundWhite() {
    return this.state.bgColor === '#ffffff';
  }

  triggerSave() {
    this.saveOb$.next();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
