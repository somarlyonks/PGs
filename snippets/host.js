class Host extends BABYLON.Mesh {
    constructor(name, scene, position, son) {
        super(name, scene)
        this.position = position
        this.layerMask = 0
        this.son = son
        this.son.parent = this
    }
}
