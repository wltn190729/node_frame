const db = require('../../database/database.js');

module.exports = {
    async getAll(req, res) {
        const [result, field] = await db.query(`SELECT * FROM BOARD`);

        return res.status(200).json(result);
    },

    async createOne(req, res) {
        const key = req.body.hasOwnProperty('key') ? req.body.key : '';
        const type = req.body.hasOwnProperty('type') ? req.body.type : '';
        const title = req.body.hasOwnProperty('title') ? req.body.title : '';
        const lv = req.body.hasOwnProperty('lv') ? req.body.lv : 0;
        const read_lv = req.body.hasOwnProperty('read_lv') ? req.body.read_lv : 0;
        const write_lv = req.body.hasOwnProperty('write_lv') ? req.body.write_lv : 0;
        const reply_lv = req.body.hasOwnProperty('reply_lv') ? req.body.reply_lv : 0;
        const comment_lv = req.body.hasOwnProperty('comment_lv') ? req.body.comment_lv : 0;
        const use_anonymous = req.body.hasOwnProperty('use_anonymous') ? req.body.use_anonymous : '';
        const use_reply = req.body.hasOwnProperty('use_reply') ? req.body.use_reply : '';
        const use_comment = req.body.hasOwnProperty('use_comment') ? req.body.use_comment : '';
        const keywords = req.body.hasOwnProperty('keywords') ? req.body.keywords : 10;
        const page_rows = req.body.hasOwnProperty('page_rows') ? req.body.page_rows : 10;
        const description = req.body.hasOwnProperty('description') ? req.body.description : '';

        if (key === '' || key === undefined) {
            return res.status(400).json({result: false, message: '게시판 키 값을 입력해주시길 바랍니다.'});
        }

        const [selectResult, field1] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);

        if (selectResult[0] !== undefined) {
            return res.status(400).json({result: false, message: '중복된 게시판 키 값 입니다.'});
        }

        let insertSQL = `INSERT INTO BOARD 
                            (brd_key, brd_type, brd_title, brd_lv, brd_lv_read, brd_lv_write, brd_lv_reply, brd_lv_comment, brd_use_anonymous, 
                            brd_use_replay, brd_use_comment, brd_keywords, brd_page_rows ,brd_description, brd_reg_dt) 
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const bindList = [key, type, title, lv, read_lv, write_lv, reply_lv, comment_lv, use_anonymous, use_reply, use_comment, keywords ,page_rows, description, getDate()];

        try {
            const [insertResult, field2] = await db.query(insertSQL, bindList)
            return res.status(200).json(insertResult);
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async updateOne(req, res) {
        const key = req.params.key ? req.params.key : '';
        const type = req.body.hasOwnProperty('type') ? req.body.type : null;
        const title = req.body.hasOwnProperty('title') ? req.body.title : null;
        const lv = req.body.hasOwnProperty('lv') ? req.body.lv : null;
        const read_lv = req.body.hasOwnProperty('read_lv') ? req.body.read_lv : null;
        const write_lv = req.body.hasOwnProperty('write_lv') ? req.body.write_lv : null;
        const reply_lv = req.body.hasOwnProperty('reply_lv') ? req.body.reply_lv : null;
        const comment_lv = req.body.hasOwnProperty('comment_lv') ? req.body.comment_lv : null;
        const use_anonymous = req.body.hasOwnProperty('use_anonymous') ? req.body.use_anonymous : null;
        const use_reply = req.body.hasOwnProperty('use_reply') ? req.body.use_reply : null;
        const use_comment = req.body.hasOwnProperty('use_comment') ? req.body.use_comment : null;
        const keywords = req.body.hasOwnProperty('keywords') ? req.body.keywords : null;
        const page_rows = req.body.hasOwnProperty('page_rows') ? req.body.page_rows : null;
        const description = req.body.hasOwnProperty('description') ? req.body.description : null;

        let sqlOpt = [];

        if (type) sqlOpt.push(`brd_type='${type}'`)
        if (title) sqlOpt.push(`brd_title='${title}'`)
        if (lv) sqlOpt.push(`brd_lv='${lv}'`)
        if (read_lv) sqlOpt.push(`brd_lv_read='${read_lv}'`)
        if (write_lv) sqlOpt.push(`brd_lv_write='${write_lv}'`)
        if (reply_lv) sqlOpt.push(`brd_lv_reply='${reply_lv}'`)
        if (comment_lv) sqlOpt.push(`brd_lv_comment='${comment_lv}'`)
        if (use_anonymous) sqlOpt.push(`brd_use_anonymous='${use_anonymous}'`)
        if (use_reply) sqlOpt.push(`brd_use_replay='${use_reply}'`)
        if (use_comment) sqlOpt.push(`brd_use_comment='${use_comment}'`)
        if (keywords) sqlOpt.push(`brd_keywords='${keywords}'`)
        if (page_rows) sqlOpt.push(`page_rows='${page_rows}'`)
        if (description) sqlOpt.push(`brd_description='${description}'`)
        sqlOpt.push(`brd_upd_dt='${getDate()}'`)

        let sql = `UPDATE BOARD SET `
        sql += sqlOpt.join(",");
        sql += ` WHERE brd_key='${key}'`;

        try {
            await db.query(sql)
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async deleteOne(req, res) {
        const key = req.params.key ? req.params.key : '';

        if (key === '' || key === undefined) {
            return res.status(400).json({result: false, message: '게시판 키 값을 입력해주시길 바랍니다.'});
        }

        try {
            await db.query(`DELETE FROM BOARD WHERE brd_key='${key}'`)
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async getPosts(req, res) {
        const key = req.params.key ? req.params.key : '';

        if (key === '' || key === undefined) {
            return res.status(400).json({result: false, message: '게시판 키 값을 입력해주시길 바랍니다.'});
        }

        try {
            const [result, resultField] = await db.query(`SELECT * FROM BOARD_POST WHERE brd_key='${key}'`);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async createPost(req, res){
        const key = req.params.key ? req.params.key : '';
        const parent = req.body.hasOwnProperty('parent') ? req.body.parent : 0;
        const title = req.body.hasOwnProperty('title') ? req.body.title : '';
        const thumb = req.body.hasOwnProperty('thumb') ? req.body.thumb : '';
        const content = req.body.hasOwnProperty('content') ? req.body.content : '';
        const nickname = req.body.hasOwnProperty('nickname') ? req.body.nickname : '';
        const keyword = req.body.hasOwnProperty('keyword') ? req.body.keyword : '';
        const notice = req.body.hasOwnProperty('notice') ? req.body.notice : 'N';
        const regUser = req.body.hasOwnProperty('regUser') ? req.body.regUser : '';

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);

        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        //부모 글이 들어왔을 떄
        if (parent) {
            const [parentResult, parentResultField] = await db.query(`SELECT post_parent FROM BOARD_POST WHERE post_parent='${parent}'`);

            // 실제로 부모 글이 없을 때
            if (parentResult[0] === undefined) {
                return res.status(400).json({result: false, message: '존재하지 않는 부모 글 입니다.'});
            }
        }

        let [postNum, postNumField] = await db.query(`SELECT post_num FROM BOARD_POST WHERE brd_key='${key}' ORDER BY post_num DESC`);

        postNum = postNum[0].post_num ? postNum[0].post_num + 1 :  1;

        let insertPostSQL = `INSERT INTO BOARD_POST 
                                (brd_key, post_num, post_parent, post_title, post_thumb, post_content,
                                 post_nickname, post_keyword, post_notice, post_reg_user, post_reg_dt) 
                                VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        try {
            await db.query(insertPostSQL, [key, postNum, parent, title, thumb, content, nickname, keyword, notice, regUser, getDate()]);
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            console.log(e);
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async updatePostOne (req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';
        const parent = req.body.hasOwnProperty('parent') ? req.body.parent : 0;
        const title = req.body.hasOwnProperty('title') ? req.body.title : '';
        const thumb = req.body.hasOwnProperty('thumb') ? req.body.thumb : '';
        const content = req.body.hasOwnProperty('content') ? req.body.content : '';
        const nickname = req.body.hasOwnProperty('nickname') ? req.body.nickname : '';
        const keyword = req.body.hasOwnProperty('keyword') ? req.body.keyword : '';
        const notice = req.body.hasOwnProperty('notice') ? req.body.notice : 'N';
        const regUser = req.body.hasOwnProperty('regUser') ? req.body.regUser : '';

        let sqlOpt = [];

        if (key) {
            const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
            //게시판 키 값이 없을 때
            if (KeyResult[0] === undefined) {
                return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
            }

            sqlOpt.push(`brd_key='${key}'`)
        }
        if (parent) sqlOpt.push(`post_parent='${parent}'`)
        if (title) sqlOpt.push(`post_title='${title}'`)
        if (thumb) sqlOpt.push(`post_thumb='${thumb}'`)
        if (content) sqlOpt.push(`post_content='${content}'`)
        if (nickname) sqlOpt.push(`post_nickname='${nickname}'`)
        if (keyword) sqlOpt.push(`post_keyword='${keyword}'`)
        if (notice) sqlOpt.push(`post_notice='${notice}'`)
        if (regUser) sqlOpt.push(`post_reg_user='${regUser}'`)
        sqlOpt.push(`post_upd_dt='${getDate()}'`)

        let sql = `UPDATE BOARD_POST SET `
        sql += sqlOpt.join(",");
        sql += ` WHERE post_idx='${id}'`;

        try {
            await db.query(sql)
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async deletePostOne (req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        try {
            await db.query(`DELETE FROM BOARD_POST WHERE post_idx='${id}'`);
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async createCommentOne (req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';
        const nickname = req.body.hasOwnProperty('nickname') ? req.body.nickname : '';
        const password = req.body.hasOwnProperty('password') ? req.body.password : '';
        const content = req.body.hasOwnProperty('content') ? req.body.content : '';
        const inquiry = req.body.hasOwnProperty('inquiry') ? req.body.inquiry : -1;
        const depth = req.body.hasOwnProperty('depth') ? req.body.depth : 0;
        const reg_user = req.body.hasOwnProperty('reg_user') ? req.body.reg_user : 0;

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        const [IdResult, IdField] = await db.query(`SELECT post_idx FROM BOARD_POST WHERE post_idx='${id}'`);
        //게시글 아이디 값이 없을 때
        if (IdResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 게시글 키 값 입니다.'});
        }

        let insertSQL = `INSERT INTO BOARD_COMMENT 
                            (post_idx, com_inquiry_pt, com_depth, com_nickname, com_password,
                            com_content, com_status, com_reg_user, com_reg_dt, com_ip) 
                         VALUES (?,?,?,?,?,?,?,?,?,?)`;

        let bindList = [id, inquiry, depth, nickname, password, content, 'Y', reg_user, getDate(), 0];

        try {
            await db.query(insertSQL, bindList);
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            console.log(e);
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }
    },

    async updateCommentOne (req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';
        const cid = req.params.cid ? req.params.cid : '';
        const nickname = req.body.hasOwnProperty('nickname') ? req.body.nickname : '';
        const content = req.body.hasOwnProperty('content') ? req.body.content : '';

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        const [IdResult, IdField] = await db.query(`SELECT post_idx FROM BOARD_POST WHERE post_idx='${id}'`);
        //게시글 아이디 값이 없을 때
        if (IdResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 게시글 값 입니다.'});
        }

        let sqlOpt = [];

        if (nickname) sqlOpt.push(`com_nickname='${nickname}'`)
        if (content) sqlOpt.push(`com_content='${content}'`)
        sqlOpt.push(`com_upd_dt='${getDate()}'`)

        let sql = `UPDATE BOARD_COMMENT SET `
        sql += sqlOpt.join(",");
        sql += ` WHERE com_idx='${cid}'`;

        try {
            await db.query(sql)
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    },

    async deleteCommentOne (req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';
        const cid = req.params.cid ? req.params.cid : '';

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        const [IdResult, IdField] = await db.query(`SELECT post_idx FROM BOARD_POST WHERE post_idx='${id}'`);
        //게시글 아이디 값이 없을 때
        if (IdResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 게시글 값 입니다.'});
        }

        const [cidResult, cidField] = await db.query(`SELECT com_idx FROM BOARD_COMMENT WHERE com_idx='${cid}'`);
        //게시글 아이디 값이 없을 때
        if (cidResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 댓글 값 입니다.'});
        }

        try {
            await db.query(`DELETE FROM BOARD_COMMENT WHERE com_idx='${cid}'`)
            return res.status(200).json({result: true, message: "success"});
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }


    },

    async getComments(req, res) {
        const key = req.params.key ? req.params.key : '';
        const id = req.params.id ? req.params.id : '';

        const [KeyResult, boardField] = await db.query(`SELECT brd_key FROM BOARD WHERE brd_key='${key}'`);
        //게시판 키 값이 없을 때
        if (KeyResult[0] === undefined) {
            return res.status(400).json({result: false, message: '존재하지 않는 키 값 입니다.'});
        }

        let selectSQL = `SELECT * FROM BOARD_COMMENT 
                            WHERE post_idx='${id}' 
                            ORDER BY com_depth, com_reg_dt`;

        try {
            [result, resultField] = await db.query(selectSQL)
            return res.status(200).json(result);
        } catch (e) {
            return res.status(401).json({result: false, message: '데이터베이스 오류입니다.'});
        }

    }

}

function getDate() {
    const date = new Date();
    return date.dateFormat('yyyy-MM-dd HH:mm:ss');
}