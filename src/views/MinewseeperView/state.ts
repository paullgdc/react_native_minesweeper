import update from "immutability-helper";

import { range, shuffle } from "../../utils";
import { TileModel, TileKind, Visibility, Pos, VoidTile } from "../../components/Tile";
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
                pos: { x, y },
            } : {
                    kind: TileKind.Void,
                    neighboringBombNb: 0,
                    visibility: Visibility.Hidden,
                    pos: { x, y },
                })
        }
    }
    for (const bomb of bombs) {
        for (const oldNeigh of tileNeighbors(s, JSON.parse(bomb))) {
            const neighbor = newGrid[oldNeigh.pos.x][oldNeigh.pos.y];
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
        for (const y of range(0, height)) {
            state.grid[x].push({
                kind: TileKind.Void,
                neighboringBombNb: 0,
                visibility: Visibility.Hidden,
                pos: { x, y },
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
                yield s.grid[i][j];
            }
        }
    }
}

export const revealTile = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    let tile = s.grid[x][y];
    if (s.playState !== "playing" || tile.visibility === Visibility.Flagged) {
        return s;
    }

    let newState = s;
    if (s.bombs === undefined) {
        newState = placeBombs(newState, { x, y });
        tile = newState.grid[x][y];
    }
    if (tile.kind === TileKind.Bomb) {
        return update(newState, {
            playState: { $set: "lost" },
            grid: (g: TileModel[][]) => g.map(
                c => c.map(
                    t => ({ ...t, visibility: Visibility.Revealed })
                )
            )
        });
    }
    const revealedTiles = propagateTileReveal(newState, tile);
    const updates = {} as any;
    for (const tile of revealedTiles) {
        if (!updates[tile.pos.x]) updates[tile.pos.x] = {};
        updates[tile.pos.x][tile.pos.y] = { visibility: { $set: Visibility.Revealed } };
    }
    newState = update(newState, {
        tilesLeft: left => left - revealedTiles.size,
        grid: updates,
    });
    if (newState.tilesLeft === 0) {
        newState = update(newState, {
            playState: { $set: "won" },
        });
    }
    return newState;
}

export const toogleFlagged = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    let tile = s.grid[x][y];
    if (s.playState !== "playing" || tile.visibility === Visibility.Revealed) {
        return s;
    }

    let newState = s;
    if (s.bombs === undefined) {
        newState = placeBombs(newState, { x, y });
        tile = newState.grid[x][y];
    }
    newState = update(newState, {
        grid: {
            [x]: {
                [y]: {
                    visibility: (v) => (v === Visibility.Flagged ? Visibility.Hidden : Visibility.Flagged)
                }
            }
        },
        flagNumber: (n) => tile.visibility === Visibility.Flagged ? n - 1 : n + 1,
    });
    return newState
}

const propagateTileReveal = (s: MineSweeperState, start: VoidTile & {
    visibility: Visibility;
    pos: Pos;
}) => {
    const openedTileStack = [];
    const openedTileSet = new Set<TileModel>([start]);
    if (start.neighboringBombNb === 0) {
        openedTileStack.push(start);
    }
    let nextTile = openedTileStack.pop();
    while (nextTile) {
        for (const neighbor of tileNeighbors(s, nextTile.pos)) {
            if (neighbor.visibility !== Visibility.Hidden || openedTileSet.has(neighbor)) {
                continue
            };
            openedTileSet.add(neighbor);
            if ((neighbor as any).neighboringBombNb !== 0) continue;
            openedTileStack.push(neighbor as VoidTile & {
                visibility: Visibility;
                pos: Pos;
            });
        }
        nextTile = openedTileStack.pop();
    }
    return openedTileSet;
}