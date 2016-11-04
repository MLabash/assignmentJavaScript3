var settingsText = '{"CANVAS_WIDTH": "700","CANVAS_HEIGHT" : "400","CONTAINER_WIDTH" : "75","CONTAINER_HEIGHT" : "100","GREY_CONTAINER_X" : "400","GREY_CONTAINER_Y" : "235", "GREY_CONTAINER_IMAGE" : "src/containers/grey.png" ,"GREEN_CONTAINER_X" : "500","GREEN_CONTAINER_Y" : "235","GREEN_CONTAINER_IMAGE" : "src/containers/green.png", "BLUE_CONTAINER_X" : "600", "BLUE_CONTAINER_Y" : "235","BLUE_CONTAINER_IMAGE" : "src/containers/blue.png", "TRASH_ITEM_DIMENSION" : "32",  "SCORE_CORRECT_X" : "500", "SCORE_CORRECT_Y" : "30", "SCORE_CORRECT_TEXT" : "CORRECT: " ,"SCORE_INCORRECT_X" : "500",  "SCORE_INCORRECT_Y" : "60",  "SCORE_INCORRECT_TEXT" : "INCORRECT: ","SCORE_FONT" : "20px Arial","LEFT_KEY" : "37", "RIGHT_KEY" : "39" ,"UP_KEY" : "38","DOWN_KEY" : "40", "STEP" : "3",  "MINUS_STEP" : "-3", "CORRECT_ANSWER_SOUND" : "src/sounds/Correct-answer.mp3", "INCORRECT_ANSWER_SOUND" :"src/sounds/Wrong-answer-sound-effect.mp3"}';

var settings = JSON.parse(settingsText);

var game;

/********************************* Play sound when trash comes in the container *************************/
// If trash is put in the right container, play CORRECT_ANSWER_SOUN.
// Otherwise play INCORRECT_ANSWER_SOUND.

function playSound(isCorrectAnswer) {   
    var answerSound = new Audio();
    
    answerSound.src = (isCorrectAnswer ? settings.CORRECT_ANSWER_SOUND : settings.INCORRECT_ANSWER_SOUND);
    answerSound.play();
}

/********************************* Draw  grey, green and blue trash Containers  ************************/
//Draw each container image according to it's coordinates
function drawTrashContainers() {
     var image1 = new Image;
     var image2 = new Image;
     var image3 = new Image;
    
    image1.src = settings.GREY_CONTAINER_IMAGE;
    game.ctx.drawImage(image1, Number(settings.GREY_CONTAINER_X), Number(settings.GREY_CONTAINER_Y));
    image2.src = settings.GREEN_CONTAINER_IMAGE;
    game.ctx.drawImage(image2, Number(settings.GREEN_CONTAINER_X), Number(settings.GREEN_CONTAINER_Y));
    image3.src = settings.BLUE_CONTAINER_IMAGE;
    game.ctx.drawImage(image3, Number(settings.BLUE_CONTAINER_X), Number(settings.BLUE_CONTAINER_Y));
}

