/**
 * REFERENCES
 * 
 * 1. This assignment implements the Revealing Module Pattern described
 *    in this video: https://www.youtube.com/watch?v=pOfwp6VlnlM&t=13s
 *    This design allows this program to minimize use of global variables
 * 
 * 2. The displayPopUp method was created with help from:
 *    https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Build_your_own_function
 * 
 * 3. The timer in the Concentration game was made with help from: 
 *    http://bajcar.dev.fast.sheridanc.on.ca/syst10199/tut04.html
 * 
 * 4. Images for the Concentration game were taken from:
 *      https://icons8.com/icon/set/pokemon/all
 * 
 */

/**
 * CASINO CRAPS
 * This section contains the JavaScript to play Casino Craps
 * Related to craps.html
 * 
 * Process Design
 * 1. User presses Roll Dice Button to start game
 * 2. Roll Dice button will assign value between 1-6 to die 1 and die 2
 * 3. Total is calculated (die1 + die2)
 * 4. die1, die2, and total values are displayed in html
 * 5. Check win:
 *      if first roll
 *          if (total is 7 OR 11)
 *              display WIN
 *              increment winNumber
 *          else if (total is 2, 3, OR 12)
 *              display LOSE
 *              increment loseNumber
 *          else
 *              display points (points = total)
 *              allow roll again
 *      else if any other roll
 *          if (total is 7)
 *              display LOSE
 *              increment loseNumber
 *          if (total is equal to points)
 *              display WIN
 *              increment winNumber
 */
var casinoCraps = (function () {

    // Game variables
    var die1 = 0;
    var die2 = 0;
    var total = 0;
    var points = 0;
    var winNumber = 0;
    var loseNumber = 0;
    var firstTurn = true;
    var gameOver = false;

    var results = {
        win: "You win!",
        lose: "You lose!",
        continue: "Roll again!"
    }

    // Cache DOM
    var die1Output = document.getElementById("die1");
    var die2Output = document.getElementById("die2");
    var totalOutput = document.getElementById("total");
    var pointsOutput = document.getElementById("points");
    var instructions = document.getElementById("instructions");
    var statistics = document.getElementById("statistics");

    var rollButton = document.getElementsByTagName("button")[0];
    var resetButton = document.getElementsByTagName("button")[1];

    function init() {
        // Bind events to allow game to start
        rollButton.addEventListener("click", rollDice);
        resetButton.addEventListener("click", resetStats);
    }

    /* Rolls dice and displays result to user */
    function rollDice() {
        // Roll both dice and find total
        die1 = random(1, 6);
        die2 = random(1, 6);
        total = die1 + die2;

        // If it is the first turn
        if (firstTurn) {
            // Assign total of roll to points
            points = total;
        }

        // Call display function to display results
        display();

    }

    /* Will display the outcome of each turn */
    function display() {
        if (firstTurn) {
            // Removes points output from last game played
            pointsOutput.textContent = "";
        }

        // Displays the dice and total
        die1Output.textContent = die1;
        die2Output.textContent = die2;
        totalOutput.textContent = total;

        // Displays win/lose/continue
        instructions.textContent = checkGameOver();

        // if gameOver, call displayGameOver()
        if (gameOver) {
            displayGameOver();
        }
    }

    /* This function will run when the user wins/loses */
    function displayGameOver() {

        // Find out if this is a win or lose, and save result
        var gameResult = checkGameOver();

        // Increment the correct statistic
        if (gameResult === "You win!") {
            winNumber++;
        } else {
            loseNumber++;
        }

        // Update statistics for user to see 
        statistics.innerHTML = "Wins: " + winNumber
            + "<br>Losses: " + loseNumber;

        // Prompt user to play again
        instructions.innerText += "\n\nRoll the dice to play again!";

        // Display pop-up over the screen
        displayPopUp(gameResult);

        // Reset game flags to prepare for new game
        firstTurn = true;
        gameOver = false;
    }

    /* Returns the corresponding string from result object */
    function checkGameOver() {
        // Runs if this is first roll
        if (firstTurn) {
            if (total === 7 || total === 11) {
                // Winning totals
                gameOver = true;
                return results["win"];
            } else if (total === 2 || total === 3 || total === 12) {
                // Losing totals
                gameOver = true;
                return results["lose"];
            } else {
                // Continue game

                // Remove flag for firstTurn, game continues
                firstTurn = false;

                // Add output for points so user can see
                pointsOutput.textContent = "Points: " + points;

                return results["continue"];
            }

            // Runs for every other roll
        } else {
            if (total === points) {
                // Winning totals
                gameOver = true;
                return results["win"];
            } else if (total === 7) {
                // Losing totals
                gameOver = true;
                return results["lose"];
            } else {
                // Continue Game
                return results["continue"];
            }
        }
    }

    /* Allows user to reset their win/loss totals and start new game */
    function resetStats() {
        // Reset all game variables
        die1 = 0;
        die2 = 0;
        total = 0;
        points = 0;
        winNumber = 0;
        loseNumber = 0;
        firstTurn = true;
        gameOver = false;

        // Reset output to user
        die1Output.textContent = die1;
        die2Output.textContent = die2;
        totalOutput.textContent = "00";
        pointsOutput.textContent = "";
        statistics.innerHTML = "Wins: " + winNumber
            + "<br>Losses: " + loseNumber;
        instructions.textContent = "Roll the dice to start the game!";
    }

    return {
        // init is the only function with scope outside of this block
        init: init,
    };
})();

