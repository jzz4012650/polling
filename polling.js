function Polling(url, params) {
    this._interval = 1000; // 两次轮训间隔，默认1000ms
    this._timer    = null; // 两次轮询间隔计时器
    this._request  = null; // 轮询所用的请求对象
    this._url      = url; // 轮询数据的URL
    this._params   = params; // 轮询用的参数

    this._done         = function() {}; // 轮询成功后的回调
    this._fail         = function() {}; // 轮询失败后的回调
    this._always       = function() {}; // 轮询结束后的回调
    this._onReceive    = function() {}; // 轮询拿到中间结果时
    this._judgeDone    = function() {}; // 判断是否轮询可以结束
}

Polling.prototype.interval = function(num) {
    if (!arguments.length) return this._interval;
    this._interval = num;
    return this;
}

Polling.prototype.cancel = function() {
    clearTimeout(this._timer);
    this._request && this._request.abort && this._request.abort();
    return this;
}

Polling.prototype.onReceive = function(fnc) {
    if (arguments.length && typeof fnc === 'function') {
        this._onReceive = fnc;
        return this;
    } else {
        return this._onReceive;
    }
}

Polling.prototype.judgeDone = function(fnc) {
    if (arguments.length && typeof fnc === 'function') {
        this._judgeDone = fnc;
        return this;
    } else {
        return this._judgeDone;
    }
}

Polling.prototype.done = function(fnc) {
    if (arguments.length && typeof fnc === 'function') {
        this._done = fnc;
        return this;
    } else {
        return this._done;
    }
}

Polling.prototype.fail = function() {
    if (arguments.length && typeof fnc === 'function') {
        this._fail = fnc;
        return this;
    } else {
        return this._fail;
    }
}

Polling.prototype.always = function() {
    if (arguments.length && typeof fnc === 'function') {
        this._always = fnc;
        return this;
    } else {
        return this._always;
    }
}

Polling.prototype.start = function() {
    var _this = this;

    this._request = $.getJSON(this._url, this._params);
    this._request.done(function(res) {
        if (_this._judgeDone(res)) {
            _this._done(res);
            _this._always(res);
        } else {
            _this._onReceive(res);
            _this._timer = setTimeout(function() {
                _this.start();
            }, _this._interval);
        }
    });
    this._request.fail(function(res) {
        _this._fail(res);
        _this._always(res);
    });
}

module.exports = function(url, params) {
    return new Polling(url, params);
}
