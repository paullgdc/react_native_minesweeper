import update from "immutability-helper";

import { range, shuffle } from "../../utils";
import { TileModel, TileKind, Visibility } from "../../components/Tile";
import { Grid } from "../../components/MinesweeperGrid";


export default interface MineSweeperState {
    playState: "playing" | "lost" | "won";
    grid: Grid;
    bombNumber: number;
    flagNumber: number;
    tilesLeft: number;
    bombs?: Set<string>;
    width: number;
    height: number;
}


export interface Pos {
    x: number;
    y: number;
}

export const placeBombs = (
    s: MineSweeperState, excluded: Pos
): MineSweeperState => {
    const tiles = []
    for (const x of range(0, s.width)) {
        for (const y of range(0, s.height)) {
            if (x !== excluded.x || y !== excluded.y) {
                tiles.push({ x, y })
            }
        }
    }
    shuffle(tiles);
    const bombs = new Set(tiles.slice(0, s.bombNumber).map(p => JSON.stringify(p)));

    const newGrid: Grid = [];
    for (const x of range(0, s.width)) {
        newGrid.push([]);
        for (const y of range(0, s.height)) {
            newGrid[x].push(bombs.has(JSON.stringify({ x, y })) ? {
                kind: TileKind.Bomb,
                visibility: Visibility.Hidden,
            } : {
                    kind: TileKind.Void,
                    neighboringBombNb: 0,
                    visibility: Visibility.Hidden,
                })
        }
    }
    for (const bomb of bombs) {
        for (const neighPos of tileNeighbors(s, JSON.parse(bomb))) {
            const neighbor = newGrid[neighPos.x][neighPos.y];
            if (neighbor.kind === TileKind.Void) {
                neighbor.neighboringBombNb += 1;
            }
        }
    }
    return { ...s, bombs, grid: newGrid }
}

export const init = (width: number, height: number, bombNumber: number) => {
    const state: MineSweeperState = {
        playState: "playing",
        tilesLeft: width * height - bombNumber,
        width,
        height,
        bombNumber,
        grid: [],
        flagNumber: 0,
    };
    state.width = width;
    state.height = height;
    state.grid = [];
    for (const x of range(0, width)) {
        state.grid.push([]);
        for (const _ of range(0, height)) {
            state.grid[x].push({
                kind: TileKind.Void,
                neighboringBombNb: 0,
                visibility: Visibility.Hidden,
            })
        }
    }
    return state;
}

export function* tileNeighbors(s: MineSweeperState, { x, y }: Pos) {
    for (const i of range(x - 1, x + 2)) {
        for (const j of range(y - 1, y + 2)) {
            if ((i !== x || j !== y) &&
                (0 <= i && i < s.width) &&
                (0 <= j && j < s.height)
            ) {
                yield { x: i, y: j }
            }
        }
    }
}

export const revealTile = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    if (s.grid[x][y].kind === TileKind.Bomb) {
        return update(s, {
            playState: { $set: "lost" },
            grid: (g: TileModel[][]) => g.map(
                c => c.map(
                    t => ({ ...t, visibility: Visibility.Revealed })
                )
            )
        });
    }
    let n = update(s, {
        tilesLeft: left => left - 1,
        grid: { [x]: { [y]: { visibility: { $set: Visibility.Revealed } } } },
    });
    if(n.tilesLeft === 0) {
        n = update(n, {
            playState: {$set: "won"},
        });
    }
    return n;

}

export const toogleFlagged = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    const tile = s.grid[x][y];
    if (tile.visibility !== Visibility.Revealed) {
        const n = update(s, {
            grid: {
                [x]: {
                    [y]: {
                        visibility: (v) => (v === Visibility.Flagged ? Visibility.Hidden : Visibility.Flagged)
                    }
                }
            },
            flagNumber: (n) => tile.visibility === Visibility.Flagged ? n - 1 : n + 1,
        });
        return n
    }
    return s
}
