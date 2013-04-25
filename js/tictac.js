
$(window).load(function() {

    // Constants.
    var ROWS = 5,
        COLUMNS = 5, 
        BLANK = " ";
        X = "X",
        O = "O",
        IMG = {},
        IMG[BLANK] = "<img src='img/blank.png'>",
        IMG[X] = "<img src='img/x.png'>",
        IMG[O] = "<img src='img/o.png'>";


    var fieldElement = null,
        fieldModel = null, // Stores the state of the field so we don't have to query the DOM so much.
        turnCount = null,
        currentPlayer = null;


    // Initializes the field elements. This happens once per page load.
    function constructField() {
        fieldElement = document.getElementById("field");
        for (var row = 0; row < ROWS; row++) {
            var tr = document.createElement("tr");
            fieldElement.appendChild(tr);
            for (var column = 0; column < COLUMNS; column++) {
                td = document.createElement("td");
                td.className = 'tictac-cell';
                td.id = row + ',' + column;
                tr.appendChild(td);
            }
        }
    }


    // Centers the field relative to the window.
    function centerField() {
        $("#container").css("width", $("#container").width()*1.1); // prevents shifting of container when text size changes.
        $("#container").css("margin-left", -$("#container").width()/2);
        $("#container").css("margin-top", -$("#container").height()/2);
    }


    function initializeNewGame() {
        fieldModel = {};
        turnCount = 0;
        currentPlayer = X;
        for (var row = 0; row < ROWS; row++) {
            for (var column = 0; column < COLUMNS; column++) {
                document.getElementById(row + ',' + column).innerHTML = IMG[BLANK];
                fieldModel[[row,column]] = BLANK;
            }
        }
        $("#player-turn-label").text("Your turn, Player " + currentPlayer + "!");
    }


    // Player clicked the field.
    function handleClick(e) {
        var td = e.target.parentNode;
        row = parseInt(td.id.split(",")[0]);
        column = parseInt(td.id.split(",")[1]);
        if (fieldModel[[row,column]] == BLANK) {
            td.innerHTML = IMG[currentPlayer];
            fieldModel[[row,column]] = currentPlayer;
            if (victoryCheck(row, column)) {
                $("#winner-label").text("Player " + currentPlayer + " wins!");
                $("#winner-modal").modal();
                return;
            }
            // See if we're out of turns.
            turnCount ++;
            if (turnCount == ROWS*COLUMNS) {
                $("#winner-label").text("Cat's game.");
                $("#winner-modal").modal();
                return;
            }
            // Next player's turn.
            if (currentPlayer == X) {
                currentPlayer = O;
            }
            else {
                currentPlayer = X;
            }
        }
        $("#player-turn-label").text("Your turn, Player " + currentPlayer + "!");
    }


    // Checks the row, column, and possibly diagonal for victory state.
    function victoryCheck(row, column) {
        // Check for current row victory.
        rowSum = 0;
        for (var c = 0; c < COLUMNS; c++) {
            if (fieldModel[[row, c]] == currentPlayer) {
                rowSum++;
            }
        }
        if (rowSum == COLUMNS) {
            return true;
        }

        // Check for current column victory.
        columnSum = 0;
        for (var r = 0; r < ROWS; r++) {
            if (fieldModel[[r, column]] == currentPlayer) {
                columnSum++;
            }
        }
        if (columnSum == ROWS) {
            return true;
        }

        // Is the field square?
        if (ROWS != COLUMNS) {
            // Nope, don't worry about diagonal victories.
            return false;
        }

        // Are we on a diagonal?
        if (row != column && ROWS - 1 - row != column) {
            return false;
        }

        // Yes, we are. Check positive and negative slope diagonals for victory.
        negSlopeSum = 0;
        posSlopeSum = 0;
        for (var i = 0; i < ROWS; i++) {
            if (fieldModel[[i,i]] == currentPlayer) {
                negSlopeSum++;
            }
            if (fieldModel[[ROWS-1-i,i]] == currentPlayer) {
                posSlopeSum++;
            }
        }
        if (negSlopeSum == ROWS || posSlopeSum == ROWS) {
            return true;
        }

        // No victory for you.
        return false;
    }



    // Player clicked the modal play again button.
    function playAgain(e) {
        $("#winner-modal").modal('hide');
        initializeNewGame();
    }


    // Initialize elements and events.
    constructField();
    initializeNewGame();
    centerField();
    $("#field").delegate(".tictac-cell", "click", handleClick); // <-- Thanks, Richard!
    $("#play-again-button").click(playAgain);
    $('img').on('dragstart', function(event) { event.preventDefault(); });


    // Do something fun with the background.
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;    
    var theta = 0;
    function animate() {
        requestAnimationFrame(animate);
        theta += 0.001;
        var x = Math.cos(theta) * 1000;
        var y = Math.sin(theta) * 1000;
        $("body").css("background-position", x + "px " + y + "px");        
    }
    requestAnimationFrame(animate);

});

