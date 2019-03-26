var collide = {

    // 点是否在左边的安全范围
    pointInLeftValid(x, y, view) {
        return x >= 0;
    },

    // 点是否在右边的安全范围
    pointInRightValid(x, y, view) {
        return x <= (view.data[0].length - 1);
    },

    // 点是否在下边的安全范围
    pointInBottomValid(x, y, view) {
        return y <= (view.data.length - 1);
    },

    // 点在游戏界面中是否是唯一的，游戏视图中的二维数组第一层是y轴，第二层是x轴
    pointIsOnly(x, y, view) {
        return view.data[y][x] !== 1; // 只要值不是1，那就是唯一的
    },

    // 根据keycode采取不同的碰撞判断算法
    pointIsValid(x, y, view, keycode) {
        switch (keycode) {
            case 37:
                return this.pointInLeftValid(x, y, view); 
                break;
            case 38: 
                return this.pointInLeftValid(x, y, view) 
                    && this.pointInRightValid(x, y, view) 
                    && this.pointInBottomValid(x, y, view);
                break;
            case 39:
                return this.pointInRightValid(x, y, view);  
                break;
            case 40:
                return this.pointInBottomValid(x, y, view);  
                break;
            case 32:
                return this.pointInBottomValid(x, y, view);  
                break;
        }
    },

    // 判断方块边缘的有效性，方块不能超出游戏界面的视角，至少保留1条边
    squareIsValid(square, view, keycode) {
        switch (keycode) {
            case 37:
                // 拿方块最右边点的x坐标来判断
                return this.pointInLeftValid(square.origin.x + (square.data[0].length - 1), square.origin.y, view); 
                break;
            case 38:
                // 旋转的话，三个边都做判断
                return this.pointInLeftValid(square.origin.x + (square.data[0].length - 1), square.origin.y, view) 
                    && this.pointInRightValid(square.origin.x, square.origin.y, view)
                    && this.pointInBottomValid(square.origin.x, square.origin.y, view);
                break;
            case 39:
                // 拿方块最左边点的x坐标来判断
                return this.pointInRightValid(square.origin.x, square.origin.y, view); 
                break;
            case 40:
                // 拿方块最上边点的y坐标来判断
                return this.pointInBottomValid(square.origin.x, square.origin.y, view); 
                break;
            case 32:
                // 拿方块最上边点的y坐标来判断
                return this.pointInBottomValid(square.origin.x, square.origin.y, view); 
                break;
        }
    },

    /**
     * 检测方块的有效性
     * 
     * @param { square: Square } 被检测的方块
     * @param { vie: Square } 游戏容器
     * @param { keycode: Number } 键值
     * @return Boolean
     * */
    isValid(square, view, keycode) {
        // 先检测方块的边缘有没有超出游戏边界，属于算法优化
        if(!this.squareIsValid(square, view, keycode)) {
            return false;
        }

        // 内层遍历j为x偏移，外层遍历i为y偏移,
        var data = square.data;
        for(var i = 0, len = data.length; i < len; i++) {
            for(var j = 0, jlen = data[i].length; j < jlen; j++) {
                // 数据存在，检测每个点有没有超出游戏边界，或者是否与游戏视图发生重叠，满足其一则返回false
                if(data[i][j] 
                    && (!this.pointIsValid(square.origin.x + j, square.origin.y + i, view, keycode)
                        || !this.pointIsOnly(square.origin.x + j, square.origin.y + i, view))) {
                    return false;
                }
            }
        }

        // 通过检测
        return true;
    },

    // 检测是否重叠
    overlap(square, view) {
        var data = square.data;
        for(var i = 0, len = data.length; i < len; i++) {
            for(var j = 0, jlen = data[i].length; j < jlen; j++) {
                if(data[i][j] && !this.pointIsOnly(square.origin.x + j, square.origin.y + i, view)) {
                    return true;
                }
            }
        }
    }
};
