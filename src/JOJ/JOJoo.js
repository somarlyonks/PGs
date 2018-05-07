var createScene = function() {
    {  // static
        // macro
        var V3 = BABYLON.Vector3
        var X = BABYLON.Axis.X
        var Y = BABYLON.Axis.Y
        var Z = BABYLON.Axis.Z
        var LOCAL = BABYLON.Space.LOCAL
        var WORLD = BABYLON.Space.WORLD
        var sq2 = Math.sqrt(2)
        var PI = Math.PI
        // scene
        var scene = new BABYLON.Scene(engine)
        scene.clearColor = new BABYLON.Color3(0xfa / 0xff, 0xf0 / 0xff, 0xe6 / 0xff)
        // camera
        var camera = new BABYLON.FreeCamera("camera1",  new V3(10, 10, -10), scene)
        camera.setTarget(V3.Zero())
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
        const {canvasFixW, canvasFixH} = getCanvasFixWH()
        camera.orthoLeft = -3 * canvasFixW
        camera.orthoRight = 3 * canvasFixW
        camera.orthoTop = 3 * canvasFixH
        camera.orthoBottom = -3 * canvasFixH
        // camera.attachControl(canvas, true)
        // lights
        var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(1, -4, 2), scene);
        light.intensity = 1
        // pilot
        var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 20, subdivisions: 1 }, scene)
        var head = new BABYLON.Mesh.CreateSphere("head", 0, 0.35, scene)
        head.position.y = 0.5
        var pilot = BABYLON.Mesh.MergeMeshes([body, head], true)
        pilot.scaling = new V3(0.75, 0.8, 0.75)
        pilot.position = new V3(0, 0.8 * 0.75 * 0.5, 0)
        var ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 0, scene)
        ground.rotation.y = PI / 2
        ground.position.y = -0.6
    }

    // {  // utils
        function getCanvasFixWH (basicSize=1) {
            const ratio = canvas.height / canvas.width
            const fix = 1 / Math.sqrt(ratio)

            const canvasFixW = basicSize * fix
            const canvasFixH = basicSize * fix * ratio

            return {canvasFixW, canvasFixH}
        }
        class Host extends BABYLON.Mesh {
            constructor(name, scene, position, son) {
                super(name, scene)
                this.position = position
                this.layerMask = 0
                this.son = son
                this.son.parent = this
            }
        }
    // }

    const config = {
        minDistance: 2,
        maxDistance: 4,
        perScore: 1,
        shadowSize: 1048,
        enable: {
            shadow: true,
            physics: true
        }
    }

    class Physics {
        constructor (scene) {
            this.g = new V3(0, -9.81, 0)
            this.physicsPlugin = new BABYLON.CannonJSPlugin()
            this.scene = scene
            this.impostors = []
            this.enable()
        }

        enable () {
            this.scene.enablePhysics(this.g, this.physicsPlugin)
        }

        impost (target, cate, params={mass: 0}) {
            this.impostors.push(target)
            target.physicsImpostor = new BABYLON.PhysicsImpostor(
                target,
                cate,
                params,
                this.scene
            )
        }

        setGravity (g) {
            this.scene.getPhysicsEngine().setGravity(g)
            return this
        }

        getTime (speed) {
            return sq2 * speed / this.g.y * -1
        }

        getFrames (speed) {
            return parseInt(this.getTime(speed) * 60)
        }

        getDistance (speed) {
            return speed * speed / this.g.y / 2 * -1
        }
    }

    scene.G = new Physics(scene)

    class Shadow extends BABYLON.ShadowGenerator {
        constructor (size, light, ground) {
            super(size, light)
            this.useBlurExponentialShadowMap = true
            // this.usePoissonSampling = true
            this.ground = ground
            ground.receiveShadows = true
        }

        addMesh (mesh) {
            this.getShadowMap().renderList.push(mesh)
        }
    }

    scene.shadow = new Shadow(config.shadowSize, light, ground)

    class Stages extends Array {
        constructor (size=3) {
            super()
            this.currentStage = undefined
            while (size--) {
                this.addStage()
            }
        }

        addStage (drop) {
            if (!this.currentStage) {
                this.currentStage = new Stage()
            } else {
                this.currentStage = new Stage(this.currentStage)
            }
            if (drop) {
                this.splice(0, 1)[0].dispose()
            }
            scene.G.impost(this.currentStage.stage, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0})
            if (config.enable.shadow) {
                scene.shadow.addMesh(this.currentStage.stage)
            }
            this.push(this.currentStage)

            return this
        }
    }

    class Stage {
        constructor (prev={position: {x: 0, y: -0.3, z:0}, direction: 'right'}) {
            this.prev = prev
            this.position = V3.Zero()
            this.minDistance = config.minDistance
            this.maxDistance = config.maxDistance
            this.distance = this.getRandomDistance()
            this.width = 1
            this.height = 0.6
            this.depth = 1
            this.direction = prev.direction === 'right' ? 'left' : 'right'
            this.create()
        }

        getRandomDistance () {
            return this.minDistance + Math.random() * (this.maxDistance - this.minDistance)
        }

        create () {
            const stage = BABYLON.MeshBuilder.CreateBox(
                'stage',
                {width: this.width, height: this.height, depth: this.depth},
                scene
            )
            stage.position = new V3(
                this.direction === 'left' ? this.prev.position.x : this.prev.position.x - this.distance,
                this.prev.position.y,
                this.direction === 'left' ? this.prev.position.z + this.distance : this.prev.position.z
            )
            this.stage = stage
            this.position = stage.position
            return this
        }
    }

    class CameraHost extends Host {
        constructor(name, scene, position, son, stages) {
            super(name, scene, position, son)
            this.stages = stages
        }
        getNextPosition () {
            const x = (this.stages[0].position.x + this.stages[1].position.x) / 2
            const z = (this.stages[0].position.z + this.stages[1].position.z) / 2
            this.distanceX = x - this.position.x
            this.distanceZ = z - this.position.z
        }

        goNext (frames) {
            this.translate(X, this.distanceX / frames, WORLD)
            this.translate(Z, this.distanceZ / frames, WORLD)
        }
    }

    /**
     * TODO:
     * physics fix
     * pressing detect
     */
    class GameController {
        constructor (scene, pilot) {
            this.scene = scene
            this.end = false
            this.TIME = 0 // contorls the render loop
            this.t = 0
            this.pressed = false
            this.power = 0
            this.curDIR = 'right'
            this.pilot = pilot
            this.pilot.controller = this
            this.pilot.stages.controller = this
            this.ground = ground
            this.firstStage = new Stage()
            this.firstStage.stage.position = new V3(0, -0.3, 0)
            this.G = this.scene.G = this.scene.G || new Physics(this.scene)
            this.initG()
            this.initShadow()
        }

        initG () {
            this.G.impost(this.pilot, BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 0.2,
                restitution: 0
            })
            this.G.impost(this.ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.8})
            this.G.impost(this.firstStage.stage, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0})
        }

        initShadow () {
            if (config.enable.shadow) {
                this.shadow = this.scene.shadow = this.scene.shadow || new Shadow(config.shadowSize, light, ground)
                this.shadow.addMesh(this.pilot)
                this.shadow.addMesh(this.firstStage.stage)
            }
        }

        runGame () {
            if (!this.end){
                this.t++
                this.getPress()
            }
        }

        getPress () {
            if (this.pressed) {
                if (this.pilot.scaling.y > 0.5) {
                    this.down += 0.1
                    this.pilot.silenceImpostor()
                    this.pilot.scaling.y -= 0.004
                    this.pilot.position.y -= 0.002
                }
            } else {
                if (this.completed) {
                    this.down = 0
                    this.TIME = 0
                } else if (this.TIME) {
                    this.pilot.wakeUpImpostor()
                    this.pilot[`jump${this.curDIR}`]()
                }
            }
        }

        endGame () {
            if (!this.end) {
                scene.onPointerDown = () => {}
                scene.onPointerUp = () => {}
                this.end = true
                console.log('Game End.')
            }
        }

        changeDIR () {
            this.curDIR = {'left': 'right', 'right': 'left'}[this.curDIR]
            return this.curDIR
        }
    }

    pilot.stages = new Stages()
    const cmrHost = new CameraHost('cmrHost', scene, new V3(1, 2, 1), camera, pilot.stages)

    pilot.jump  = function (speedDIR, rotateDIR) {
        const TIME = this.controller.TIME
        if (this.controller.t < TIME) {
            this.rotate(rotateDIR, PI * 2 / TIME * 1, LOCAL)
            this.translate(speedDIR, this.speedframe, WORLD)
            cmrHost.goNext(TIME) // TODO
        } else {
            this.rotate(rotateDIR, PI * 2 / TIME * 1, LOCAL)
            this.controller.changeDIR()
            this.jumpCompleted()
        }
    }

    pilot.jumpleft = function () {
        this.jump(new V3(-1, 1, 0).normalize(), Z)
    }
    pilot.jumpright = function () {
        this.jump(Y.add(Z).normalize(), X)
    }

    pilot.jumpCompleted = function () {
        this.position.y = 0.3
        this.controller.completed = true
        this.stages.addStage()
    }

    pilot.silenceImpostor = function () {
        if (!this.physicsImpostor.isDisposed) {
            this.physicsImpostor.dispose()
        }
    }
    pilot.wakeUpImpostor = function () {
        if (this.physicsImpostor.isDisposed) {
            this.controller.G.impost(this, BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 0.2,
                restitution: 0
            })
            this.physicsImpostor.registerOnPhysicsCollide(
                this.controller.ground.physicsImpostor, (main, collided) => {
                    this.controller.endGame()
            })
        }
    }

    // args

    const controller = new GameController(scene, pilot)

    scene.onPointerDown = () => {
        controller.down = 0
        controller.pressed = true
    }
    scene.onPointerUp = () => {
        controller.completed = false
        controller.pressed = false
        controller.pilot.position.y = 0.3
        controller.pilot.scaling.y = 0.8
        controller.pilot.speed = controller.down * sq2
        controller.pilot.speedframe = pilot.speed / 60
        controller.t = 0
        controller.TIME = controller.G.getFrames(controller.pilot.speed)
        cmrHost.getNextPosition()
    }

    scene.registerAfterRender(() => controller.runGame())

    return scene
}
