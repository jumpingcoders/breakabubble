"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function _findUrlOnPostOnSelfOfChildren(element) {
    var userIds = [];
    if (element.tagName === 'A') {
        var url = element.getAttribute('href');
        if (typeof url === 'string') {
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                //console.log(url)
                if (!/https?:\/\/(.*)?facebook\.com\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                    userIds.push(url);
                }
            }
        }
    }
    for (var i = 0, l = element.children.length; i < l; i++) {
        var child = element.children[i];
        for (var _i = 0, _a = _findUrlOnPostOnSelfOfChildren(child); _i < _a.length; _i++) {
            var userId = _a[_i];
            userIds.push(userId);
        }
    }
    return userIds.filter(_onlyUnique);
}
function findUrlOnPost(element) {
    var userIds = _findUrlOnPostOnSelfOfChildren(element);
    if (userIds.length === 0) {
        if (element.parentElement) {
            return findUrlOnPost(element.parentElement);
        }
        else {
            //console.log(element);
            //throw new Error('Cant get any user id.');
            return undefined;
        }
    }
    else if (userIds.length === 1) {
        return userIds[0];
    }
    else {
        //return undefined;
        console.warn('Cant get unique user id.', userIds);
        return userIds[0];
        //throw new Error('Cant get unique user id.');
    }
}
exports.default = findUrlOnPost;
//# sourceMappingURL=findUrlOnPost.js.map