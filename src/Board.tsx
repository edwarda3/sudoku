import React from 'react';

interface BoardState {
    tiles: Tile[][];
    status: string;
}
interface BoardProps {
    baseBoard: number[][];
    base: number;
}

export class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps) {
        super(props);
        this.state = {
            tiles: this.fillTiles(props.baseBoard),
            status: "Idle",
        }
    }

    fillTiles = (originalBoard:number[][]) => {
        let tiles:Tile[][] = [];
        for(let r = 0; r<originalBoard.length; r++) {
            tiles[r] = [];
            for(let c = 0; c<originalBoard[r].length; c++) {
                if(originalBoard[r][c] === 0){
                    //truth value
                    tiles[r][c] = new Tile();
                } else {
                    tiles[r][c] = new Tile(originalBoard[r][c], true);
                }
            }
        }
        return tiles;
    }

    isValidBoard = (tiles:Tile[][]):boolean => {
        const base:number = this.props.base;
        const isValidSection = (section: Tile[]):boolean => {
            const usedNumbers:number[] = [];
            let status:boolean = true;
            section.forEach(sectionTile => {
                if(usedNumbers.includes(sectionTile.value) && sectionTile.value !== emptyNumber){
                    status = false;
                }
                else{
                    usedNumbers.push(sectionTile.value);
                }
            });
            return status;
        }
        const rowsAreValid = ():boolean => {
            let rows:boolean = true;
            for(let r=0; r<tiles.length; r++){
                if(!isValidSection(tiles[r])){
                    return false;
                }
            }
            return rows;
        }
        const columnsAreValid = ():boolean => {
            let cols:boolean = true;
            let columnArrays:Tile[][] = new Array(base*base).fill([]);
            for(let r=0; r<tiles.length; r++){
                for(let c=0; c<tiles[r].length; c++){
                    columnArrays[c].push(tiles[r][c]);
                }
            }
            columnArrays.forEach(column => {
                if(!isValidSection(column)){
                    cols = false;
                    return;
                }
            })
            return cols;
        }
        const sectionsAreValid = ():boolean => {
            let sections:boolean = true;
            let sectionArrays:Tile[][] = new Array(base*base).fill([]);
            for(let sr=0; sr<base; sr++){
                for(let sc=0; sc<base; sc++){
                    for(let r=sr*base; r<(sr+1)*base; r++){
                        for(let c=sc*base; c<(sc+1)*base; c++){
                            sectionArrays[(sr*base)+sc].push(tiles[r][c]);
                        }
                    }
                }
            }
            sectionArrays.forEach(column => {
                if(!isValidSection(column)){
                    sections = false;
                    return;
                }
            })
            return sections;
        }

        if(!rowsAreValid()) return false;
        else if(!columnsAreValid()) return false;
        else if(!sectionsAreValid()) return false;
        else{
            return true;
        }
    }

    solve = () => {
        let backtrackStack:BacktrackTuple[] = [];
        let currentRow:number = 0;
        let currentColumn:number = 0;
        let done:boolean = false;
        let tiles = this.state.tiles;
        const iterate = (save:boolean=true) => {
            if(save){
                backtrackStack.push(new BacktrackTuple(currentRow, currentColumn));
            }
            currentColumn ++;
            if(currentColumn >= tiles[currentRow].length){
                currentColumn = 0;
                currentRow++;
                if(currentRow >= tiles.length){
                    done=true;
                    this.setState({status:"Done"});
                }
            }
        }
        const backtrack = () => {
            let prev:BacktrackTuple | undefined = backtrackStack.pop();
            if(!prev){
                done=true;
                this.setState({status:"Error"});
            } else {
                tiles[currentRow][currentColumn].reset();
                currentRow = prev.row;
                currentColumn = prev.col;
            }
        }
        while(!done){
            if(!tiles[currentRow][currentColumn].truth){
                if(tiles[currentRow][currentColumn].makeNextGuess()){
                    if(this.isValidBoard(tiles)){
                        iterate();
                    }
                }
                else {
                    backtrack();
                }
            } else {
                iterate(false);
            }
            console.log(`(${currentRow},${currentColumn})`)
            this.forceUpdate();
        }
    }

    makeIntoNewBoard = () => {
        let tiles = this.state.tiles;
        let isSolved = true;
        for(let r=0; r<tiles.length; r++) {
            for(let c=0; c<tiles[r].length; c++) {
                if(tiles[r][c].value === emptyNumber){
                    isSolved = false;
                }
            }
        }
        if(!isSolved){
            alert("Solve the board first");
        }
        const chance = .65;
        for(let r=0; r<tiles.length; r++) {
            for(let c=0; c<tiles[r].length; c++) {
                if(Math.random() < chance) {
                    tiles[r][c].reset();
                    tiles[r][c].truth = false;
                } else {
                    tiles[r][c].truth = true;
                }
            }
        }
    }

    zeroOut = () => {
        let tiles = this.state.tiles;
        for(let r=0; r<tiles.length; r++) {
            for(let c=0; c<tiles[r].length; c++) {
                tiles[r][c].truth = false;
                tiles[r][c].reset();
            }
        }
    }

    drawBoard = () => {
        return this.state.tiles.map( (row, rIdx) => {
            return (
                <div key={rIdx} style={{display:'block'}}>
                    {row.map( (t, cIdx) => {
                        return (
                            <div key={cIdx} style={{display:'inline', padding:0, margin:0}}>
                                <DrawTile value={t.value} truth={t.truth} />
                            </div>
                        )
                    })}
                </div>
            );
        })
    }

    render = () => {
        return (
            <div>
                {this.drawBoard()}
                <button onClick={() => {
                    this.setState({status:"Solving"});
                    this.solve();
                }}>Solve</button>
                <button onClick={() => {
                    this.setState({status:"Zeroed"});
                    this.zeroOut();
                }}>Zero</button>
                <button onClick={() => {
                    this.setState({status:"Generated"});
                    this.makeIntoNewBoard();
                    setTimeout(() => {
                        this.setState({status:"Idle"});
                    }, 2000);
                }}>Make Into New</button>
                <p>{this.state.status}</p>
            </div>
        )
    }
}

interface DrawTileProps {
    value:number;
    truth:boolean;
}

const DrawTile: React.FC<DrawTileProps> = (props) => {
    const tileColor:string = props.truth ? "#111" : "#4141A8";
    return (
        <div style={{display:'inline', padding:"5px"}}>
            <span style={{color:tileColor}}>{props.value}</span>
        </div>
    )
}

class BacktrackTuple {
    row: number;
    col: number;
    constructor(row:number, col:number){
        this.row = row;
        this.col = col;
    }
}

const allGuesses:number[] = [1,2,3,4,5,6,7,8,9]
const emptyNumber:number = 0
class Tile {
    value: number;
    truth: boolean;
    guesssesRemaining: number[];
    constructor(value:number=emptyNumber, truth:boolean=false) {
        this.value = value;
        this.truth = truth;
        this.guesssesRemaining = [];
        this.resetGuesses();
    }

    makeNextGuess = ():boolean => {
        if(this.guesssesRemaining.length <= 0){
            return false;
        }
        const next = this.guesssesRemaining.splice(Math.floor(Math.random()*this.guesssesRemaining.length), 1).pop();
        if(next != null){
            this.value = next;
            return true;
        }
        else {            
            throw Error("Next was null: " + this.guesssesRemaining);
        }
    }

    resetGuesses = () => {
        this.guesssesRemaining = [];
        allGuesses.forEach(val => this.guesssesRemaining.push(val));
    }

    reset = () => {
        this.value = emptyNumber;
        this.resetGuesses();
    }
    
}