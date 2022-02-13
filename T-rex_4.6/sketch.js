var PLAY = 1;
var END = 0;
var gameState = PLAY;
var healt = 3;
var sky; 

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloud2, cloudsGroup, cloudImage, cloudImage2;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obsMe,obsMePng,ObsMeGroup;

var score;

var gameOver,reStart,gameOverImg,reStartImg;

var checkpoint,die,jump;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  cloudImage2 = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  obsMePng = loadImage("meteorito1.png");
  
  reStartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 400);
  
 
  sky = createSprite(300,-5,600,10);
  

  trex = createSprite(50,180,17,45);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(200,280,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,290,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.4;
  reStart = createSprite(300,140);
  reStart.addImage(reStartImg);
  reStart.scale = 0.7;


  //crear grupos de obstáculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  ObsMeGroup = new Group();

  trex.setCollider("circle", 0,0,39);
  //trex.debug = true;
  sky.setCollider("rectangle", 1,10,600,10);
  sky.debug = true;
  

  console.log("Hola" + 5);
  
  score = 0;

}

function draw() {
  background(180);
  text("Puntuación: "+ score, 500,50);
  
  
  if(gameState === PLAY){

   
    trex.collide(sky);
   
    trex.changeAnimation("running", trex_running);

    //mover el suelo
    //ground.velocityX = -4;
    ground.velocityX = -(4 + 3*score/100);

    //score = score + Math.round(frameCount/369);
    score = score + Math.round(getFrameRate()/60);

    if(score >  0 && score % 100 === 0){
      checkpoint.play();
    }

    if (keyDown("c")){
      trex.debug = true;
    }
    if (keyDown("v")){
      trex.debug = false;
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(keyDown("space") && trex.y >= 220 ) {
      //trex.velocityY = -13;
      trex.velocityY = -13;
      jump.play();
    }
    
    if(keyDown("m") && trex.y >= 220 ) {
      trex.velocityY = +12;
      
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8;
    
    //aparecer nubes
  spawnClouds();
  
  //aparecer obstáculos en el suelo
  spawnObstacles();
  //aparecer el meteorito 
  SpawnObsMe();
  
   


  if(obstaclesGroup.isTouching(trex) || ObsMeGroup.isTouching(trex)){
      die.play();
    gameState = END;
   
  }
 
  /*if(ObsMeGroup.isTouching(trex)){
      
    gameState = END;
   
  }*/
    

    

  }
  else if(gameState === END){
    gameOver.visible = true;
    reStart.visible = true;
    //detener el suelo
    trex.velocityY = 0;
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

       

      

    if(keyDown("shift") && keyDown("r")){
      reset();

    }

    if(mousePressedOver(reStart)){
      reset();

    }

    //testing
    if(keyDown("shift") && keyDown("g")){
      cloudsGroup.destroyEach();
      obstaclesGroup.destroyEach();
      ObsMeGroup.destroyEach();

      
      trex.changeAnimation("running", trex_running);


      gameState = PLAY;

    }
    
    
  }
  
  
  
 
  
  
  
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,130));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
    
   //neblina 
    
  }

    if (frameCount % 639 === 0){
      cloud2 = createSprite(600,200,40,10);
    cloud2.addImage(cloudImage2);
    cloud2.y = Math.round(random(240,266));
    cloud2.scale = 1.55;
    cloud2.velocityX = -3;
    
    
    
    //asignar tiempo de vida a una variable
    cloud2.lifetime = 200;
    
    //ajustar la profundidad
    cloud2.depth = cloud2.depth + 1;
                     
    }
    }

    

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,266,10,40);
   obstacle.velocityX = -(6 + 3*score/100);

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
   obstaclesGroup.add(obstacle);

   
   
 }

      
     


    
  }
  


function SpawnObsMe(){
  if (frameCount % 90 === 0){
    var obsMe = createSprite(600,5,10,15);
    obsMe.addImage(obsMePng);
    obsMe.x = Math.round(random(450,700));
    obsMe.velocityY = +(3 + 1*score/200);
    obsMe.velocityX = -(9 + 3*score/100);
    //obsMe.velocityX = -9;
    obsMe.lifetime = 150;
    ObsMeGroup.add(obsMe); 
  }

function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  reStart.visible = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  ObsMeGroup.destroyEach();

  score = 0;
  //trex.changeAnimation("running", trex_running);


  


}

  

}
