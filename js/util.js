var util = {

    // 生成指定范围内的随机数，包小不包大
    random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    },

    // 生成指定范围内的随机整数，包小包大
    randomInteger(min, max) {
        return Math.floor(this.random(min, max + 1));
    },

    // 复制一个新对象
    copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};