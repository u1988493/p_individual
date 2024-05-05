import { game as gController } from "./memory2.js";

export class PlayScene extends Phaser.Scene{
    constructor (){
        super('PlayScene');
        this.resources = [];
        this.cards = gController.init(()=>null); // Inicialitzar cartes
    }

    preload() {  
        this.cards.forEach((r)=>{
            if (!this.resources.includes(r.front))
                this.resources.push(r.front);
        });
        this.resources.push("../resources/back.png");
        this.resources.forEach((r)=>this.load.image(r,r)); // Primer paràmetre nom Segon paràmetre direcció

    }

    create() {
        this.cameras.main.setBackgroundColor(0xBFFCFF);

        this.g_cards = this.physics.add.staticGroup();
    
        const cardWidth = 100;
        const cardHeight = 100;
        const cardSpacing = 30;
        const cardsPerRow = 4;
        const numRows = Math.ceil(this.cards.length / cardsPerRow);
  
    
        const totalWidth = cardsPerRow * (cardWidth + cardSpacing) - cardSpacing; 
        const totalHeight = numRows * (cardHeight + cardSpacing) - cardSpacing;
  
      
        const startX = (this.cameras.main.width - totalWidth) / 2;
        const startY = (this.cameras.main.height - totalHeight) / 2;
  
        this.cards.forEach((c, i) => {
         
             let x = startX + (i % cardsPerRow) * (cardWidth + cardSpacing);
          
            let y = startY + Math.floor(i / cardsPerRow) * (cardHeight + cardSpacing);
  
            this.g_cards.create(x, y, c.current);
        });

      



        this.g_cards.children.iterate((c, i) => {
            c.setInteractive();
            c.on('pointerup', ()=> gController.click(this.cards[i]));
        });
    }

    update() {
        this.g_cards.children.iterate((c, i) => c.setTexture(this.cards[i].current));
    }
}