/**
 * TIC TAC TOE
 * This section contains the JavaScript to play Tic Tac Toe
 * Related to tictactoe.html
 * 
 * Process Design:
 * 1. User presses the start button
 * 2. The grid will clear the letters 
 * 3. Events will be binded to each cell in the grid, listening for a click
 * 4. When a cell is clicked, it will fill with either X OR O,
 *      depending on whether the turn number is even (X) or odd (O)
 * 5. After each turn, all cells are checked if they contain winning combos
 * 6. If all cells are filled and there is no winning combo, it is a tie
 */

var ticTacToe = (function () {

    // Game variables
    var turn = 0;
    var empty = 9;

    // Holds the possible ways to win
    var winCombos = [
        // Row wins
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // Column wins
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // Diagonal wins
        [0, 4, 8],
        [6, 4, 2]
    ];

    // Cache DOM
    var startButton = document.getElementsByTagName("button")[0];
    var board = document.getElementsByTagName("td");
    var instructions = document.getElementsByTagName("p")[0];

    function init() {
        startButton.addEventListener("click", startGame);
    }

    function startGame() {
        // The original display is cleared from the board, and start removed
        clearBoard();
        startButton.textContent = "Restart Game";

        // Information paragraphs are created and displayed to user
        instructions.textContent = "Player X's turn";

        // Event listeners are attached to board to listen for clicks
        for (var i = 0; i < board.length; i++) {
            board[i].addEventListener("click", makeMove);
        }
    }

    /* This will display either an X or an O within a cell that is clicked */
    function makeMove() {
        // Checks which player move it is
        if (turn % 2 === 0) {
            // Even numbered moves belong to X
            this.textContent = "X";
            this.setAttribute("class", "playerX");

            // Removes listener from this cell
            this.removeEventListener("click", makeMove);

            // Displays next player's turn
            instructions.textContent = "Player O's turn";
        } else {
            // Odd numbered moves belong to O
            this.textContent = "O";
            this.setAttribute("class", "playerO");

            // Removes listener from this cell
            this.removeEventListener("click", makeMove);

            // Displays next player's turn
            instructions.textContent = "Player X's turn";
        }

        // Increase turn count, decrease empty cell count
        turn++;
        empty--;

        // Check if this was a winning move
        checkWin();
    }

    /* Checks if either player has made a winning combo */
    function checkWin() {
        // Loop through winCombos and use their values to find winner
        for (var i = 0; i < winCombos.length; i++) {

            // Check if cells in winCombo i all match X
            if (board[winCombos[i][0]].textContent === "X"
                && board[winCombos[i][1]].textContent === "X"
                && board[winCombos[i][2]].textContent === "X") {

                // Change the class of winning cells
                for (var j = 0; j < winCombos[i].length; j++) {
                    board[winCombos[i][j]].setAttribute("class", "ticTacToeWin");
                }

                // Display winning phrase for X and end method
                displayGameOver("Player X Wins!");
                return;

                // Check if cells in winCombo i all match O
            } else if (board[winCombos[i][0]].textContent === "O"
                && board[winCombos[i][1]].textContent === "O"
                && board[winCombos[i][2]].textContent === "O") {

                // Change the class of winning cells
                for (var j = 0; j < winCombos[i].length; j++) {
                    board[winCombos[i][j]].setAttribute("class", "ticTacToeWin");
                }

                // Display winning phrase for O and end method
                displayGameOver("Player O Wins!");
                return;
            }
        }

        // Get here if no winCombo was satisfied
        // Check if all cells are filled
        if (empty === 0) {
            // Display game over screen for tie game
            displayGameOver("It's a Tie!");
        }
    }

    /* Displays game over to players */
    function displayGameOver(message) {
        for (var i = 0; i < board.length; i++) {
            board[i].removeEventListener("click", makeMove);
        }

        displayPopUp(message);
    }

    /* Removes all content from the board and resets all variables */
    function clearBoard() {
        // Loop through board and remove content
        for (var i = 0; i < board.length; i++) {
            board[i].textContent = "";
            board[i].removeAttribute("class");
        }

        // Return variables to initial state
        turn = 0;
        empty = 9;
    }

    return {
        // init is the only function with scope outside of this block
        init: init
    };
})();

