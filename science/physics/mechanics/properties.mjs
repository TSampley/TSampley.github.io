
import { UnimplementedError } from  '../../../scripts/common/errors.mjs'

/**
 * 
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
