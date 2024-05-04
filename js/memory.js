export var game = function(){
    var punts
    var temps
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        waiting: false,
        isDone: false,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, temps);
        },
        goFront: function (last){
            if (last)
                this.waiting = last.waiting = false;
            else
                this.waiting = true;
                this.current = this.front;
                this.clickable = false;
                this.callback();
        },
        check: function (other){
            if (this.front === other.front)
                this.isDone = other.isDone = true;
            return this.isDone;
        }
    };

  
 
    const default_options = {
        pairs:2,
        difficulty:'normal'
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));

    var lastCard;
    var pairs = options.pairs;
    var points = 100;
    var difficulty = options.difficulty;
    var cards = []; // Llistat de cartes

    
    console.log(difficulty)


    switch(difficulty){

        case 'easy':
            temps=2000;
            punts=15;
            break;

        case 'normal':
            temps=1000;
            punts=25;
            break;

        case 'hard':
            temps=500;
            punts=50;
            break;
    }
   

    var mix = function(){
        console.log(pairs)
        var items = resources.slice(); // Copiem l'array
        items.sort(() => Math.random() - 0.5); // Aleatòria
        items = items.slice(0, pairs); // Agafem els primers
        items = items.concat(items);
        return items.sort(() => Math.random() - 0.5); // Aleatòria
    }
    return {
        init: function (call){
            if (sessionStorage.save){ // Load game
                let partida = JSON.parse(sessionStorage.save);
                pairs = partida.pairs;
                points = partida.points;
                var i = partida.cards.map(item=>{
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    cards.push(it);
                    if (it.current != back && !it.waiting && !it.isDone) it.goBack();
                    else if (it.waiting) lastCard = it;
                });

                return cards;
            }
            else return mix().map(item => { // New game

                cards.push(Object.create(card, { front: {value:item}, callback: {value:call}}));
                
                cards.forEach(c=>{
                    c.current = c.front
                    c.clickable = false
                    setTimeout(() => {
                        c.current = back;
                        c.clickable = true;
                        c.callback();
                    }, temps);

                });
                
                return cards[cards.length-1];
            });
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard){ // Segona carta
                if (card.check(lastCard)){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=punts;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        },
        save: function (){
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
                points: points,
                cards: []
            };
            cards.forEach(c=>{
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });

            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php",{
                method: "POST",
                body: json_partida,
                headers: {"content-type":"application/json; charset=UTF-8"}
            })
            .then(response=>response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err=>{
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(()=>{
                window.location.replace("../");
            });
        }
    }
}();