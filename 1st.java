enum ShapeType = {circle, square};

abstract class Shape {
    void Draw();
    static int getOrder(Shape shape) {
        Map<ShapeType, int> orderTable = new HashMap<ShapeType, int>();
        
        // FIXME: いい感じの場所で定義
        // MAPにデータを格納
        orderTable.put(ShapeType.circle, 1);
        orderTable.put(ShapeType.square, 2);
        // ... 

        return orderTable.get(shape.ShapeType);
    }
}

class Circle extends Shape {
    const static ShapeType SHAPE_TYPE = ShapeType.circle;

    public Circle(int radius, Point center) {
        this.radius = radius;
        this.center = center;
    }
    public Draw() {
        /* 描く処理 */
    }
}

class Square extends Shape {
    const static ShapeType SHAPE_TYPE = ShapeType.square;

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
        shapeList.stream()
            .sorted((a, b) -> b.getOrder() - a.getOrder())
            .forEach(Shpae::Draw);
    }
}

// NOTE: コンストラクタ継承されないのであれば再定義が必要
class BigCircle extends Circle {}
class BigSquare extends Square {}
