

/**
 * Handles the logic for demonstrating type systems.
 */
export class TypesController {
  constructor() {
    this.typeBuilderHost = document.getElementById('div-type-builder')
    this.objectEditorHost = document.getElementById('div-object-editor')

    this.schema = {}
    this.object = {}
  }

  setType(schema) {
    this.schema = schema
    this.bindType()
  }

  setObject(value) {
    this.object = value
    this.bindObject()
  }

  bindType() {
    this.typeBuilderHost.innerHTML = ''

    this.typeBuilderHost.appendChild(document.createTextNode('{'))
    for (const constraintKey in this.schema) {
      const constraint = this.schema[constraintKey]
      const element = document.createElement('div')
      const label = document.createTextNode(`${constraintKey}:${constraint}`)
      element.appendChild(label)
      this.typeBuilderHost.appendChild(element)
    }
    this.typeBuilderHost.appendChild(document.createTextNode('}'))
  }

  bindObject() {
    this.objectEditorHost.innerHTML = ''

    this.objectEditorHost.appendChild(document.createTextNode('{'))
    for (const constraintKey in this.object) {
      const constraint = this.object[constraintKey]
      const element = document.createElement('div')
      const label = document.createTextNode(`${constraintKey}:${constraint}`)
      element.appendChild(label)
      this.objectEditorHost.appendChild(element)
    }
    this.objectEditorHost.appendChild(document.createTextNode('}'))
  }
}

const controller = new TypesController()
controller.setType({
  color: "string",
  size: "dimension"
})
controller.setObject({
  color: "#00f",
  size: "[800,500]"
})
