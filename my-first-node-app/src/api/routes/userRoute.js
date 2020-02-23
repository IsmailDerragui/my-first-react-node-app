const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

module.exports = (app) => {
    app.route('/users')
    .post(userController.user_create)
    .get(userController.user_get_all);

    app.route('/login')
    .post(userController.user_login);

    app.route('/users/:user_id')
    .delete(jwtMiddleware.verify_token, userController.user_delete_by_id)
    .put(jwtMiddleware.verify_token, userController.update_a_user)
    .get(jwtMiddleware.verify_token, userController.get_a_user);
};