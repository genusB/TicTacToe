function init(player, OPPONENT){

    var canvas = document.getElementById("cvs");
    var ctx = canvas.getContext("2d");

    var xImage = new Image();
    xImage.src = "img/X.png";

    var oImage = new Image();
    oImage.src = "img/O.png";

    var fieldImage = new Image();
    fieldImage.src = "img/field.png";

    let currentPlayer = player.man;

    let gameData =  new Array(9);

    let board = [];

    const column = 3;
    const row = 3;

    let WAIT = false;

    let GAME_OVER = false;

    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    if(window.matchMedia("(max-width: 1400px)")) {
        var SPACE_SIZE = 120;
    }
    else {
        var SPACE_SIZE = 150;
    }

    

    
    function drawBoard(){
        let id = 0;
        
        for(let i=0; i < row; i++){
            board[i] = [];
            for(let j=0; j < column; j++){
                // give an id from to the board tiles.
                board[i][j] = id;
                
                const img = new Image();
                img.src = "img/" + id + ".png";
                img.style.marginLeft = "0.2em";

                img.onload = function() {
                     ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
                 }
                
                
                id++

                
            }
        }
    }
    drawBoard();

    canvas.addEventListener("click", function(event){
        
        if(GAME_OVER) return;

        if(WAIT) return;

        console.log(event);

        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        let i = Math.floor(Y/SPACE_SIZE);
        let j = Math.floor(X/SPACE_SIZE);

        if(gameData[getIdOfTile(i, j)]) return;
        gameData[getIdOfTile(i, j)] = currentPlayer;
        
        drawOnBoard(currentPlayer, i, j);

        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        if(isTie(gameData)){
            showGameOver("tie");
            GAME_OVER = true;
            return;
        }

        if(OPPONENT == "computer"){

            if(GAME_OVER) return;
        
            WAIT = true;

            let id = AIMove();

            let IJ = getIJOfTile(id);
            drawOnBoard(player.computer, IJ.i, IJ.j);

            gameData[id] = player.computer;

            if(isWinner(gameData, player.computer)){
                showGameOver(player.computer);
                GAME_OVER = true;
                return;
            }

            if(isTie(gameData)){
                showGameOver("tie");
                GAME_OVER = true;
                return;
            }

            WAIT = false;
        }else{
          
            currentPlayer = currentPlayer == player.man ? player.friend : player.man;
        
            
        }
    });

    function AIMove(){
        // Find empty tiles
        let emptyTiles = [];
        for(let i = 0; i < gameData.length; i++){
            if(!gameData[i]){
                emptyTiles.push(i);
            }
        }

        // Find empty corner tiles
        let emptyCornerTiles = [];
        const corners = [0, 2, 6, 8];
        for(let i = 0; i < emptyTiles.length; i++){
            for( let j = 0; j < corners.length; j++){
                if( corners[j] == emptyTiles[i]){
                    emptyCornerTiles.push(corners[j]);
                }
            }
        }

        // Find empty edge tiles
        let emptyEdgeTiles = [];
        const edges = [1, 3, 5, 7];
        for(let i = 0; i < emptyTiles.length; i++){
            for( let j = 0; j < edges.length; j++){
                if( edges[j] == emptyTiles[i]){
                    emptyEdgeTiles.push(edges[j]);
                }
            }
        }

        // check For Best Move
        
        for(let i = 0; i < emptyTiles.length; i++){
            let gameDataCopy = [...gameData];
            gameDataCopy[emptyTiles[i]] = player.computer;
            
            if(isWinner(gameDataCopy, player.computer)){
                return emptyTiles[i];
            }
        }

        for(let i = 0; i < emptyTiles.length; i++){
            let gameDataCopy = [...gameData];
            gameDataCopy[emptyTiles[i]] = player.man;
            
            if(isWinner(gameDataCopy, player.man)){
                return emptyTiles[i];
            }
        }

        let centerTileId = 4;

        // select center tile if it's empty
        for(let i = 0; i < emptyTiles.length; i++){
            if(emptyTiles[i] == centerTileId){
                console.log("empty center");
                return centerTileId;
            }
        }

       //select random corner
        if(emptyCornerTiles.length > 0){
            let randomIndex = Math.floor(Math.random() * emptyCornerTiles.length);
            id = emptyCornerTiles[randomIndex];
            return id;
        }   

        //select random edge
        if(emptyEdgeTiles.length > 0){
            let randomIndex = Math.floor(Math.random() * emptyEdgeTiles.length);
            id = emptyEdgeTiles[randomIndex];
            return id;
        }


    }

    function getIdOfTile(i, j){
        return board[i][j]; 
    }

    function getIJOfTile(id){
        for(let i=0; i < row; i++){
            for(let j=0; j < column; j++){
                if(board[i][j] == id){
                    let IJ = {
                        i : i,
                        j : j
                    }
                    return IJ;
                }
            }
        }
    }

    function drawOnBoard(player, i, j){
        const img = player == "X" ? xImage : oImage;
        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
    }

    function isWinner(data, player){

        for(let i = 0; i < COMBOS.length; i++){
            let won = true;

            for(let j = 0; j < COMBOS[i].length; j++){
                let id = COMBOS[i][j];
                won = data[id] == player && won;
            }

            if(won){
                return true;
            }
        }

        return false;
    }

    function isTie(gameData){
        let isBoardFill = true;
        
        for(let i = 0; i < gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
        }

        if(isBoardFill){
            return true;
        }

        return false;
    }

    function showGameOver(player){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let imgSrc = `img/${player}.png`;
        let message = player == "tie" ? "Ničyja" : "Pieramožac";

        gameOverElement.innerHTML = `
            <h2>${message}</h2>
            <img class="winner-img" src=${imgSrc} alt="">
            <div class="play" onclick="location.reload();">Spačatku</div>
            `;
        
            gameOverElement.classList.remove("hide");
    }
}