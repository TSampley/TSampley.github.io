
import { UnimplementedError } from  '../../../js/common/errors.mjs'

/**
 * TODO: add type-tags for UI-level logic/selecting renderers
 */
export class Properties {
    clone() {
        throw new UnimplementedError(this,'clone')
    }
    get typeName() {
        throw new UnimplementedError(this,'typeName')
    }
}

export const NullProperties = {
    clone: function () {
        return NullProperties
    }
}
