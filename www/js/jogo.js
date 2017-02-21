var bolaNaBarra = true;
var score = 0;
var scoreText;
var introText;
var vidasText;
var vidas = 3;
var app={
inicio: function(){
    alto  = document.documentElement.clientHeight-40;
    ancho = document.documentElement.clientWidth;

    app.iniciaJuego();
},

iniciaJuego: function(){
	var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
   
function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
	  game.stage.backgroundColor = '#f27d0c';     
      game.load.image('fundo', 'assets/fundo.png');
      game.load.image('bola', 'assets/bola.png');
      game.load.image('barra', 'assets/barra.png');
      game.load.image('bloco', 'assets/bloco.png');
}

function create() {
	//  We check bounds collisions against all walls other than the bottom one
      game.physics.arcade.checkCollision.down = false;
      fundo= game.add.sprite(0,0, 'fundo');
	  
      bola= game.add.sprite(150,415, 'bola');
	  game.physics.enable(bola, Phaser.Physics.ARCADE);	 
	  bola.anchor.set(0.1);
      bola.checkWorldBounds = true;
	  bola.body.collideWorldBounds = true;
	  bola.body.bounce.set(1);	  

	  
	  barra= game.add.sprite(150,450, 'barra');
	  game.physics.enable(barra, Phaser.Physics.ARCADE);
	  barra.body.collideWorldBounds = true;
	  barra.body.bounce.set(1);
      barra.body.immovable = true;
	
	  blocos = game.add.group();
	  blocos.enableBody = true;
	  blocos.physicsBodyType = Phaser.Physics.ARCADE;
	  
	
	  for (var i = 0; i < 12; i++)
    	{
        //  criar os blocos dentro  dum grupo
		if (i<4) {
        var bloco = blocos.create((i * 70)+10, 50, 'bloco');
		}
		else if (i<8) {
        var bloco = blocos.create((i-4) * 70, 100, 'bloco');
		}
        else {
		var bloco = blocos.create(((i-8) * 70)+10, 150, 'bloco');
			}
	
		bloco.body.bounce.set(1);
		bloco.body.immovable=true;
}

bola.events.onOutOfBounds.add(bolaPerdida, this);
scoreText = game.add.text(10, 10, 'Score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
vidasText = game.add.text(200, 10, 'Vidas: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
introText = game.add.text(15, 250, '- Toque para começar -', { font: "28px Arial", fill: "#ffffff", align: "center" });
game.input.onTap.add(libertaBola, this);
	  
	 
		
function libertaBola(pointer1) {
		if (bolaNaBarra) {
				bolaNaBarra = false;
				bola.body.velocity.y = -300;
				bola.body.velocity.x = -75;
				introText.visible = false;
			}
}
}


function update(){
		barra.x=game.input.x;

		if (barra.x < 10)
		{
			barra.x = 10;
		}
		else if (barra.x > game.width - 100)
		{
			barra.x = game.width - 100;
		}
	
		if (bolaNaBarra)
		{
			bola.body.x = barra.x;
		}
		else
		{
			game.physics.arcade.collide(bola, barra, bolaBateBarra, null, this);
			game.physics.arcade.overlap(bola, blocos, acertaBloco, null, this);
		
		}


		//game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
	function acertaBloco(bola, bloco) {    
			// Removes the bloco from the screen
			bloco.kill();

			score += 10;
		
			scoreText.text = 'Score: ' + score;
		
			//  Are they any bricks left?
			if (blocos.countLiving() == 0)
			{
				introText.text = 'PARABÉNS!';
			    introText.visible = true;
				bola.body.velocity.setTo(0, 0);
				
			}
		}

 }
 }
}

function bolaBateBarra (bola, barra) {

    var diff = 0;

    if (bola.x < barra.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = barra.x - bola.x;
        bola.body.velocity.x = (-10 * diff);
    }
    else if (bola.x > barra.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = bola.x -barra.x;
        bola.body.velocity.x = (5 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        bola.body.velocity.x = 2 + Math.random() * 8;
    }
}

function bolaPerdida () {

    vidas--;
    vidasText.text = 'Vidas: ' + vidas;

    if (vidas === 0)
    {
        gameOver();
    }
    else
    {
        bolaNaBarra = true;
        bola.reset(barra.body.x + 35 , barra.body.y-33);
        
    }

}

function gameOver () {

    bola.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;

}

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}