const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, createUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { roleCheck } = require('../middlewares/roleCheck');
const { validate, userValidation } = require('../middlewares/validation');


router.use(protect);
router.use(roleCheck('admin'));

router.route('/')
    .get(getUsers)
    .post(userValidation.register, validate, createUser);

    
router.route('/:id')
    .get(getUser)
    .put(userValidation.update, validate, updateUser)
    .delete(deleteUser);


module.exports = router;