enum ShapeType = {circle, square};

interface Shape {
    const static ShapeType SHAPE_TYPE;
    void Draw();
}

class Circle implements Shape {
    const static ShapeType SHAPE_TYPE = ShapeType.circle;
    public Circle(int radius, Point center) {
        this.radius = radius;
        this.center = center;
    }
    public Draw() {
        /* 描く処理 */
    }
    public ShapeType getType() { return SHAPE_TYPE; }
}

class Square implements Shape {
    const static ShapeType SHAPE_TYPE = ShapeType.square;
    public Square(int side, Point topLeft) {
        this.side    = side;
        this.topLeft = topLeft;
    }
    public Draw() {
        /* 描く処理 */
    }
    public ShapeType getType() { return SHAPE_TYPE; }    
}

class DrawingTool {
    public DrawAllShapes(List<Shape> shapeList) {
        for (Shape shape : shapeList) {
            if (shape.getType() == ShapeType.circle) shape.Draw();
        }
        for (Shape shape : shapeList) {
            if (shape.getType() == ShapeType.square) shape.Draw();
        }
    }
}

// NOTE: コンストラクタ継承されないのであれば再定義が必要
class BigCircle extends Circle {}
class BigSquare extends Square {}
