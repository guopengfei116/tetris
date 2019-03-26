// 默认坐标，因为对象是引用类型，所以封装成方法可以多次获取
Square.getDefaultOrigin = function() {
    return {
        x: 4,
        y: 0
    };
}

function Square(type = util.randomInteger(0, 7), direction = 0) {
    this.type = type;                                      // 随机生成类型
    this.direction = direction;                            // 方向
    this.origin = Square.getDefaultOrigin();               // 坐标
    
    this.initData();                                       // 数据
    this.initDiv();                                        // div
}

Square.prototype = {

    // 根据类型与方向初始化方块数据
    initData() {
        var squareData = squareShape.factory(this.type, this.direction);     // 获取默认方向的方块数据
        this.data = util.copy(squareData);                                   // 数据深拷贝，防止互相引用
    },

    // 根据数据初始化div
    initDiv: function() {
        this.div = this.data.map((row, i) => {
            return row.map((type, j) => {
                return this.getBlock(type);
            });
        });
    },

    // 左移
    leftMove() {
        this.origin.x -= 1;
    },

    // 右移
    rightMove() {
        this.origin.x += 1;
    },

    // 下移
    downMove() {
        this.origin.y += 1;
    },

    // 旋转方块，如果不指定方向，那么自动累加
    rotate(direction = (++this.direction > 3? 0: this.direction)) {
        this.direction = direction;
        this.initData();
        this.initDiv();
    },

    // 获取指定类型的方块div
    getBlock: function(type) {
        var tempDiv = document.createElement('div');
        var typeToClass = {
            0: 'block-none',
            1: 'block-done',
            2: 'block-next',
            3: 'block-current'
        };
        tempDiv.className = typeToClass[type];
        return tempDiv;
    },

    // 渲染方块
    render: function(container) {
        // 存放div的临时容器
        var tempContainer = document.createElement('div');

        // 把存放div的数组结构替换为DOM结构
        this.div.forEach((rowDivs, i) => {
            var rowContainer = document.createElement('div');

            rowDivs.forEach((div, j) => {
                rowContainer.appendChild(div);
            });

            tempContainer.appendChild(rowContainer);
        }, this);

        // 把div添加到页面容器实现渲染
        container.innerHTML = '';
        container.appendChild(tempContainer);
    }
};
