import Board from './board';
import Field from './field';
import Queen from './pieces/queen';
import Pawn from './pieces/pawn';

class Game {
    board: Board;
    turn: string;

    constructor() {
        this.board = new Board();
        this.board.initBoard();
        this.setup();
        this.turn = 'white';
    }
    
    afterMove(field: Field, move: string) {
        const newField = this.board.getField(parseInt(move[0]), parseInt(move[2]));
        this.movePiece(field, newField);
        this.changeTurn();
        this.promotePawn(newField);
        // Logika która powinna znajdować sie po ruchu znajduje się tutaj,
        // oczywiście chodzi tutaj o wywołania odpowiednich funkcji tylko :)
        // czyli np. sprawdzenie czy jest szach, mat, pat, zmiana tury itp.
    }

    promotePawn(newField: Field): void {
        const color = newField.piece!.side 
        const field = newField.piece?.side === 'white' ? 0 : 7 
        for (let y = 0; y < this.board.boardSize; y++) {
            if (this.board.fields[field][y].piece instanceof Pawn) {
                this.board.fields[field][y].piece = new Queen(color);
                this.board.fields[field][y].piece?.render(newField);
            }
        }
    }
    
    allAttackingMovesBySide(color: string) {
        return this.getAllPiecesBySide(color).map(field => field?.piece?.findAttackingMoves(this.board, field)).flat()
    }

    getAllPiecesBySide(color: string): Field[] {
        return this.board.fields.flat().filter(field => field?.piece && field.piece.side === color)
    }

    setup() {
        const fields = this.board.fields;
        for (let x = 0; x < this.board.boardSize; x++) {
            for (let y = 0; y < this.board.boardSize; y++) {
                const square = document.createElement('div');
                square.id = `${x},${y}`;
                square.className = 'square';
                square.className += x % 2 == y % 2 ? ' light' : ' dark';

                let field = fields[x][y];
                if (!field.isEmpty()) {
                    square.innerHTML = field.piece!.display;
                }

                square.addEventListener('click', (e) => {
                    this.touched(e);
                });

                document.getElementById('board')?.appendChild(square);
            }
        }
    }

    touched(e: MouseEvent) {
        const target = e.currentTarget;
        if (target) {
            const x: number = parseInt((target as HTMLDivElement).id[0]);
            const y: number = parseInt((target as HTMLDivElement).id[2]);

            const field: Field = this.board.getField(x, y);
            if (!field?.piece) return;

            if (this.turn === field.piece.side) {
                const possibleMoves = field.piece.findLegalMoves(this.board, field);
                for (let move of possibleMoves) {
                    (document.getElementById(move) as HTMLDivElement).className += ` possibleMove`;
                    (document.getElementById(move) as HTMLDivElement).addEventListener('click', () => {
                        this.afterMove(field, move);
                    });
                }
            }
        }
    }

    movePiece(field: Field, newField: Field) {
        if (field.piece) {
            field.piece.move(field, newField);
        }
        for (let x = 0; x < this.board.boardSize; x++) {
            for (let y = 0; y < this.board.boardSize; y++) {
                (document.getElementById(`${x},${y}`) as HTMLDivElement).className = (document.getElementById(
                    `${x},${y}`,
                ) as HTMLDivElement).className.replace(`possibleMove`, '');

                let old_element = document.getElementById(`${x},${y}`) as HTMLDivElement;
                let new_element = old_element.cloneNode(true);
                old_element.parentNode?.replaceChild(new_element, old_element);

                document.getElementById(`${x},${y}`)?.addEventListener('click', (e) => {
                    this.touched(e);
                });
            }
        }
    }

    changeTurn(): void {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }
}

export default Game;
