
import { UnimplementedError } from  '../../../scripts/common/errors.mjs'

/**
 * TODO: add type-tags for UI-level logic/selecting renderers
 */
export class Properties {
    clone() {
        throw new UnimplementedError(this,'clone')
    }
}

export const NullProperties = {
    clone: function () {
        return NullProperties
    }
}
