'use strict';

module.exports = function(response) {
    if (response && typeof response === 'object' && response.hasOwnProperty('body')) {
        return !(/Забыли пароль\?/g.test(response.body));
    } else {
        return false;
    }
};