/**
 * BINGO
 * This section contains the JavaScript to play Bingo
 * Related to bingo.html
 * 
 * Process Design:
 * 1. User presses the Generate New Card button
 * 2. The card will fill with the appropriate numbers (1-15 in column B,
 *      16-30 in column I, etc.)
 * 3. The program will shuffle numbers that will be called (act as BINGO balls
 * 4. User presses Call Number button
 * 5. Program checks if call number button is on the card
 *      if so, the cell will be "stamped"
 *      else, the program will go on
 * 7. Program checks if the bingo card has a winning combination
 *      if so, the win panel is displayed
 *      else, the game goes on and returns to step 4
 * 
 */

var bingo = (function () {

    // Game variables

    // Values that will appear on the BINGO card
    var bingoValues = [
        buildArray(1, 15),  // B
        buildArray(16, 30), // I
        buildArray(31, 45), // N
        buildArray(46, 60), // G
        buildArray(61, 75)  // O
    ];

    // An array of numbers from 1-75 is created, then shuffled
    var callingNumbers = shuffle1DArray(buildArray(1, 75));
    // Contains index of next number to be called
    var callingIndex = 0;

    // The possible combinations for BINGO win
    var winCombos = [
        // Row wins
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],

        // Diagonal wins
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],

        // Column Wins
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24]
    ];

    // Cache DOM
    var card = document.getElementsByTagName("td");
    var generateButton = document.getElementsByTagName("button")[0];
    var callButton = document.getElementsByTagName("button")[1];

    // var numbersHeading = document.getElementsByTagName("h3")[0];
    // var currentNumOutput = document.getElementsByTagName("p")[0];
    // var previousNumOutput = document.getElementsByTagName("p")[1];

    // Create display elements
    var numbersHeading = document.createElement("h3");
    var currentNumOutput = document.createElement("p");
    var previousNumOutput = document.createElement("p");

    function init() {
        // Bind events to allow game to start
        generateButton.addEventListener("click", generateCard);

        // Create div to hold calling numbers output
        var container = document.createElement("div");
        container.setAttribute("class", "container");
        var main = document.getElementsByTagName("main")[0];
        main.appendChild(container);

        // Display output for calling numbers
        numbersHeading.textContent = "BINGO Numbers";
        currentNumOutput.innerHTML = "Current number: <br>";
        previousNumOutput.innerHTML = "Previous numbers: <br>";

        // Append output for numbers to the DOM
        container.appendChild(numbersHeading);
        container.appendChild(currentNumOutput);
        container.appendChild(previousNumOutput);
    }

    /* This will generate and display the values for the Bingo Card */
    function generateCard() {
        // Shuffles the values of bingo numbers
        // The shuffling still leaves B, I, N, G, and O numbers in the same array
        // (i.e. 1-15 are in the same array, 16-30 are in the same array, etc.)
        var randomBingoNumbers = shuffle2DArray(bingoValues);
        var rowNumber = 0;

        // Loop through the card cells
        for (var i = 0; i < card.length; i++) {
            // Increases row number at the end of every row
            if (i % 5 === 4) {
                rowNumber++;
            }

            // This will ensure that the columns have the correct values
            // Number is displays on card
            if (i % 5 === 0) {
                // B column, contains random numbers from 1-15
                card[i].textContent = randomBingoNumbers[0][rowNumber];
            } else if (i % 5 === 1) {
                // I column, contains random numbers from 16-30
                card[i].textContent = randomBingoNumbers[1][rowNumber];
            } else if (i % 5 === 2) {
                // N column, contains random numbers from 31-45
                if (i !== 12) {
                    card[i].textContent = randomBingoNumbers[2][rowNumber];
                } else {
                    // The middle cell doesn't have a number, it is free
                    card[i].textContent = "FREE";
                }
            } else if (i % 5 === 3) {
                // G column, contains random numbers from 46-60
                card[i].textContent = randomBingoNumbers[3][rowNumber];
            } else {
                // O column, contains random numbers from 61-75
                card[i].textContent = randomBingoNumbers[4][rowNumber];
            }
        }

        startGame();
    }

    function startGame() {
        // Change generate button so that it resets the game instead
        generateButton.removeEventListener("click", generateCard);
        generateButton.textContent = "Start New Game";
        generateButton.addEventListener("click", resetGame);

        // Bind event to call button
        callButton.addEventListener("click", callNumber);
    }

    /* Generates a number that will be stamped */
    function callNumber() {
        // Stop calling numbers when all 75 have been called
        if (callingIndex > callingNumbers.length) {
            callButton.removeEventListener("click", callNumber);
        }

        // Assign the current number to a variable and increase the callingIndex
        var currentNumber = callingNumbers[callingIndex];
        callingIndex++;

        // Assign the bingo value to a variable for output and display
        var bingoNumber = addBingoLetter(currentNumber);
        currentNumOutput.innerHTML = "Current number: <br>" + bingoNumber;
        ;

        // Calls the stampCard funciton to check if this was on BINGO card
        if (stampCard(currentNumber)) {
            previousNumOutput.innerHTML += "<strong>"
                + bingoNumber + "<strong>, ";
        } else {
            previousNumOutput.innerHTML += bingoNumber + ", "
        }

        // Check for game over
        if (checkCard()) {
            displayGameOver();
        }
    }

    /** This function concatenates the appropriate letter to a bingo number
     *  and returns the value
     */
    function addBingoLetter(number) {
        if (number < 1 && number > 75) {
            // Number is not a bingo number, return it
            return number;
        } else if (number >= 1 && number <= 15) {
            return ("B" + number);
        } else if (number >= 16 && number <= 30) {
            return ("I" + number);
        } else if (number >= 31 && number <= 45) {
            return ("N" + number);
        } else if (number >= 46 && number <= 60) {
            return ("G" + number);
        } else if (number >= 61 && number <= 75) {
            return ("O" + number);
        }
    }

    /** Will change the class of a cell on bingo card if that number was called
     *  returns true if cell on card was stamped, false otherwise
     */
    function stampCard(number) {
        // Loop through entire bingo card
        for (var i = 0; i < card.length; i++) {
            // If the card cell is the same as the number passed in, change class
            // Using equality operator because we are comparing integer to string
            if (card[i].textContent == number) {
                card[i].setAttribute("class", "filled");
                return true;
            }
        }
        return false;
    }

    /* Returns either true or false, depending on whether card has a BINGO */
    function checkCard() {
        var isWinner = false;

        // Loop through the winCombos and compare them to what is on user's card
        for (var i = 0; i < winCombos.length; i++) {
            for (var j = 0; j < winCombos[i].length; j++) {

                var currentCell = card[winCombos[i][j]];

                // Check if each cell in winCombo array is filled,
                if (currentCell.getAttribute("class") === "filled"
                    || currentCell.getAttribute("id") === "free") {
                    isWinner = true;
                } else {
                    // If any cell in a combo is not filled, move on to next array
                    isWinner = false;
                    break;
                }
            }

            // if isWinner is still true after looping through full combo,
            // card is a winner and method can stop
            if (isWinner) {
                return isWinner; // Will return true
            }
        }

        // If method has gotten here, no winCombo was satisfied
        return isWinner; // Will return false
    }

    /* This will display the win screen for the user */
    function displayGameOver() {
        callButton.removeEventListener("click", callNumber);
        displayPopUp("You win!");
    }

    /* Resets game so that the user can play again */
    function resetGame() {
        // Reset the callingNumbers array and index
        callingNumbers = shuffle1DArray(buildArray(1, 75));
        callingIndex = 0;

        // Clear outputs
        numbersHeading.innerHTML = "<br>";
        currentNumOutput.innerHTML = "<br>";
        previousNumOutput.innerHTML = "<br>";

        // Clear card
        for (var i = 0; i < card.length; i++) {
            card[i].textContent = "";
            if (i !== 12) {
                card[i].removeAttribute("class");
            }
        }
        card[12].textContent = "FREE";
        previousNumbers = [];

        generateButton.removeEventListener("click", callNumber);

        generateButton.textContent = "Generate New Card";
        generateButton.addEventListener("click", resetGame);
        generateButton.addEventListener("click", generateCard);
    }

    /* Returns a sequential array of numbers between num1 and num2 */
    function buildArray(num1, num2) {
        // Declare the array
        var array = [];
        // Push the numbers from num1 to num2 to the array
        for (var i = num1; i <= num2; i++) {
            array.push(i);
        }
        // Return the array
        return array;
    }

    return {
        // init is the only function with scope outside of this block
        init: init
    };

})();

