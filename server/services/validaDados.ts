import { validateOrReject } from "class-validator"

export const validar = (obj) => {
    try {
        return validateOrReject(obj, { validationError: { target: false } })
    } catch (error) {
        throw error
    }

}
export const validarComGrupos = (obj, groups: string[]) => {
    try {
        return validateOrReject(obj, {
            validationError: { target: false },
            groups
        })
    } catch (error) {
        throw error
    }

}