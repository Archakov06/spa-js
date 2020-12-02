
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
'use strict';

var SPA = /** @class */ (function () {
    function SPA(options) {
        this.root = document.querySelector(options.root);
        if (!this.root) {
            throw Error('Root element not found');
        }
        this.state = options.state;
        this.app = options.app;
        this.render();
    }
    SPA.prototype.createElement = function (_a) {
        var _this = this;
        var tagName = _a.tagName, props = _a.props, children = _a.children;
        if (!this.root) {
            throw Error('Root element not found');
        }
        var elem = document.createElement(tagName);
        if (props) {
            for (var key in props) {
                var value = props[key];
                if (props.hasOwnProperty(key) && typeof value === 'string') {
                    elem.setAttribute(key, value);
                }
                else if (typeof value === 'function') {
                    elem.addEventListener(key, value);
                }
            }
        }
        var appendChild = function (value) {
            if (value instanceof HTMLElement) {
                elem.appendChild(value);
            }
            if (typeof value === 'string') {
                var text = value;
                text = text.replace(/{(.+?)}/gi, function (match) {
                    var key = match.replace(/\{|\}|\s/g, '');
                    return _this.state && Object.prototype.hasOwnProperty.call(_this.state, key)
                        ? _this.state[key]
                        : match;
                });
                elem.innerText = text;
            }
        };
        var appendStringOrElement = function (child) {
            if (typeof child === 'string') {
                appendChild(child);
            }
            else {
                appendChild(_this.createElement(child));
            }
        };
        if (children) {
            if (Array.isArray(children)) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    appendStringOrElement(child);
                }
            }
            else {
                appendStringOrElement(children);
            }
        }
        return elem;
    };
    SPA.prototype.update = function (callback) {
        if (this.state &&
            this.state instanceof Object &&
            callback &&
            callback instanceof Function &&
            this.root) {
            var newState = callback(this.state);
            this.state = Object.assign(this.state, newState);
            this.render();
        }
    };
    SPA.prototype.render = function () {
        if (this.root) {
            var htmlElem = this.createElement(this.app);
            this.root.innerHTML = '';
            this.root.appendChild(htmlElem);
        }
        else {
            throw Error('Root element not found');
        }
    };
    return SPA;
}());

var app = {
    tagName: 'div',
    children: [
        { tagName: 'h2', children: 'Счетчик' },
        { tagName: 'h2', children: '{count}' },
        {
            tagName: 'button',
            props: {
                click: function () {
                    spa.update(function (prev) { return ({
                        count: prev.count + 1,
                    }); });
                },
            },
            children: 'Increment'
        },
    ]
};
var spa = new SPA({
    root: '#app',
    state: {
        count: 0,
    },
    app: app
});