/**
 * CONCENTRATION
 * This section contains the JavaScript to play Concentration
 * Related to bingo.html
 * 
 * Process Design:
 * 1. The user presses the New Game button
 * 2. The grid will fill with pairs of icons that are shuffled
 *      And a timer will begin counting up to two minutes.
 * 4. The user will press two cells to reveal the image
 *      if the images match,
 *          the icons will remain visible
 *      else
 *          the icons hide again
 * 5. Step 4 will repeat until either:
 *      a. The user matches all the pairs. Win panel will pop up.
 *      OR
 *      b. The timer reaches 2:00 minutes before all pairs are found.
 *              Lose panel shows up.
 * 
 */

var concentration = (function () {

    // Game variables

    // These icons will be displayed on the grid
    var pairs = [
        "\u2660", "\u2665", "\u2666", "\u2663",
        "\u2654", "\u2655", "\u2656", "\u2657",
        "\u2658", "\u2659", "\u2601", "\u2600",
        "\u2602", "\u2603", "\u2606", "\u260A",
        "\u260F", "\u261A"
    ];

    var pairs = [
        "../images/pair1.png",
        "../images/pair2.png",
        "../images/pair3.png",
        "../images/pair4.png",
        "../images/pair5.png",
        "../images/pair6.png",
        "../images/pair7.png",
        "../images/pair8.png",
        "../images/pair9.png",
        "../images/pair10.png",
        "../images/pair11.png",
        "../images/pair12.png",
        "../images/pair13.png",
        "../images/pair14.png",
        "../images/pair15.png",
        "../images/pair16.png",
        "../images/pair17.png",
        "../images/pair18.png"
    ];

    // Keep track of how many cells are being clicked
    var clicks = 0;
    var lastClicked = [];
    var gameOver = false;

    // Timer variables
    var id;
    var ticker = 0;
    var min = 0;
    var sec = 0;

    // Cach DOM
    var grid = document.getElementsByTagName("td");
    var timer = document.getElementsByTagName("button")[0];
    var newGameButton = document.getElementsByTagName("button")[1];

    function init() {
        newGameButton.addEventListener("click", resetGame);
    }

    /* Grid is filled with icons */
    function fillGrid() {
        // Create array to hold all pairs
        var shuffledPairs = [];

        // All elements of pairs array are added to shuffledPairs twice
        // Allows each symbol to have a match
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < pairs.length; j++) {
                shuffledPairs.push(pairs[j]);
            }
        }

        // The array is shuffled
        shuffledPairs = shuffle1DArray(shuffledPairs);

        // Loop through grid to display the values
        for (var i = 0; i < grid.length; i++) {
            // // Symbol is displayed
            // grid[i].textContent = shuffledPairs[i];

            // create img
            var image = document.createElement("img");
            image.setAttribute("src", shuffledPairs[i]);
            grid[i].appendChild(image);

            // Symbol is hidden
            grid[i].setAttribute("class", "hidden");

            // Event listener is added to listen for click
            grid[i].addEventListener("click", checkMatch);
        }
    }

    /* This function is called any time a cell is clicked */
    function checkMatch() {
        // Will only run this method if cell that was clicked has no match yet
        // AND if less than two cells have been clicked
        if ((this.getAttribute("class") !== "found") && (clicks < 2)) {

            // Shows cell that was clicked
            this.setAttribute("class", "visible");
            // Increase clicks
            clicks++;

            // Adds this cell to the lastClicked array
            lastClicked.push(this);

            // Ensures lastClicked array only has two elements in it
            if (lastClicked.length > 2) {
                lastClicked.shift();
            }
        } else {
            // Method does not run
            return;
        }

        // If two cells have been revealed
        if (clicks === 2) {

            // Get src for first cell clicked
            var imgTag1 = lastClicked[0].childNodes[0];
            var img1 = imgTag1.getAttribute("src");

            // Get src for second cell clicked
            var imgTag2 = lastClicked[1].childNodes[0];
            var img2 = imgTag2.getAttribute("src");

            // The cells clicked match
            // AND the same cell was not clicked twice
            if (img1 === img2 && lastClicked[0] != lastClicked[1]) {

                console.log("match made");
                console.log(img1);
                console.log(img2);

                // Cells are matching, therefore they are found
                lastClicked[0].setAttribute("class", "found");
                lastClicked[1].setAttribute("class", "found");

                // Resets clicks
                clicks = 0;

                // Checks if this was the winning match
                checkWin();
            } else {
                // Cells do not match, therefore they will be hidden
                setTimeout(hideLastTwo, 1000);
            }
        }
    }

    /* This hides the last two cells that were clicked */
    function hideLastTwo() {
        // Makes sure the cells have not been matched
        if (lastClicked[0].getAttribute("class") !== "found") {
            // Hides cells again
            lastClicked[0].setAttribute("class", "hidden");
            lastClicked[1].setAttribute("class", "hidden");
        }
        // Returns clicks to 0
        clicks = 0;
    }

    /* Check if game is won */
    function checkWin() {
        // Loop through entire grid
        for (var i = 0; i < grid.length; i++) {
            // If any cell is not found, then game is not won and function is exited
            if (grid[i].getAttribute("class") !== "found") {
                return;
            }
        }

        // Get here if all cells are of class found, therefore game won
        displayGameOver("You Win!");
    }

    /* Display game over to user */
    function displayGameOver(message) {
        displayPopUp(message);
        gameOver = true;

        // Remove event listeners from grid
        for (var i = 0; i < grid.length; i++) {
            grid[i].removeEventListener("click", checkMatch);
        }
    }

    /* This will start the timer */
    function runClock() {
        min = Math.floor(ticker / 60);
        sec = (ticker - (min * 60)) + "";
        if (sec.length == 1) {
            sec = "0" + sec;
        }
        ticker--;
        timer.textContent = min + ":" + sec;

        // Display game over when time runs out
        if (min <= 0 && sec == 0) {
            console.log("Over time");
            displayGameOver("Time ran out! You lose!");
            return;
        }

        // Turn timer orange at 10 seconds
        // Using equality operator because min and sec are strings
        if (min == 0 && sec == 20) {
            timer.setAttribute("id", "orangeTimer");
        }

        // Turn timer red at 10 seconds
        // Using equality operator because min and sec are strings
        if (min == 0 && sec == 10) {
            timer.setAttribute("id", "redTimer");
        }

        // Timer continues only if the game is not over
        if (!gameOver) {
            id = setTimeout("concentration.runClock()", 1000);
        }
    }

    /* This will reset the game so that the user can play again */
    function resetGame() {
        // Reset Timer
        ticker = 120;
        min = 2;
        sec = 0;
        clearTimeout(id);
        timer.removeAttribute("id");

        // Removes all current images
        for (var i = 0; i < grid.length; i++) {
            grid[i].innerHTML = "";
        }

        // Reset gameOver
        gameOver = false;

        // Fill grid with new pairs
        fillGrid();
        runClock();
    }

    return {
        init: init,
        runClock: runClock
    };

})();

