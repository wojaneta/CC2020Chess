import BasicPiece from '../types';
import Board from '../Board';
import Field from '../Field';

abstract class Piece implements BasicPiece {
    abstract _display: string;

    constructor(public side: string) {
        this.side = side;
    }

    public get display(): string {
        return this._display;
    }

    move(oldField: Field, newField: Field): void {
        // clearing previous place
        oldField.piece = null;
        (document.getElementById(`${oldField.x},${oldField.y}`) as HTMLDivElement).innerHTML = '';
        //setting new
        newField.piece = this;
        (document.getElementById(`${newField.x},${newField.y}`) as HTMLDivElement).innerHTML = this.display;
    }

    abstract findLegalMoves(board: Board, actualField: Field): string[];
}

export default Piece;