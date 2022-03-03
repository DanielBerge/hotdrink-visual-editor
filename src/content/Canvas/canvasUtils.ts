import {Constraint, Elem} from "../../types";
import {clamp} from "../../utils";

export const WIDTH = window.screen.availWidth - 750;
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

export function getPoints(from: Constraint | Elem, to: Constraint | Elem, spaceFromEnd: number = 8) {
    let fromX = from.x;
    let fromY = from.y;
    let toX = to.x;
    let toY = to.y;
    let fromHeight = from.height;
    let toHeight = to.height;
    let fromWidth = from.width;
    let toWidth = to.width;

    function calculatePlacement(side: number, from: number, to: number) {
        return side / 2 + Math.max(Math.min(side / 2, (from - to) / 2), -side / 2);
    }

    if (Math.abs(fromX - toX) > Math.abs(fromY - toY)) {
        if (fromX < toX) {
            toY += calculatePlacement(toHeight, fromY, toY);
            fromY += fromHeight / 2;
            fromX += fromWidth;
            toX -= spaceFromEnd;
        } else if (fromX > toX) {
            toY += calculatePlacement(toHeight, fromY, toY);
            fromY += fromHeight / 2;
            toX += toWidth;
            toX += spaceFromEnd;
        }
    } else {
        if (fromY < toY) {
            toX += calculatePlacement(toWidth, fromX, toX);
            fromX += fromWidth / 2;
            fromY += fromHeight;
            toY -= spaceFromEnd;
        } else if (fromY > toY) {
            toX += calculatePlacement(toWidth, fromX, toX);
            fromX += fromWidth / 2;
            toY += toHeight;
            toY += spaceFromEnd;
        }
    }

    return [fromX, fromY, toX, toY]
}
