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


/**
 * Setup the position of bombs in the grid.
 * A position can be excluded, to prevent the player from
 * clicking on a bomb on first tile reveal.
 * @param s State of the game
 * @param excluded Position to exclude from bomb placement
 */
export const placeBombs = (
    s: MineSweeperState, excluded: Pos
): MineSweeperState => {
    const tiles = []

    // First we randomly select a number of positions where to place bombs
    for (const x of range(0, s.width)) {
        for (const y of range(0, s.height)) {
            if (x !== excluded.x || y !== excluded.y) {
                tiles.push({ x, y })
            }
        }
    }
    shuffle(tiles);
    const bombs = new Set(tiles.slice(0, s.bombNumber).map(p => JSON.stringify(p)));

    // We recreate the grid with bombs at the right indices
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

    // Then we adjust the bomb neigbor count of all non bomb tiles in the grid
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

/**
 * Creates a new state instance for the minesweeper.
 * At first no bombs are set because they are generated on first press, to
 * prevent blowing up before playing.
 * @param width the width of the grid
 * @param height The height of th egrid
 * @param bombNumber the number of bomb present in the grid
 */
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

/**
 * creates an iterator over all legal neighbors of a tile.
 * @param s state of the game
 * @param position position of the tile from which to create neighbors
 */
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

/**
 * Creates a new state of the game when the user choose top reveal a tile.
 * Propagate tile revelation to all tiles with 0 bomb neighbors.
 * @param s state of the game
 * @param position_to_reveal Position the user choose to reveal
 */
export const revealTile = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    let tile = s.grid[x][y];

    // If we are not playing, or the tile is flagged nothing happens
    if (s.playState !== "playing" || tile.visibility === Visibility.Flagged) {
        return s;
    }

    let newState = s;
    // If bombs are not set yet (the game was just created) we
    // place bombs and exclude the tile the user pressed.
    if (s.bombs === undefined) {
        newState = placeBombs(newState, { x, y });
        tile = newState.grid[x][y];
    }

    // If the tile is a bomb, the game is lost
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

    // We propagate the tile revelation while bomb neighbor is 0
    const revealedTiles = propagateTileReveal(newState, tile);

    // We update the sate of the game immutably
    const updates = {} as any;
    for (const tile of revealedTiles) {
        if (!updates[tile.pos.x]) updates[tile.pos.x] = {};
        updates[tile.pos.x][tile.pos.y] = { visibility: { $set: Visibility.Revealed } };
    }
    newState = update(newState, {
        tilesLeft: left => left - revealedTiles.size,
        grid: updates,
    });

    // If no tile is left to reveal, the game is won
    if (newState.tilesLeft === 0) {
        newState = update(newState, {
            playState: { $set: "won" },
        });
    }
    return newState;
}

/**
 * Toogle flag on a position
 * @param s state of the game
 * @param param1 position to flag
 */
export const toogleFlagged = (s: MineSweeperState, { x, y }: Pos): MineSweeperState => {
    let tile = s.grid[x][y];

    // If we are not playing, or the tile has already been revealed, nothing happens
    if (s.playState !== "playing" || tile.visibility === Visibility.Revealed) {
        return s;
    }

    let newState = s;
    // If bombs are not set yet (the game was just created) we
    // place bombs and exclude the tile the user pressed.
    if (s.bombs === undefined) {
        newState = placeBombs(newState, { x, y });
        tile = newState.grid[x][y];
    }

    // Upadet the state by toogling flagged status of a tile
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


/**
 * Propagate tile reveleation to all neighbors while the tiles have no bomb neighbor.
 * @param s State of the game
 * @param start tile from which to start the propagation of revelation
 */
const propagateTileReveal = (s: MineSweeperState, start: VoidTile & {
    visibility: Visibility;
    pos: Pos;
}): Set<TileModel> => {
    const openedTileStack = []; // Stack of tiles with no neighbour to visit
    const openedTileSet = new Set<TileModel>([start]); // Tiles already revealed
    if (start.neighboringBombNb === 0) {
        openedTileStack.push(start);
    }
    let nextTile = openedTileStack.pop();

    // We traverse the graph created by neighbouring tiles,
    // and add all tiles connected to the starting tile by a path
    // of zero-bomb-neighbor tiles to the Set of tiles to reveal
    // only if they still hidden.
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