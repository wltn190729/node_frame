const db = require('../../database/database.js');
const config = require("../../config/config.js");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
    return jwt.sign({id}, config.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}

const generateRefreshToken = (id) => {
    return jwt.sign({id}, config.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days"
    })
}

const responseToken = async (id) => {
    let newRefreshToken = generateRefreshToken(id);
    let newAccessToken = generateAccessToken(id);

    return {newAccessToken, newRefreshToken}
}


module.exports = {
    async signIn(req, res) {
        const email = req.body.hasOwnProperty('loginId') ? req.body.loginId : '';
        const Password = req.body.hasOwnProperty('loginPassword') ? req.body.loginPassword : '';

        if (!email || !Password) {
            return res.status(500).json({result: false, message: '아이디 혹은 비밀번호를 입력해주시길 바랍니다.'});
        }

        const [result, resultField] = await db.query(`SELECT * FROM USER WHERE user_email='${email}'`);

        //로그인 검증 필

        return await responseToken(result[0]).then((json) => {
            return res.status(200).json(json);
        });
    },

    async authenticateAccessToken (req, res, next) {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).json({result: false, message: '빈 토큰입니다.'});
        }

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(400).json({result: false, message: '올바르지 않은 토큰입니다.'});
            }
            req.user = user;
            next();
        });
    },

    async accessTokenRefresh (req, res) {
        const refreshToken = req.body.hasOwnProperty('refreshToken') ? req.body.refreshToken : '';

        if (!refreshToken) {
            return res.status(400).json({result: false, message: '빈 토큰입니다.'});
        }

        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(400).json({result: false, message: '올바르지 않은 토큰입니다.'});
            }

            const accessToken = generateAccessToken(user.id);

            res.json({ accessToken });

        });
    }
}