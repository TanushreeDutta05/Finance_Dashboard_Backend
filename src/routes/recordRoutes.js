const express = require('express');
const router = express.Router();
const { createRecord, getRecords, getRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middlewares/auth');
const { roleCheck, checkRecordOwnership } = require('../middlewares/roleCheck');
const { validate, recordValidation } = require('../middlewares/validation');


router.use(protect);

router.route('/')
  .get(roleCheck('analyst', 'admin'), recordValidation.filter, validate, getRecords)
  .post(roleCheck('admin'), recordValidation.create, validate, createRecord);

  
router.route('/:id')
  .get(roleCheck('analyst','admin'), getRecord)
  .put(roleCheck('admin'), checkRecordOwnership, recordValidation.update, validate, updateRecord)
  .delete(roleCheck('admin'), checkRecordOwnership, deleteRecord);


module.exports = router;