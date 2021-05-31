import express from 'express'

/** API routes */

import vehicle from './routes/vehicle'

const apiRoutes = [
  vehicle,

]

const fileUpload = require('express-fileupload')

const app = express()
app.use(fileUpload())
app.use('/api', apiRoutes)

export default app
