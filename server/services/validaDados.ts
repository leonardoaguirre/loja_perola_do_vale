import { validateOrReject } from "class-validator"

export const validar = (obj) => {
    try {
        return validateOrReject(obj, { validationError: { target: false } })
    } catch (error) {
        throw error
    }

}