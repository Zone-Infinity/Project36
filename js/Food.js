class Food {
    constructor(food) {
        this.image = loadImage("images/milk.png");
        this.foodStock = food;
    }

    getFoodStock() {
        return this.foodStock;
    }

    updateFoodStock(food) {
        this.foodStock = food;
    }

    display() {
        var x = 80, y = 100;

        imageMode(CENTER);
        //image(this.image, 720, 220, 70, 70);

        if (this.foodStock != 0) {
            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 == 0) {
                    x = 80;
                    y = y + 50;
                }
                image(this.image, x, y, 50, 50);
                x += 30;
            }
        }
    }

    bedroom(){
        background(bedroom);
    }

    garden(){
        background(garden);
    }

    washroom(){
        background(washroom);
    }
}