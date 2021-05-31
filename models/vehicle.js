import mongoose from 'mongoose'
import uuidv1 from 'uuid/v1'
import logModel from './log'
import constants from '../helpers/constants'
// import common from "../helpers/common";

const autoIncrement = require('mongoose-sequence')(mongoose)

const vehicleSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv1 },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  modelN: { type: String, required: true },
  model: { type: String, default: '' },
  configuration: { type: String, default: '' },
  power: { type: String, default: '' },
  price: { type: Number },
  isRemoved: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
})

vehicleSchema.index({ uuid: 1 }, { name: 'uuidIndex', unique: true })
vehicleSchema.plugin(autoIncrement, { inc_field: 'vehicle_id' })
const vehicleModelMongo = mongoose.model('vehicle', vehicleSchema)

export const vehicleModel = {
  create: async ({ type, manufacturer, modelN, model, configuration, power, price, user }) => {
    const vehicle = await vehicleModelMongo.create({
      type,
      manufacturer,
      modelN,
      model,
      configuration,
      power,
      price
    })
    await vehicle.save()
    await logModel.doInsert(constants.dbVehicle, vehicle._id, user)
    const obj = vehicle.toObject()
    return obj
  },

  get: async uuid => {
    const filter = { uuid, isRemoved: false }
    const vehicle = await vehicleModelMongo.findOne(filter)
    if (!vehicle) {
      return {}
    } else {
      return vehicle.toObject()
    }
  },

  /*
  search: async (name) => {
    const filter = { name: { $regex: new RegExp('^' + common.addSlashes(name.toLowerCase()), 'i') }, isRemoved: false }
    const list = await vehicleModelMongo.find(filter).sort({ name: 1 })
    return list
  },
  */

  save: async (uuid, { type, manufacturer, modelN, model = '', configuration = '', power = '', price }, user) => {
    const vehicle = await vehicleModelMongo.findOne({ uuid, isRemoved: false })
    if (vehicle) {
      vehicle.type = type
      vehicle.manufacturer = manufacturer
      vehicle.modelN = modelN
      vehicle.model = model
      vehicle.configuration = configuration
      vehicle.power = power
      vehicle.price = price
      await vehicle.save()
      await logModel.doUpdate(constants.dbVehicle, vehicle._id, user)
    }
    return true
  },

  list: async () => {
    const filter = { isRemoved: false }
    const list = await vehicleModelMongo.find(filter).sort({ created: -1 })
    return list
  },

  remove: async (uuid, user) => {
    const item = await vehicleModelMongo.findOne({ uuid, isRemoved: false })
    if (item) {
      item.isRemoved = true
      await item.save()
      await logModel.doDelete(constants.dbVehicle, item._id, user)
    }
    return true
  }
}

export default vehicleModel
