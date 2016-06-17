var inactivepos;
var inactive;
var press;
var paddleone;
var paddletwo;
var ball;
var paddleupordown;
var leftscore;
var rightscore;
var flag;
var gameover;
var active;
var scoredisp;
var net;
var highscore = 0;
var hs;
var prevhigh = 0;
var paddlehit;
var gameend;
var bounce;
var endpaddle = "left";

function startgame() 
{
    if(highscore <= leftscore + rightscore)
    {
        highscore = leftscore + rightscore;
        prevhigh = highscore;
    }
    
    press = 0;
    paddleupordown = 0;
    inactivepos = 165;
    bounce = new sound("bounce1.mp3");
    paddlehit = new sound("obstaclehit.mp3");
    gameend = new sound("gameover.mp3");
    paddleone = new component(30, 70, "red", 10, 165,"paddle");
    paddletwo = new component(30, 70, "red", 760, 165,"paddle");
    ball = new component(10, 10, "blue", 395, 395,"ball");
    gameover = new component("40px", "Comic Sans MS", "pink", 270, 190, "text");
    hs = new component("30px", "Comic Sans MS", "pink", 90, 40, "text");
    scoredisp = new component("30px", "Comic Sans MS", "pink", 600, 40, "text");
    net = new component(5, 400, "#777", 398, 0,"net");
    
    ball.speedy = -1;
    leftscore = 0;
    rightscore = 0;
    flag = 0;
    
    if(endpaddle == "left")
    {
        inactive = paddleone;
        active = paddletwo ;
        ball.speedx = 1;
    }
    
    else if(endpaddle == "right")
    {
        inactive = paddletwo;
        active = paddleone;
        ball.speedx = -1;
    }
    
    $('#disp').hide();
    $('#instructions').fadeIn(500);
    $('canvas').fadeTo(500,1);
    
    gamearea.start();
}

var gamearea = 
{
    canvas : document.createElement("canvas"),
    
    start : function() 
    {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.setinterval();
        this.gamepause = setInterval(game_pause,100);
        
        window.addEventListener('keydown', function (e) 
        {
            gamearea.key = e.keyCode;
        })
        
        window.addEventListener('keyup', function (e) 
        {
            gamearea.key = false;
        })
    },

    setinterval : function()
    {
        this.interval = setInterval(updatearea, 20);       
    },
    
    clear : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    pause : function()
    {
        gameover.text = "GAME PAUSED";
        gameover.update();
        clearInterval(this.interval);
    },
   
    stop : function()
    {   
        gameover.text = "GAME OVER";
        gameover.update();
        
        clearInterval(this.gamepause);
        clearInterval(this.interval);
        
        gameend.play();
        
        setTimeout( function()
        {
            $("#instructions").hide();
            $('canvas').fadeTo(3000,0.7);
            $("#disp").fadeIn(3000);
        },1000);
    }
}

function component(width, height, color, x, y,type)
{
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedx = 0;
    this.speedy = 0;
    
    this.update = function()
    {
        ctx = gamearea.context;
        if (type == "text") 
        {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newpos = function()
    {
        this.x += this.speedx;
        this.y += this.speedy;
    }
    
    this.collision = function(obs)
    {   
        var ballright = this.x + this.width;
        var ballleft = this.x;
        var balltop = this.y;
        var ballbottom = this.y + this.height;
        var paddleleft = obs.x;
        var paddleright = obs.x + obs.width;
        var paddlebottom = obs.y + obs.height;
        var paddletop = obs.y;
        
        if(ballbottom > paddletop && balltop < paddlebottom && ballright > paddleleft && ballleft < paddleright)
            return true;
        
        return false;
    }
    
    this.wallcollision = function()
    {
        if(ball.y < 0)
        {   
            bounce.play();
            this.y = 0;
            this.speedy = (-1)*(this.speedy);
            this.speedy += 0.05;
        }
        else if(ball.y > 395)
        {   
            bounce.play();
            this.y = 395;
            this.speedy = (-1)*(this.speedy);
            this.speedy -= 0.05;
        }
        if(ball.x <- 25)
        {   
            endpaddle = "left";
            gamearea.stop();
        }
        if(ball.x > 815)
        {
            endpaddle = "right";
            gamearea.stop();
        }
        if (active.y < 0) 
            active.y = 0;
        if(active.y > 325)
            active.y = 325;
    }
}

function updatearea() 
{
    gamearea.clear();
    net.update();
    ball.update();

    if(paddleupordown = -1 && inactivepos < inactive.y)
        inactive.y --;
    else if (paddleupordown = 1 && inactivepos > inactive.y)
        inactive.y++;

    paddleone.update();
    paddletwo.update();
    
    if(ball.collision(paddleone))
    {   
        ball.speedx = (-1)*(ball.speedx);
        ball.speedx += 0.15;

        active = paddletwo;
        inactive = paddleone;  

        inactivepos = Math.floor(Math.random() * 326);

        if(inactivepos > inactive.y)
            paddleupordown = 1;
        else
            paddleupordown = -1;

        if(flag == 0)
        {   
            flag = 1;
            paddlehit.play();
            leftscore++;
            
            setTimeout(function()
            {   
                flag = 0;
            },1500);
        }
    }
    else if(ball.collision(paddletwo))
    {
        ball.speedx = (-1)*(ball.speedx);
        ball.speedx-=0.15;
        active = paddleone;
        inactive = paddletwo;
        inactivepos = Math.floor(Math.random() * 326);
        
        if(inactivepos > inactive.y)
            paddleupordown = 1;
        else
            paddleupordown = -1;

        if(flag == 0)
        {   
            flag = 1;
            paddlehit.play();
            rightscore++;
            
            setTimeout(function()
            {   
               flag = 0;
            },1500);
        }
    }

    scoredisp.text = "SCORE: " + (leftscore + rightscore);
    scoredisp.update();

    if(highscore != 0)
    {   
        if(prevhigh+1 == leftscore+rightscore && highscore+1 == leftscore+rightscore)
        {   
            gameover.x=230;
            gameover.text = "NEW HIGHSCORE";
            gameover.update();
            setTimeout(function()
            {
                highscore = leftscore + rightscore;
                gameover.x=270;
            },800);
            
            hs.text = "HIGHSCORE: "+(highscore+1);
            hs.update();
        }

        else 
            {
                if(highscore < leftscore+rightscore)
                highscore = leftscore+rightscore;
                hs.text = "HIGHSCORE: "+highscore;
                hs.update();    
            }

        
    }

    if (gamearea.key && gamearea.key == 38) 
        active.speedy = -5;
    if (gamearea.key && gamearea.key == 40)
        active.speedy = 5;

    
    ball.newpos();
    ball.wallcollision();
    
    active.newpos();
    active.update();
    active.speedy = 0;
}

function newgame()
{
    startgame();
}

function game_pause()
{
    if(gamearea.key && gamearea.key == 32)
    {
        press++;
    
        if(press%2!=0)
        {
           gamearea.pause();
        }
        else
            gamearea.setinterval();
    }
}


function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    
    this.play = function()
    {
        this.sound.play();
    }
    
    this.stop = function()
    {
        this.sound.pause();
    }    
}
