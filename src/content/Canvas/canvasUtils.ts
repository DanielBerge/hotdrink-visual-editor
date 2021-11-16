import {Elem} from "../../types";
import {clamp} from "../../utils";

export const WIDTH = window.screen.availWidth - 600;
export const HEIGHT = window.innerHeight;
export const SNAP_SPACE = 10;

export function restrictPlacement(e: any, elem: Elem) {
    e.target.x(clamp(e.target.x(), WIDTH - elem.width));
    e.target.x(Math.round(e.target.x() / SNAP_SPACE) * SNAP_SPACE);
    e.target.y(clamp(e.target.y(), HEIGHT - elem.height));
    e.target.y(Math.round(e.target.y() / SNAP_SPACE) * SNAP_SPACE);
}

export function restrictSize(e: any) {
    e.target.width(Math.round(e.target.width() / SNAP_SPACE) * SNAP_SPACE);
    e.target.height(Math.round(e.target.height() / SNAP_SPACE) * SNAP_SPACE);
}
