interface IShape {
    void Draw();
}

class Circle implements IShape {
    public Circle(int radius, Point center) {
        this.radius = radius;
        this.center = center;
    }
    public Draw() {
        /* 描く処理 */
    }
}

class Square implements IShape {
    public Square(int side, Point topLeft) {
        this.side    = side;
        this.topLeft = topLeft;
    }
    public Draw() {
        /* 描く処理 */
    }
}

// NOTE: コンストラクタ継承されないのであれば再定義が必要
class BigCircle extends Circle {}
class BigSquare extends Square {}
