const canvas = document.querySelector('canvas');
canvas.width=608;
canvas.height=608;
const c=canvas.getContext('2d'); //Obtém o contexto de renderização 2D do <canvas>. Esse contexto será usado para desenhar no elemento <canvas>.

//ground
//food
//snake
//score

let score = 0, snake, food, highScore=0, game;
let box = 32;      // create unit, Define o tamanho de cada célula do jogo (tamanho da caixa) 

// load images
let foodImg=new Image();
let ground=new Image();

foodImg.src='img/food.png';
ground.src='img/ground.png';

//load audios
let up=new Audio();
let down=new Audio();
let left=new Audio();
let right=new Audio();
let eat=new Audio();
let dead=new Audio();

up.src='audio/up.mp3';
down.src='audio/down.mp3';
left.src='audio/left.mp3';
right.src='audio/right.mp3';
eat.src='audio/eat.mp3';
dead.src='audio/dead.mp3'; //Define os caminhos dos arquivos de áudio correspondentes a cada ação do jogo.

ground.onload = function() //função será executada assim que a imagem de fundo for carregada
{
    c.drawImage(ground, 0, 0); //desenha a imagem do chão, começando na posição 0

    c.fillStyle='white' //estilo
    c.font='40px Calibri'; //estilo
    c.fillText(score, 2*box, 1.6*box);//desenha valor atual da pontução 

    c.font='30px Calibri';
    c.fillText("Highest Score: " + highScore, 12*box, 1.4*box); //exibe a maior pontuação
}

// control the snake 
document.addEventListener('keydown', direction); //detectar quando o usuário pressiona uma tecla do teclado e chama
let dir; //armazenar a direção do movimento da cobra     //a função direction em resposta

function startGame(){ //função que inicia o jogo

    clearInterval(game); // Limpa o intervalo de tempo atualmente definido pelo identificador game, interrompendo o jogo anterior.

    highScore = Math.max(score, highScore); //atualiza a maior pontuação
    score=0; // reseta a pontuação para zero

    // create snake
    snake = []; // Cria um array vazio para representar a cobra.
    snake[0] = { // Define a posição inicial da cabeça da cobra no meio do <canvas>
        x: 9*box,
        y: 10*box
    };

    // create food, define a posição inicial do alimento em uma posição aleatória dentro do <canvas>.
    food = {
        x: Math.floor(Math.random()*17+1)*box,
        y: Math.floor(Math.random()*15+3)*box
    };

    dir=''; // Limpa a direção do movimento da cobra.

    game = setInterval(draw,100); // call draw function every 100ms, Inicia o jogo chamando a função draw() a cada 100 milissegundos.
}



function draw() // desenha elemntos no canvas
{
    c.drawImage(ground, 0, 0); // desenha imagem de fundo

    for(let i=0;i<snake.length;i++) //Itera sobre cada segmento da cobra e desenha-os no <canvas>
    {
        c.fillStyle = (i==0) ? 'green' : 'white'; //Define a cor do segmento da cobra. O primeiro segmento é verde (cabeça), e os demais são brancos (corpo).
        c.fillRect(snake[i].x, snake[i].y, box, box); //Desenha um retângulo preenchido representando o segmento da cobra.

        c.strokeStyle = 'red'; //Define a cor da borda do segmento da cobra como vermelha.
        c.strokeRect(snake[i].x, snake[i].y, box, box); //Desenha um retângulo vazio representando a borda do segmento da cobra.
    }

    c.drawImage(foodImg, food.x, food.y); //Desenha a imagem do alimento (foodImg) na posição atual do alimento.

    // old head position,  Armazena a posição atual da cabeça da cobra.
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction, Verifica a direção da cobra com base na variável dir:
    if(dir=='left')
    {
        snakeX-=box; //decrementa snakeX por box.
    }
    else if(dir=='up')
    {
        snakeY-=box; //decrementa snakeX por box.
    }
    else if(dir=='right')
    {
        snakeX+=box; //incrementa snakeX por box.
    }
    else if(dir=='down')
    {
        snakeY+=box; //incrementa snakeX por box.
    }

    ////// if snake eats food, Se a posição da cabeça da cobra (snakeX e snakeY) for igual à posição do alimento
    if(snakeX==food.x && snakeY==food.y)
    {
        // we don't remove the tail here
        score++; //icrementa pontuação
        eat.play(); // som de comer
        food={ //gera uma nova posição para o alimento de forma aleatória.
            x: Math.floor(Math.random()*17+1)*box,
            y: Math.floor(Math.random()*15+3)*box
        }
    }
    else 
    {
        // remove the tail, Caso contrário, remove o último segmento da cobra (snake.pop()) para simular o movimento.
        snake.pop();
    }

    // add new head, Cria um novo segmento de cabeça da cobra (newHead) com as posições atualizadas 
    let newHead={
        x: snakeX,
        y: snakeY
    }

    // game over
    if(snakeX<box || snakeX>17*box || snakeY<3*box || snakeY>17*box || colission(newHead, snake)) //Verifica se ocorreu uma colisão com a parede ou com o próprio corpo da cobra:
    {//fora dos limites do <canvas> ou se houver uma colisão com o próprio corpo da cobra
        dead.play();
        clearInterval(game); //intemrrompe o jogo
    }

    snake.unshift(newHead); //Insere o novo segmento de cabeça da cobra no início do array

    c.fillStyle='white'
    c.font='40px Calibri';
    c.fillText(score, 2*box, 1.6*box);//Desenha a pontuação atual e a maior pontuação no `<canvas>`

    c.font='30px Calibri';
    c.fillText("Highest Score: " + highScore, 12*box, 1.4*box);

}

function direction(event) //Verifica qual tecla foi pressionada (event.keyCode) e atualiza a variável dir de acordo com a direção correspondente
{
    if(event.keyCode==37 && dir!='right')
    {
        left.play();
        dir='left';
    }
    else if(event.keyCode==38 && dir!='down')
    {
        up.play();
        dir='up';
    }
    else if(event.keyCode==39 && dir!='left')
    {
        right.play();
        dir='right';
    }
    else if(event.keyCode==40 && dir!='up')
    {
        down.play();
        dir='down';
    }
}

function colission(newHead, snake)
{
    for(let i=0;i<snake.lenght;i++)
    {
        if(newHead.x==snake[i].x && newHead.y==snake[i].y)
        {
            return true;
        }
    }
    return false;
}