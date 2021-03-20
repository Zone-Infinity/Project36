var dog, dogImg, happyDogImg, database, foodS, foodStock;
var feedPetButton, addFoodButton;
var fedTime, lastFed;
var gameStateRef, gameState;
var foodObj;
var dogName;

function preload() {
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/Happy.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/WashRoom.png");
  sadDog = loadImage("images/deadDog.png");
}

function setup() {
  database = firebase.database();
  canvas = createCanvas(800, 500);

  foodObj = new Food(foodS);

  feedPetButton = createButton("Feed Dog");
  feedPetButton.position(480, 120);
  feedPetButton.mousePressed(feedDog);

  addFoodButton = createButton("Add Food");
  addFoodButton.position(580, 120);
  addFoodButton.mousePressed(addFood);

  changeName = createButton("Change Name");
  changeName.position(850, 200);
  changeName.mousePressed(updateName);

  dog = createSprite(550, 300);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  gameStateRef = database.ref('gameState');
  gameStateRef.on("value", (data) => gameState = data);
}


function draw() {
  background(color(46, 139, 87));

  //foodObj.display();

  textSize(20);
  fill("white");

  database.ref('Name').on("value", function (data) {
    dogName = data.val();
  })

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });
  fedTimeMin = database.ref('FeedTimeMin');
  fedTimeMin.on("value", function (data) {
    lastFedMin = data.val();
  })

  if(gameState != "hungry"){
    feedPetButton.hide();
    dog.visible = false;
  } else {
    dog.visible = true;
    dog.addImage(sadDog);
    feedPetButton.show();
  }

  currentTime = hour();

  if(currentTime === lastFed+1){
    foodObj.garden();
    update("playing");
  } else if(currentTime === lastFed + 2){
    update("sleeping");
    foodObj.bedroom();
  } else if(currentTime > lastFed+2 && currentTime <= lastFed + 4){
    update("bathing");
    foodObj.washroom();
  } else {
    update("hungry");
    foodObj.display();
  }

  if (lastFed != null) {
    if (lastFed >= 12) {
      time = lastFed % 12;
      if (time === 0) { time = 12 }
      text("Lasts Feed : " + time + ":" + lastFedMin + " PM", 590, 20);
    } else if (lastFed == 0) {
      text("Last Feed : 12:" + lastFedMin + " AM", 600, 30);
    } else {
      text("Last Feed : " + lastFed + ":" + lastFedMin + " AM", 590, 20);
    }
  }

  drawSprites();

  text("X: " + mouseX + " Y: " + mouseY, 5, 20);
  if (dogName) {
    textSize(30);
    textFont("Glasgow");
    textAlign(CENTER);
    text(dogName, 550, 430);
  }
}

function updateName() {
  changeName.hide();
  input = createInput('Name');
  input.position(850, 180);

  button = createButton('OK');
  button.position(915, 210);

  button.mousePressed(
    function () {
      changeName.show();
      button.hide();
      input.hide();

      var name = input.value();
      dogName = name;

      database.ref('/').update({
        Name: dogName
      })
    }
  )
}

function readStock(data) {
  foodS = data.val();
}

function feedDog() {
  update("nothing");

  dog.addImage(happyDogImg);

  if (foodS != 0) foodS--;

  foodObj.updateFoodStock(foodS);

  database.ref('/').update({
    FeedTime: hour(),
    FeedTimeMin: minute()
  });

  database.ref('/').update({
    Food: foodS
  })
}

function addFood() {
  foodS++;
  foodObj.updateFoodStock(foodObj.getFoodStock() + 1);
  database.ref('/').update({
    Food: foodS
  })
}

function update(game_state){
  gameState = game_state;
  database.ref('/').update({
    gameState: game_state
  });
}
