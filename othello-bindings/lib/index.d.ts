export class Game {
    private internal;

    public constructor();

    /**
     * @returns a bitmap representation of the black pieces of the game.
     */
    public get blackPieces(): number;

    /**
     * @returns a bitmap representation of the white pieces of the game.
     */
    public get whitePieces(): number;

    /**
     * @returns a list of possible plays (represented by their index).
     */
    public get availablePlays(): number[];

    /**
     * @returns the current state of the game. Can be either "black", "white", "tie" or "in_progress".
     */
    public get state(): string;

    /**
     * Mutates the game board by resolving the play.
     */
    public resolvePlay(play: number): void;

    /**
     * @returns true if the play is valid within the current state.
     */
    public isValidPlay(play: number): boolean;

    /**
     * Runs Monte Carlo Tree Search algorithm for the current state.
     */
    public runSearch(timeout: number): { bestPlay: number, simulationCount: number };
    public toString(): string;
}