/**
 * GLOBAL FUNCTIONS
 * These functions can be called across all the games.
 * 
 */
/* Returns random number between min and max (inclusive) */
function random(min, max) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
}

/* This function will shuffle the values within a 1D array */
function shuffle1DArray(array) {
    // Copy the array to be shuffled
    // This ensures the original array remains in the correct order
    var shuffledArray = array.slice();

    // Loop through the array
    for (var i = 0; i < shuffledArray.length; i++) {
        // Generate a random index within the array
        var randomIndex = random(0, (shuffledArray.length - 1));

        // Swap value of the current index with a random index
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = temp;
    }
    return shuffledArray;
}

/* This will shuffle the values within a 2D array */
function shuffle2DArray(array2D) {
    // Copy the array to be shuffled
    // This ensures the original array remains in the correct order
    var shuffledArray = array2D.slice();

    // Loop through the first dimension of the shuffled array
    for (var i = 0; i < shuffledArray.length; i++) {
        // Shuffle the values within the second dimension of arrays
        for (var j = 0; j < shuffledArray[i].length; j++) {
            // Generate a random index within the array
            var randomIndex = random(0, (shuffledArray[i].length - 1));

            // Swap value of the current index with a random index
            var temp = shuffledArray[i][j];
            shuffledArray[i][j] = shuffledArray[i][randomIndex];
            shuffledArray[i][randomIndex] = temp;
        }
    }
    // Return the shuffled array
    return shuffledArray;
}

