function Game() {
    this.gameContainer = document.querySelector('.game');
    this.nextContainer = document.querySelector('.aside_next');
    this.timeNode = document.querySelector('.aside_info_time');
    this.scoreNode = document.querySelector('.aside_info_score');
    this.startTime = Date.now();
    this.score = 0;
    this.init();
}

Game.prototype = {

    /**
     * 1、创建currentSquare、nextSquare与gameView对象
     * 2、渲染游戏画面
     * 3、监听键盘事件
     * */
    init: function() {
        this.nextSquare = new Square();
        this.currentSquare = new Square();
        this.gameView = new Square('game', 0);

        this.render();
        this.bindEvent();

        this.start();
    },

    // 把'当前方块'的div并入到'游戏界面'中
    mergeDiv() {
        this.currentSquare.div.forEach((row, i) => {
            row.forEach((item, j) => {
                // 有数据的div才进行并入
                if(this.currentSquare.data[i][j]) {
                    this.gameView.div[this.currentSquare.origin.y + i][this.currentSquare.origin.x + j] = item;
                }
            });
        });
    },

    // 把'当前方块'的数据并入到'游戏界面'中
    mergeData() {
        this.currentSquare.data.forEach((row, i) => {
            row.forEach((item, j) => {
                // 有数据的div才进行并入
                if(this.currentSquare.data[i][j]) {
                    this.gameView.data[this.currentSquare.origin.y + i][this.currentSquare.origin.x + j] = 1;
                }
            });
        });
    },

    // 消行
    clear() {
        var clearTotal = 0;

        var data = this.gameView.data;
        bottomrow: for(var i = data.length - 1; i >= 0; i--) {
            for(var j = 0, jlen = data[i].length; j < jlen; j++) {
                if(data[i][j] != 1) {
                    continue bottomrow;
                }
            }
            data.splice(i, 1);
            data.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            i++; // 消除一行，重新从底行遍历
            clearTotal++;
        }

        return clearTotal;
    },

    // 替换下一个方块，并尝试消行
    performNext() {
        this.mergeData();
        var clearTotal = this.clear();
        this.upScore(clearTotal);
        this.currentSquare = this.nextSquare;
        this.nextSquare = new Square();
        this.render();
    },

    // 视图渲染
    render: function() {
        // 重新初始化div，为了清除上一次与curretnSquare的合并
        this.gameView.initDiv();
        this.mergeDiv();

        // 渲染'游戏界面'与'预览界面'
        this.nextSquare.render(this.nextContainer);
        this.gameView.render(this.gameContainer);
    },

    keydownHandler(e) {
        // 备份origin数据
        var saveOrigin = util.copy(this.currentSquare.origin);
        var saveDirection = this.currentSquare.direction;
        
        // 根据方向位移
        var keycode = e.keyCode;
        switch (keycode) {
            case 37:
                this.currentSquare.leftMove();
                break;
            case 38:
                this.currentSquare.rotate();  // 旋转会影响data与div
                break;
            case 39:
                this.currentSquare.rightMove();
                break;
            case 40:
                this.currentSquare.downMove();
                break;
            case 32:
                this.currentSquare.downMove();
                break;
        }

        // 判断位移后的有效性，有效则渲染，无效则恢复数据
        if(collide.isValid(this.currentSquare, this.gameView, keycode)) {
            this.render();
            keycode == 32 && this.keydownHandler(e);  // 如果是空格32，则下降到底
            return true;
        }else {
            this.currentSquare.origin = saveOrigin;   
            this.currentSquare.rotate(saveDirection); // 恢复旋转前的data与div
            return false;
        }
    },

    // 事件绑定
    bindEvent: function() {
        var _this = this;
        document.addEventListener('keydown', function(e) {
            _this.keydownHandler(e);
        });
    },

    // 更新时间
    upTime() {
        var radutionTime = Date.now() - this.startTime;
        var hour = Math.floor(radutionTime / (1000 * 60 * 60));
        var minute = Math.floor(radutionTime % (1000 * 60 * 60) / (1000 * 60));
        var second = Math.round(radutionTime % (1000 * 60) / 1000);
        this.timeNode.innerHTML = `${hour}小时${minute}分钟${second}秒`;
    },

    // 更新分数
    upScore(level) {
        if(level > 0) {
            this.score += Math.pow(2, level);
            this.scoreNode.innerHTML = this.score;
        }
    },

    // 重新开始
    restart() {
        if(confirm('重新开始?')) {
            this.start();
        }
    },

    // 结束游戏
    end() {
        clearInterval(this.timer);
    },

    // 开始游戏
    start() {
        this.timer = setInterval(() => {
            if(!this.keydownHandler({keyCode: 40})) {
                // 判断当前方块是否与游戏存在重叠，是则说明游戏无法继续运行
                if(collide.overlap(this.currentSquare, this.gameView)) {
                    this.end();
                    this.restart();
                }
                // 替换方块进行渲染
                else {
                    this.performNext();
                    console.log('替换');
                }
            }

            this.upTime();
        }, 1000);
    }
}