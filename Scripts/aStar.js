class Node {
    constructor(x, y, walkable = true) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

class AStar {
    constructor(grid, startNode, endNode) {
        this.grid = grid;
        this.startNode = startNode;
        this.endNode = endNode;
        this.openList = [];
        this.closedList = [];
    }

    findPath() {
        this.openList.push(this.startNode);

        while (this.openList.length > 0) {
            let currentNode = this.openList.sort((a, b) => a.f - b.f)[0];

            if (currentNode === this.endNode) {
                return this.reconstructPath(currentNode);
            }

            this.openList = this.openList.filter(node => node !== currentNode);
            this.closedList.push(currentNode);

            let neighbors = this.getNeighbors(currentNode);

            for (let neighbor of neighbors) {
                if (!neighbor.walkable || this.closedList.includes(neighbor)) continue;

                let tentativeG = currentNode.g + 1;

                if (!this.openList.includes(neighbor) || tentativeG < neighbor.g) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, this.endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;

                    if (!this.openList.includes(neighbor)) {
                        this.openList.push(neighbor);
                    }
                }
            }
        }
        return [];
    }

    getNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;
        const directions = [
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
        ];

        for (let { dx, dy } of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (this.isInBounds(nx, ny)) {
                neighbors.push(this.grid[ny][nx]); // Corrected indexing to grid[y][x]
            }
        }

        return neighbors;
    }

    isInBounds(x, y) {
        return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[0].length;
    }

    heuristic(nodeA, nodeB) {
        return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    }

    reconstructPath(node) {
        const path = [];
        while (node) {
            path.push(node);
            node = node.parent;
        }
        return path.reverse();
    }
}

export { Node, AStar };
