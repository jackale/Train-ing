interface Shape {
    void Draw();
}

class Circle implements Shape {
    public Circle(int radius, Point center) {
        this.radius = radius;
        this.center = center;
    }
    public Draw() {
        /* 描く処理 */
    }
}

class Square implements Shape {
    public Square(int side, Point topLeft) {
        this.side    = side;
        this.topLeft = topLeft;
    }
    public Draw() {
        /* 描く処理 */
    }
}

class DrawingTool {
    public DrawAllShapes(List<Shape> shapeList) {
        for (Shape shape : shapeList) {
            shape.Draw();
        }
    }
}

// NOTE: コンストラクタ継承されないのであれば再定義が必要
class BigCircle extends Circle {}
class BigSquare extends Square {}
