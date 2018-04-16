enum ShapeType = {circle, square};

// FIXME: 順番をどこかに集約する仕組みが欲しいので抽象クラスにしてメソッド持たせる方が良い
interface Shape {
    const static ShapeType SHAPE_TYPE;
    void Draw();
    const static int DRAW_ORDER;
}

class Circle implements Shape {
    const static ShapeType SHAPE_TYPE = ShapeType.circle;
    const static int DRAW_ORDER = 1;

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
    const static int DRAW_ORDER = 2;

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
        shapeList.stream()
            .sorted(comparing(Shape::DRAW_ORDER))
            .forEach(Shpae::Draw);
    }
}

// NOTE: コンストラクタ継承されないのであれば再定義が必要
class BigCircle extends Circle {}
class BigSquare extends Square {}