/* This function will display a pop up box for game overs */
function displayPopUp(gameOverMessage) {
    console.log("Adding panel");

    // Get nodes that will be used
    var main = document.getElementsByTagName("main")[0];
    var body = document.getElementsByTagName("body")[0];

    // Create div to hold message
    var winPanel = document.createElement("div");
    winPanel.setAttribute("class", "gameOverBox");
    main.appendChild(winPanel);

    // Add title
    var title = document.createElement("h4");
    title.textContent = "Game Over!";
    winPanel.appendChild(title);

    // Add main message
    var message = document.createElement("h2");
    message.textContent = gameOverMessage;
    winPanel.appendChild(message);

    // Add dismiss message
    var closeButton = document.createElement("p");
    closeButton.textContent = "- click anywhere to dismiss this message -";
    winPanel.appendChild(closeButton);

    // Bind event that will dismiss the pop-up
    body.addEventListener("click", removeWinPanel, true);

}

/* This function will remove the win panel pop-up */
function removeWinPanel() {

    // Get DOM Elements needed
    var winPanel = document.getElementsByClassName("gameOverBox")[0];
    var body = document.getElementsByTagName("body")[0];

    // Remove panel
    winPanel.parentNode.removeChild(winPanel);

    // Remove event listener from body
    body.removeEventListener("click", removeWinPanel, true);
}