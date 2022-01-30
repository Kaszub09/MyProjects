 class SudokuSolver {
    //int[,] board;
    //int[,,] boardIsNumberPossible;
    //List<int[,]> solutions;
    //bool isSolvingFinished;
    //bool allSolutions;


    //Return solutions or empty list if there are none
    Solve(board) {
        this.board = board;
        this.Setup();
        if (this.isSolvingFinished == false) {
            if (this.CheckIfBoardIsCorrect()) {

                this.SolveWithoutGuessing();
                this.SolveWithGuessing(0);

                this.isSolvingFinished = true;
            }
            else {
                this.isSolvingFinished = true;
                return null;
            }

        }
        return this.board;
    }


    SolveWithoutGuessing() {
        let oldSum = -1;
        let newSum = this.BoardSum();
        while (oldSum != newSum) {
            oldSum = newSum;
            this.TryIsOnlyPlacePossible();
            this.TryIsOnlyNumberPossible();
            newSum = this.BoardSum();
        }
    }

    CheckIfBoardIsCorrect() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] != 0) {
                    var temp = this.board[i][j];
                    this.board[i][j] = 0;
                    this.boardIsNumberPossible[i][j][temp] = 1;
                    if (!this.CanPlaceNumber(i, j, temp)) {
                        this.board[i][j] = temp;
                        this.boardIsNumberPossible[i][j][temp] = 0;
                        return false;
                    }
                    this.board[i][j] = temp;
                    this.boardIsNumberPossible[i][j][temp] = 0;
                }
            }
        }
        return true;
    }

    Setup() {
        this.isSolvingFinished = false;
        this.boardIsNumberPossible = new Array(9);
        for (var i = 0; i < 9; i++) {
            this.boardIsNumberPossible[i] = new Array(9);
            for (var j = 0; j < 9; j++) {
                this.boardIsNumberPossible[i][j] = new Array(9);
                for (var k = 0; k < 10; k++) {
                    this.boardIsNumberPossible[i][j][k] = 1;
                }
            }
        }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.board[i][j] != 0) {
                    this.PlaceNumber(i, j, this.board[i][j]);
                }
            }
        }
    }

    PlaceNumber(x, y, number) {
        this.board[x][y] = number;
        for (var i = 0; i < 10; i++) {
            this.boardIsNumberPossible[x][y][i] = 0;
        }
        for (var i = 0; i < 9; i++) {
            this.boardIsNumberPossible[i][y][number] = 0;
            this.boardIsNumberPossible[x][i][number] = 0;
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                this.boardIsNumberPossible[Math.floor(x / 3) * 3 + i][Math.floor(y / 3) * 3 + j][number] = 0;
            }
        }
    }

    BoardSum() {
        var sum = 0;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                sum += this.board[i][j];
            }
        }
        return sum;
    }

    TryIsOnlyNumberPossible() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.board[i][j] == 0) {
                    this.TryIsOnlyNumberPossibleXY(i, j);
                }
            }
        }
    }

    TryIsOnlyNumberPossibleXY(x, y) {
        var counter = 0;
        var number = 0;
        for (var k = 1; k <= 9; k++) {
            if (this.boardIsNumberPossible[x][y][k] == 1) {
                counter++;
                number = k;
            }
        }
        if (counter == 1) {
            this.PlaceNumber(x, y, number);
        }
    }

    TryIsOnlyPlacePossible() {
        for (var number = 1; number <= 9; number++) {
            for (var i = 0; i < 9; i++) {
                this.TryIsOnlyPlacePossibleInRow(i, number);
                this.TryIsOnlyPlacePossibleInCol(i, number);
                this.TryIsOnlyPlacePossibleInSquare(number);
            }
        }
    }

    TryIsOnlyPlacePossibleInRow(row, value) {
        var counter = 0;
        var col = 0;
        for (var j = 0; j < 9; j++) {
            if (this.boardIsNumberPossible[row][j][value] == 1) {
                counter++;
                col = j;
            }
        }
        if (counter == 1) {
            this.PlaceNumber(row, col, value);
        }

    }

    TryIsOnlyPlacePossibleInCol(col, value) {
        var counter = 0;
        var row = 0;
        for (var i = 0; i < 9; i++) {
            if (this.boardIsNumberPossible[i][col][value] == 1) {
                counter++;
                row = i;
            }
        }
        if (counter == 1) {
            this.PlaceNumber(row, col, value);
        }
    }

    TryIsOnlyPlacePossibleInSquare(value) {
        var counter;
        var tempI = 0, tempJ = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                counter = 0;
                for (var k = 0; k < 3; k++) {
                    for (var l = 0; l < 3; l++) {
                        if (this.boardIsNumberPossible[3 * i + k][3 * j + l][value] == 1) {
                            counter++;
                            tempI = k;
                            tempJ = l;
                        }
                    }
                }
                if (counter == 1) {
                    this.PlaceNumber(3 * i + tempI, 3 * j + tempJ, value);
                }
            }
        }

    }

    SolveWithGuessing(z) {
        if (z == 81) {
            return true;
        }
        else {
            var i = Math.floor(z/9);
            var j = z % 9;
            if (this.board[i][j] == 0) {
                for (var number = 1; number <= 9; number++) {
                    if (this.CanPlaceNumber(i, j, number)) {
                        this.board[i][j] = number;
                        if (this.SolveWithGuessing(z + 1))
                            return true;
                    }
                }
                this.board[i][j] = 0;
                return false;
            }
            else {
                if (this.SolveWithGuessing(z + 1))
                    return true;
                else
                    return false;
            }
        }
    }

    CanPlaceNumber(x, y, number) {
        if (this.boardIsNumberPossible[x][y][number] == 0)
            return false;

        for (var i = 0; i < 9; i++) {
            if (this.board[i][y] == number || this.board[x][i] == number) {
                return false;
            }
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.board[Math.floor(x / 3) * 3 + i][Math.floor(y / 3) * 3 + j] == number) {
                    return false;
                }
            }
        }
        return true;
    }

}