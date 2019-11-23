import { range, shuffle } from "../../utils";
import { TileModel, TileKind, VisibilityKind } from "../../components/Tile";

const placeBombs = (width: number, height: number, bombNumber: number, excluded: Pos): Set<string> => {
    const tiles = []
    for (const x of range(0, width)) {
        for (const y of range(0, height)) {
            if(x !== excluded.x && y !== excluded.y) {
                tiles.push({ x, y })
            }
        }
    }
    shuffle(tiles);
    return new Set(tiles.slice(0, bombNumber).map(p => JSON.stringify(p)));
}

interface Pos {
    x: number;
    y: number;
}

export interface MineSweeperGrid {
    grid: TileModel[][];
    bombPositions: Set<string>;
    width: number;
    height: number;
}

export class MineSweeperGridOp {
    static init(width: number, height: number, bombNumber: number, excluded: Pos) {
        const newGrid: MineSweeperGrid = {
            bombPositions: placeBombs(width, height, bombNumber, excluded),
            width,
            height,
            grid: [],
        };
        newGrid.bombPositions = placeBombs(width, height, bombNumber, excluded);
        newGrid.width = width;
        newGrid.height = height;
        newGrid.grid = [];
        for (const x of range(0, width)) {
            newGrid.grid.push([]);
            for (const y of range(0, height)) {
                newGrid.grid[x].push(newGrid.bombPositions.has(JSON.stringify({ x, y })) ? {
                    kind: TileKind.Bomb,
                    visibility: VisibilityKind.Hidden,
                } : {
                        kind: TileKind.Void,
                        neighboringBombNb: 0,
                        visibility: VisibilityKind.Hidden,
                })
            }
        }
        for (const bomb of newGrid.bombPositions) {
            for(const neighPos of this.tileNeighbors(newGrid, JSON.parse(bomb))) {
                const neighbor = newGrid.grid[neighPos.x][neighPos.y];
                if(neighbor.kind === TileKind.Void) {
                    neighbor.neighboringBombNb += 1;
                }
            }
        }
        return newGrid;
    }

    static * tileNeighbors(g: MineSweeperGrid, {x, y}: Pos) {
        for (const i of range(x - 1, x + 2)) {
            for (const j of range(y - 1, y + 2)) {
                if ((i !== x || j !== y) &&
                    (0 <= i && i < g.width) &&
                    (0 <= j && j < g.height)
                ) {
                    yield { x: i, y: j }
                }
            }
        }
    }
}