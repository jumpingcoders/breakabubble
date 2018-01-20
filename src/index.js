"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var findUrlOnPost_1 = require("./findUrlOnPost");
var superagent = require("superagent");
var profileLink = document.body.querySelectorAll('a[title="Profile"],a[title="Profil"]')[0];
var userId = ((profileLink.getAttribute('href') || '').split('/').pop());
browser.runtime.sendMessage({ "userId": userId });
//const elementsCache: {element: HTMLElement; reaction: number}[] = [];
var REACTIONS = {
    0: 'IGNORE',
    1: 'LIKE',
    2: 'LOVE',
    4: 'HAHA',
    3: 'WOW',
    7: 'SAD',
    8: 'ANGRY',
};
var SCROLL_CUTOFF = 50;
var scrollWatch = [];
function scrollWatchTick() {
    var newSrollWatch = [];
    for (var _i = 0, scrollWatch_1 = scrollWatch; _i < scrollWatch_1.length; _i++) {
        var element = scrollWatch_1[_i];
        if (element.getBoundingClientRect().top < SCROLL_CUTOFF) {
            if (element.getAttribute('aria-pressed') === 'false') {
                var clickListener_1 = createClickListener(0);
                lastHoveredUrl = findUrlOnPost_1.default(element);
                clickListener_1({ target: element });
            }
        }
        else {
            newSrollWatch.push(element);
        }
    }
    scrollWatch = newSrollWatch;
}
setInterval(function () { return scrollWatchTick(); }, 100);
function superHey() {
    {
        var list = document.body.querySelectorAll('div[data-reaction]');
        for (var i = list.length - 1; i >= 0; i--) {
            var buttonElement = list[i];
            /*elementsCache.push({
                element: buttonElement,
                reaction: buttonElement.getAttribute('data-reaction')

            });*/
            //buttonElement.style.border = '1px solid red';
            //buttonElement.setAttribute('data-my',buttonElement.getAttribute('data-reaction'));
            var clickListener_2 = createClickListener(parseInt(buttonElement.getAttribute('data-reaction')));
            buttonElement.removeEventListener('click', clickListener_2, false);
            buttonElement.addEventListener('click', clickListener_2, false);
        }
    }
    {
        scrollWatch = [];
        var list = document.body.querySelectorAll('a.UFILikeLink');
        for (var i = list.length - 1; i >= 0; i--) {
            var buttonElement = list[i];
            buttonElement.removeEventListener('mouseenter', hoverListener, false);
            buttonElement.addEventListener('mouseenter', hoverListener, false);
            //todo aria-pressed
            var clickListener_3 = createClickListener(1);
            buttonElement.removeEventListener('click', clickListener_3, false);
            buttonElement.addEventListener('click', clickListener_3, false);
            if (buttonElement.getBoundingClientRect().top >= SCROLL_CUTOFF) {
                scrollWatch.push(buttonElement);
            }
        }
    }
}
var lastHoveredUrl;
function hoverListener(event) {
    var element = event.target;
    lastHoveredUrl = findUrlOnPost_1.default(element);
}
var clickListenersCache = {};
function createClickListener(reaction) {
    return clickListenersCache[reaction] = clickListenersCache[reaction] || clickListener.bind(null, reaction);
}
function clickListener(reactionId, event) {
    return __awaiter(this, void 0, void 0, function () {
        var reaction, url;
        return __generator(this, function (_a) {
            if (typeof lastHoveredUrl !== 'undefined') {
                reaction = REACTIONS[reactionId];
                url = lastHoveredUrl;
                console.log("Reaction " + reaction + " on page \"" + url + "\".");
                superagent
                    .post("https://socialex-api.herokuapp.com/api/users/" + userId + "/reactions")
                    .send({ reaction: reaction, url: url })
                    .set('accept', 'json')
                    .end(function (err, res) {
                    console.log("Server is saying: \"" + res.body.message + "\".");
                    //console.log(err,res);
                });
            }
            return [2 /*return*/];
        });
    });
}
setInterval(function () {
    superHey();
}, 500);
//# sourceMappingURL=index.js.map