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
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene)
        light.intensity = 0.8
        // pilot
        var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 20, subdivisions: 1 }, scene)
        var head = new BABYLON.Mesh.CreateSphere("head", 0, 0.35, scene)
        head.position.y = 0.5
        var pilot = BABYLON.Mesh.MergeMeshes([body, head], true)
        pilot.scaling = new V3(0.75, 0.8, 0.75)
        pilot.position = new V3(0, 0.8 * 0.75 * 0.5, 0)
        var ground = BABYLON.Mesh.CreateGround('ground', 0.01, 0.01, 0, scene)
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
            this.push(this.currentStage)

            return this
        }
    }

    class Stage {
        constructor (prev={position: {x: 0, y: -0.3, z:0}, direction: 'right'}) {
            this.prev = prev
            this.position = V3.Zero()
            this.minDistance = 1.5
            this.maxDistance = 3
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
            const x = (this.stages[2].position.x + this.stages[1].position.x) / 2
            const z = (this.stages[2].position.z + this.stages[1].position.z) / 2
            this.distanceX = x - this.position.x
            this.distanceZ = z - this.position.z
        }

        goNext (frames) {
            this.translate(X, this.distanceX / frames, WORLD)
            this.translate(Z, this.distanceZ / frames, WORLD)
        }
    }

    class Physics {
        constructor (scene) {
            this.g = new V3(0, -9.81, 0)
            this.physicsPlugin = new BABYLON.CannonJSPlugin()
            this.scene = scene
            this.impostors = []
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
            return speed * speed / this.g / 2
        }
    }

    class GameController { // TODO: shadow
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
            this.ground = ground
            this.firstStage = new Stage()
            this.firstStage.stage.position = new V3(0, -0.3, 0)
            this.G = new Physics(this.scene)
            this.initG()
        }

        initG () {
            this.G.enable()
            this.G.impost(this.pilot, BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 1, // TODO:
                restitution: 0.9
            })
            this.G.impost(this.ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.9})
            this.G.impost(this.firstStage.stage, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.9})
        }

        runGame () {
            this.t++
            if (this.end) {
                this.pilot.fall()
                this.endGame()
            } else {
                this.getPress()
            }
        }

        getPress () {
            if (this.pressed) {
                if (this.pilot.scaling.y > 0.5) {
                    if (!this.pilot.physicsImpostor.disposed) {
                        this.pilot.physicsImpostor.dispose()
                    }
                    this.down += 0.1
                    this.pilot.scaling.y -= 0.004
                    this.pilot.position.y -= 0.002
                }
            } else {
                if (this.completed) {
                    this.down = 0
                    this.TIME = 0
                } else if (this.TIME) {
                    if (this.pilot.physicsImpostor.disposed) {
                        this.pilot.physicsImpostor.wakeUp()
                    }
                    this.pilot[`jump${this.curDIR}`]()
                }
            }
        }

        endGame () {
            //
        }

        changeDIR () {
            this.curDIR = {'left': 'right', 'right': 'left'}[this.curDIR]
            return this.curDIR
        }
    }

    class Pilot {
        constructor (pilot) {
            this.pilot = pilot
            this.speed = 0
            this.speedframe = this.speed / 60
            this.position = this.pilot.position
            this.translate = this.pilot.translate // TODO:
            this.rotate = this.pilot.rotate
        }
        jump (speedDIR, rotateDIR) {
            const TIME = this.controller.TIME
            if (this.controller.t < TIME) {
                this.rotate(rotateDIR, PI * 2 / TIME * 1, LOCAL)
                const speedG = -this.controller.gframe * this.controller.t
                this.translate(Y, speedG, WORLD)
                this.translate(speedDIR, this.controller.speedframe, WORLD)
                cmrHost.goNext(TIME) // TODO
            } else {
                this.rotate(rotateDIR, PI * 2 / TIME * 1, LOCAL)
                this.controller.changeDIR()
                this.jumpCompleted()
            }
        }

        jumpleft () {
            this.jump(new V3(-1, 1, 0).normalize(), Z)
        }

        jumpright () {
            this.jump(Y.add(Z).normalize(), X)
        }

        jumpCompleted () {
            this.position.y = 0.3
            this.controller.completed = true
            this.controller.end = this.notOnStage()
            console.log(this.controller.end)
            addStage()
        }

        notOnStage () {
            const rangeX = [
                stages[1].position.x - 1 / 2,
                stages[1].position.x + 1 / 2,
            ]
            const rangeZ = [
                stages[1].position.z - 1 / 2,
                stages[1].position.z + 1 / 2,
            ]
            function outRange (self, range) {
                if (range[0] > self) return 1
                if (self > range[1]) return 2
                return 0
            } // TODO: fall directly
            this.fallDirection = [0, 'left', 'right'][outRange(this.position.x, rangeX)] ||
              [0, 'backward', 'forward'][outRange(this.position.z, rangeZ)]
            if (this.fallDirection) {
                this.fallCountDown = 60
            }
            return this.fallDirection
        }

        fall () {
            const dir = this.fallDirection
            const DIRECTION = dir === 'left' || dir === 'right' ? Z : X
            const ANGLE = dir === 'backward' || dir === 'right' ? -1 : 1

            if (this.fallCountDown > 30) { // TODO: fix a little
                // TODO: change rotate axis to edge
                this.rotate(DIRECTION, ANGLE * PI / 2 / 30, WORLD)
                this.translate(Y, -1 * 0.2 / 30, WORLD)
            } else if (this.fallCountDown > 0) {
                this.translate(Y, -1 * 0.4 / 30, WORLD)
            } // TODO: roll randomly
            this.fallCountDown--

            return this
        }
    }

    // args

    const stages = new Stages()
    const cmrHost = new CameraHost('cmrHost', scene, new V3(1, 2, 1), camera, stages)

    const controller = new GameController(scene, pilot)

    scene.onPointerDown = () => { // TODO: running
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
