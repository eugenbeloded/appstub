import express from 'express'
import asyncHandler from 'express-async-handler'
import vehicleController from '../controllers/vehicle'
import common from '../helpers/common'

const router = express.Router()

router.route('/vehicle/create').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.create))
router.route('/vehicle/get').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.get))
// router.route('/vehicle/search').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.search))
router.route('/vehicle/save').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.save))
router.route('/vehicle/list').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.list))
router.route('/vehicle/remove').post(asyncHandler(common.checkUserAdminMiddleware), asyncHandler(vehicleController.remove))

export default router
