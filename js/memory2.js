export var game = function() {
    const back = '../resources/back.png';
    const resources = [
        '../resources/cb.png', '../resources/co.png', '../resources/sb.png',
        '../resources/so.png', '../resources/tb.png', '../resources/to.png'
    ];
    const card = {
        current: back,
        clickable: true,
        waiting: false,
        isDone: false,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, this.temps);
        },
        goFront: function(last) {
            if (last) {
                this.waiting = last.waiting = false;
            } else {
                this.waiting = true;
            }
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function(other) {
            if (this.front === other.front) {
                this.isDone = other.isDone = true;
            }
            return this.isDone;
        }
    };

    const default_options2 = {
        level: 1, // Nivel inicial
        difficulty: 'normal' // Dificultad
    };

    var options = JSON.parse(localStorage.options2 || JSON.stringify(default_options2));
    console.log(options)
    var lastCard;
    var level = parseInt(localStorage.getItem('level')) || options.level;
    var pairs;
    var points = 100;
    var difficulty = options.difficulty;
    var cards = [];
    
    var temps, punts;

    updateLevel()
    function updateLevel(){
       if(level == 1){
        pairs = 2
       }else if(level == 2){
        pairs = 3 
       }else if(level == 3){
        pairs = 4
       }else if(level == 4){
        pairs = 5
       }else if(level >= 5){
        pairs = 6
       }
    }

   
    switch (difficulty) {
        case 'easy':
            temps = 2000 - (level - 1) * 200;
            punts = 15;
            break;
        case 'normal':
            temps = 1000 - (level - 1) * 100;
            punts = 25;
            break;
        case 'hard':
            temps = 500 - (level - 1) * 50;
            punts = 50;
            break;
        default:
            temps = 1000;
            punts = 25;
    }
    temps = Math.max(500, temps); // Asegurarse de que el tiempo no es demasiado corto
   
    var mix = function() {
        var items = resources.slice();
        items.sort(() => Math.random() - 0.5);
        items = items.slice(0, pairs);
        items = items.concat(items);
        return items.sort(() => Math.random() - 0.5);
    }

    return {
        init: function(call) {
            if (sessionStorage.save) {
                let partida = JSON.parse(sessionStorage.save);
                pairs = partida.pairs;
                points = partida.points;
                cards = partida.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    it.temps = temps;
                    return it;
                });
                return cards;
            } else {
                console.log(level)
                return mix().map(item => {
                    let newCard = Object.create(card, {
                        front: { value: item },
                        callback: { value: call },
                        temps: { value: temps }
                    });
                    cards.push(newCard);
                    setTimeout(() => {
                        newCard.current = back;
                        newCard.clickable = true;
                        newCard.callback();
                    }, temps);
                    return newCard;
                });
            }
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) {
                if (card.check(lastCard)) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("Has guanyat amb " + points + " punts!");
                        localStorage.setItem('level', level + 1); 
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    }
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    points -= punts;
                    if (points <= 0) {
                        alert("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            } else {
                lastCard = card;
            }
        },
        save: function() {
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
                points: points,
                cards: cards.map(c => ({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                }))
            };
            let json_partida = JSON.stringify(partida);
            fetch("../php/save.php", {
                method: "POST",
                body: json_partida,
                headers: {"content-type":"application/json; charset=UTF-8"}
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err => {
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(() => {
                window.location.replace("../");
            });
        }
    }
}();
