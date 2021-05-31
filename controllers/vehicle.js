import { validate } from 'jsonschema'
import schemas from '../schemas/vehicle'
import response from '../helpers/response'
import vehicleModel from '../models/vehicle'
import auth from '../helpers/auth'
import request from '../helpers/request'

export const vehicleController = {
  create: async (req, res) => {
    const params = request.getParams(req)
    if (params.price === null) delete params.price
    const validation = validate(params, schemas.create())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const user = auth.getUser(req)
    const vehicle = await vehicleModel.create({
      type: params.Type,
      manufacturer: params.Manufacturer,
      modelN: params.ModelName,
      model: params.Model,
      PowerType: params.PowerType,
      configuration: params.Configuration,
      power: params.PowerType,
      price: params.UnitPrice,
      user
    })
    response.responseHandler(res, {
      vehicle: {
        uuid: vehicle.uuid,
        id: vehicle.vehicle_id,
        Type: vehicle.type,
        Manufacturer: vehicle.manufacturer,
        ModelName: vehicle.modelN,
        Model: vehicle.model,
        Configuration: vehicle.configuration,
        PowerType: vehicle.power,
        UnitPrice: vehicle.price
      }
    })
  },

  get: async (req, res) => {
    const params = request.getParams(req)
    const validation = validate(params, schemas.get())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const vehicle = await vehicleModel.get(params.uuid)
    response.responseHandler(res, {
      vehicle: {
        uuid: vehicle.uuid,
        id: vehicle.vehicle_id,
        Type: vehicle.type,
        Manufacturer: vehicle.manufacturer,
        ModelName: vehicle.modelN,
        Model: vehicle.model,
        Configuration: vehicle.configuration,
        PowerType: vehicle.power,
        UnitPrice: vehicle.price,
        created: vehicle.created
      }
    })
  },

  /*
  search: async (req, res) => {
    const params = request.getParams(req)
    const validation = validate(params, schemas.search())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const list = await vehicleModel.search(params.name)
    response.responseHandler(res, {
      list: list.map(vehicle => ({
        uuid: vehicle.uuid,
        id: vehicle.vehicle_id,
        model: vehicle.model,
        configuration: vehicle.configuration,
        price: vehicle.price,
        created: vehicle.created
      }))
    })
  },
  */

  save: async (req, res) => {
    const params = request.getParams(req)
    if (params.price === null) delete params.price
    const validation = validate(params, schemas.save())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const user = auth.getUser(req)
    await vehicleModel.save(params.uuid, {
      type: params.Type,
      manufacturer: params.Manufacturer,
      modelN: params.ModelName,
      model: params.Model,
      configuration: params.Configuration,
      power: params.PowerType,
      price: params.UnitPrice
    }, user)
    const vehicle = await vehicleModel.get(params.uuid)
    response.responseHandler(res, {
      vehicle: {
        uuid: vehicle.uuid,
        id: vehicle.vehicle_id,
        Type: vehicle.type,
        Manufacturer: vehicle.manufacturer,
        ModelName: vehicle.modelN,
        Model: vehicle.model,
        Configuration: vehicle.configuration,
        PowerType: vehicle.power,
        UnitPrice: vehicle.price,
        created: vehicle.created
      }
    })
  },

  list: async (req, res) => {
    const params = request.getParams(req)
    const validation = validate(params, schemas.list())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const list = await vehicleModel.list()
    response.responseHandler(res, {
      list: list.map(vehicle => ({
        uuid: vehicle.uuid,
        id: vehicle.vehicle_id,
        Type: vehicle.type,
        Manufacturer: vehicle.manufacturer,
        ModelName: vehicle.modelN,
        Model: vehicle.model,
        Configuration: vehicle.configuration,
        PowerType: vehicle.power,
        UnitPrice: vehicle.price,
        created: vehicle.created
      }))
    })
  },

  remove: async (req, res) => {
    const params = request.getParams(req)
    const validation = validate(params, schemas.remove())
    if (!validation.valid) {
      return response.validationErrorHandler(res, validation)
    }
    const user = auth.getUser(req)
    await vehicleModel.remove(params.uuid, user)
    response.responseHandler(res, {})
  }
}

export default vehicleController
