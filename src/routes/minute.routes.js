const { verifyToken } = require('../middleware')
const {
    createPreMinute,
    getPreMinute,
    getMinutesList,
    addDialogueElement,
    addNote,
    addTopic,
    updateMinuteData,
    addAnnexe,
    getPreviousCompromises
} =  require('../controllers/minute.controller');

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/minutes",
        [verifyToken],
        createPreMinute
    );

    app.get(
        "/api/minutes/previousCompromises",
        [],
        async function(req, res) {
            const test = await getPreviousCompromises()

            return res.send(test)
        }
    );

    app.get(
        "/api/minutes/:minuteId",
        [verifyToken],
        getPreMinute
    );

    app.get(
        "/api/minutes",
        [verifyToken],
        getMinutesList
    );

    app.put(
        "/api/minutes/:minuteId",
        [verifyToken],
        updateMinuteData
    );

    app.post(
        "/api/minutes/:minuteId/topics",
        [verifyToken],
        addTopic
    );

    app.post(
        "/api/minutes/:minuteId/annexes",
        [verifyToken],
        addAnnexe
    );

    app.post(
        "/api/minutes/:minuteId/topics/:topicId/dialogueElement",
        [verifyToken],
        addDialogueElement
    );

    app.post(
        "/api/minutes/:minuteId/topics/:topicId/note",
        [verifyToken],
        addNote
    );
}