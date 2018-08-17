var scores, roundScore,activePlayer, gameActive;
 
init();



document.querySelector('.btn-roll').addEventListener('click',function(){
   if(gameActive){
         // Get the random number
    var dice = Math.floor(Math.random() * 6) +1;
    //console.log(dice);
    //display the result and change the image
    var diceSel = document.querySelector('.dice');
    diceSel.style.display = 'block';
    diceSel.src = 'dice-' + dice + '.png';
    
    //Update the score if number was not one
    if(dice !== 1){
        roundScore += dice;
        document.querySelector('#current-'+ activePlayer).textContent = roundScore;
        
        
    }else{
       
        nextPlayer();
        
    }
    
   }
  
    
    
});
document.querySelector('.btn-hold').addEventListener('click',function(){
   if(gameActive){
      //Add the global score
    scores[activePlayer] +=roundScore;
    
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
    if(scores[activePlayer] >= 100){
     
        document.querySelector("#name-" + activePlayer).textContent = 'Winner!';
        document.querySelector('.dice').style.display = 'none';
        document.querySelector(".player-" + activePlayer + "-panel").classList.add('winner');
        document.querySelector(".player-" + activePlayer + "-panel").classList.remove ('active');
        gameActive=false;
    }else{
        nextPlayer();    
    } 
   }
    
    //check if won
    
    

});

document.querySelector('.btn-new').addEventListener('click',init);

function nextPlayer(){
 document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
        roundScore = 0;
        document.querySelector('#current-'+ activePlayer).textContent = roundScore;
        activePlayer === 0 ? activePlayer = 1 :activePlayer =0;
        document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
        
        diceSel.style.display = 'none';


}


function init(){
    scores = [0,0];
    gameActive =true;
roundScore = 0;
activePlayer = 0; //Using 0 to denote the first player
document.querySelector('.dice').style.display = 'none';
document.getElementById('score-0').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-1').textContent = '0';
document.getElementById('name-0').textContent = 'Player 1';
document.getElementById('name-1').textContent = 'Player 2';
document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');
document.querySelector('.player-0-panel').classList.add('active');    
}