/************** Determine in which container is the trash ******************************************/
//Compare trash element coordinats(x,y) with containers coordinates to check if it is inside 
function inWichContainer(x, y){
    var container='';
    
    if (x >= Number(settings.GREY_CONTAINER_X) && x <= (Number(settings.GREY_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) &&
        y >= Number(settings.GREY_CONTAINER_Y) && y <= (Number(settings.GREY_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the grey container
        container = 'grey';
    }
    else if (x >= Number(settings.GREEN_CONTAINER_X) && x <= (Number(settings.GREEN_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) && y >= Number(settings.GREEN_CONTAINER_Y) && y <= (Number(settings.GREEN_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the green container
        container = 'green';
    }
    else if (x >= Number(settings.BLUE_CONTAINER_X) && x <= (Number(settings.BLUE_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) 
    && y >= Number(settings.BLUE_CONTAINER_Y) && y <= (Number(settings.BLUE_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the blue container
        container = 'blue';
    }
    else
    {
        // Trash is still out containers
        container = 'out';
    }
            
    return container;
}

/*********************************** Draw and update score ***************************/

var score = {
    correctCounter : 0,
    incorrectCounter : 0,
    
    drawScore : function() {
        game.ctx.font = settings.SCORE_FONT;
        game.ctx.fillText(settings.SCORE_CORRECT_TEXT + this.correctCounter, Number(settings.SCORE_CORRECT_X) , Number(settings.SCORE_CORRECT_Y));
        game.ctx.fillText(settings.SCORE_INCORRECT_TEXT + this.incorrectCounter, Number(settings.SCORE_INCORRECT_X), Number(settings.SCORE_INCORRECT_Y));
    },
    updateScore : function(isCorrectAnswer) {
        if(isCorrectAnswer) {
            this.correctCounter++;
        }
        else{
            this.incorrectCounter++;
        }
    } 
};
/***************************** Trash Element Object **********************************/
var trashElements = {
    x : 150,
    y : 275,
    incrementX : 0,
    incrementY : 0,
    imageIndex : 0,
    // Array of trash element images
    trashElementsSrs : [
        {'url' : 'src/trash/Umbrella.png', 'container' : 'grey'},
        {'url' : 'src/trash/box.png', 'container' : 'blue'},
        {'url' : 'src/trash/glasses.png', 'container' : 'grey'},
        {'url' : 'src/trash/leaf.png', 'container' : 'green'},
        {'url' : 'src/trash/notebook.png', 'container' : 'blue'}
    ],
    
    // Draw trash element in it's position 
    drawTrashElement : function() {
        var image = new Image;
        
        image.src = this.trashElementsSrs[this.imageIndex].url;
        game.ctx.drawImage(image,this.x,this.y);
    },
    
    // If trash element still outside any container upate it's position according to arrow keys.
    // Otherwise play suitable sound and and update score and get another trash element from trash element array.   
    updateTrashElement : function() {
        var container = inWichContainer(this.x, this.y);
        
        if(container == 'out')
        {
            if (( (this.x + this.incrementX) < 0) || ((this.x + this.incrementX) > Number(settings.CANVAS_WIDTH) - Number(settings.TRASH_ITEM_DIMENSION))) {
               this.incrementX = 0;
            }
            if (( (this.y + this.incrementY) < 0) || ((this.y + this.incrementY) > Number(settings.CANVAS_HEIGHT)  - Number(settings.TRASH_ITEM_DIMENSION))) {
               this.incrementY = 0;
            }
            this.x += this.incrementX; 
            this.y += this.incrementY;
        }
        else 
        {
            var  isCorrectAnswer = (container == this.trashElementsSrs[this.imageIndex].container);
            
            playSound(isCorrectAnswer);
            score.updateScore(isCorrectAnswer);
         
            this.x  = 150;
            this.y  = 275;
            this.updateImageIndex();
        } 
    },
    // Udate the index to get another trash element 
    updateImageIndex : function() {
        this.imageIndex = (this.imageIndex == this.trashElementsSrs.length - 1 ? 0 : this.imageIndex + 1);
    }
}

/*************************************** Update game *************************************/
//Clear canvas and draw it again to reflect changes in score and trash element 
function updateGame() {
    game.ctx.clearRect(0, 0, Number(settings.CANVAS_WIDTH), Number(settings.CANVAS_HEIGHT));
    drawTrashContainers();
    
    trashElements.incrementX = 0;
    trashElements.incrementY = 0; 
    
    if (game.key && game.key == 37) {trashElements.incrementX = Number(settings.MINUS_STEP);}
    if (game.key && game.key == 39) {trashElements.incrementX = Number(settings.STEP);}
    if (game.key && game.key == 38) {trashElements.incrementY = Number(settings.MINUS_STEP);}
    if (game.key && game.key == 40) {trashElements.incrementY = Number(settings.STEP);}
    trashElements.updateTrashElement();    
    trashElements.drawTrashElement();
    score.drawScore();
}

/**************************** Start game ***********************************/
// Prepare canvas 
// Draw containers and score and trash elements
// Add EventListener to get user's keyboard input 
// update game
game = {
    canvas : document.getElementById("canvas"),
    ctx:canvas.getContext("2d"),

    startGame : function() {
        drawTrashContainers();
        score.drawScore();
        trashElements.drawTrashElement();
        this.interval = setInterval(updateGame, 20);

        window.addEventListener('keydown', function (e) {
                game.key = e.keyCode;
            });
        window.addEventListener('keyup', function (e) {
                game.key = false;
            });
    }
}

game.startGame();