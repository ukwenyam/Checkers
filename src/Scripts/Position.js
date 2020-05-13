export class Position {

    constructor(xPos, yPos, empty) {
        this.xPos = xPos;
        this.yPos = yPos;

        if(empty == 'E')
            this.isEmpty = true;
        else 
            this.isEmpty = false;
    }
}