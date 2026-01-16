
/**
 * Container object for an array of errors. Provides
 * utility functions to check if the result
 * represents success or failure.
 */
export class ValidationResult {
  constructor() {
    this.errors = []
  }

  get isSuccess() {
    return this.errors.length == 0
  }

  get isFailure() {
    return this.errors.length > 0
  }
}

/**
 * This validator checks JSON objects against the JSON-schema
 * format: 
 */
export class JsonSchemaValidator {
  constructor() {
  }

  /**
   * 
   * @param {object} schema The schema loaded as a JS object.
   * @returns {ValidationResult}
   */
  validate(schema) {
    const result = new ValidationResult()
    // Check schema version
    const version = schema.$schema
    if (!version) {
      result.errors.push('No $schema')
    }

    // Check id
    const rootId = schema.$id
    if (!rootId) {
      result.errors.push('No $id')
    }
    
    // Ensure all required properties are present
    const properties = schema.properties
    const required = schema.required || []
    for (const requirement of required) {
      if (!properties[requirement]) {
        result.errors.push(`Missing required property: '${requirement}`)
      }
    }

    // Validate property types
    for (const propKey in properties) {
      const prop = properties[propKey]
      const type = prop.type
      switch (type) {
        case 'null':
          validateNullProp(prop,errors)
          break;
        case 'boolean':
          validateBooleanProp(prop,errors)
          break;
        case 'number':
          validateNumberProp(prop,errors)
          break;
        case 'string':
          validateStringProp(prop,errors)
          break;
        case 'array':
          validateArrayProp(prop,errors)
          break;
        case 'object':
          validateObjectProp(prop,errors)
          break;
      }
    }

    return result
  }

  validateObj(schema,obj) {
    // Check required properties exist on obj

    // Check extant obj properties match schema

    
  }
}

/**
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateNullProp(property,errors) {
  // disallow any other fields on property
  for (const fieldKey in property) {
    const field = property[fieldKey]
    if (fieldKey != 'type') {
      errors.push(`Unexpected field in null property '${fieldKey}'`)
    }
  }
}
/**
 * 
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateBooleanProp(property,errors) {
  expectPropertyTypes(property,'boolean',errors)
}
/**
 * 
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateNumberProp(property,errors) {
  expectPropertyTypes(property,'number',errors)
  // format
}
/**
 * 
 * 
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateStringProp(property,errors) {
  expectPropertyTypes(property,'string',errors)
  // format
  const known = [
    "date-time", "time", "date", "duration",
    "email","idn-email",
    "hostname","idn-hostname",
    "ipv4","ipv6",
    "uuid","uri","uri-reference","iri","iri-reference",
    "uri-template",
    "json-pointer","relative-json-pointer",
    "regex"
  ]

  // pattern
  // https://json-schema.org/understanding-json-schema/reference/regular_expressions
}
/**
 * 
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateArrayProp(property,errors) {
  expectPropertyTypes(property,'array',errors)

}
/**
 * 
 * @param {object} property Property object to validate
 * @param {Array<any>} errors Array of errors
 */
export function validateObjectProp(property,errors) {
  expectPropertyTypes(property,'object',errors)
  
}

export function expectPropertyTypes(property,typeName,errors) {
  expectAttrType(property,'default',typeName,errors)
  expectAttrType(property,'enum',typeName,errors)
  expectAttrType(property,'const',typeName,errors)
}
export function expectAttrType(property,attr,typeName,errors) {
  const attribute = property[attr]
  if (attribute) {
    const attributeType = typeof attribute
    if (attributeType != typeName) {
      errors.push(`expected type for default is ${typeName} but found ${attributeType}`)
    }
  }
}
