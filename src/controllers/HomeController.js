const db = require('../../database/database.js');

module.exports = {
    async home(req, res) {
        res.send('하군랩 백엔드 첫 틀 작업입니다. 많은 응원부탁드립니다.');
    },

}