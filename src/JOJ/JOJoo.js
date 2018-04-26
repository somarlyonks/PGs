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
        var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene)
        var head = new BABYLON.Mesh.CreateSphere("head", 0, 0.35, scene)
        head.position.y = 0.5
        var pilot = BABYLON.Mesh.MergeMeshes([body, head], true)
        pilot.scaling = new V3(0.75, 0.8, 0.75)
        pilot.position = new V3(0, 0.8 * 0.75 * 0.5, 0)
    }

    // {  // utils
        function getCanvasFixWH (basicSize=1) {
            const ratio = canvas.height / canvas.width
            const fix = 1 / Math.sqrt(ratio)

            const canvasFixW = basicSize * fix
            const canvasFixH = basicSize * fix * ratio

            return {canvasFixW, canvasFixH}
        }
    // }

    {   // AXIS
        getAxis(1, 1, pilot)

        function globalAxis (size) {
            function makeTextPlane (text, color, size) {
                const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true)
                dynamicTexture.hasAlpha = true
                dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true)
                const plane = new BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true)
                plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
                plane.material.backFaceCulling = false
                plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
                plane.material.diffuseTexture = dynamicTexture
                return plane
            }

            const axisX = BABYLON.Mesh.CreateLines('axisX', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            axisX.color = new BABYLON.Color3(1, 0, 0)
            const xChar = makeTextPlane('X', 'red', size / 10)
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)

            const axisY = BABYLON.Mesh.CreateLines('axisY', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
            ], scene)
            axisY.color = new BABYLON.Color3(0, 1, 0)
            const yChar = makeTextPlane('Y', 'green', size / 10)
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)

            const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
                ], scene)
            axisZ.color = new BABYLON.Color3(0, 0, 1)
            var zChar = makeTextPlane('Z', 'blue', size / 10)
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
        }

        function localAxis(size) {
            const localAxisX = BABYLON.Mesh.CreateLines('localAxisX', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            localAxisX.color = new BABYLON.Color3(1, 0, 0)

            localAxisY = BABYLON.Mesh.CreateLines('localAxisY', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], scene)
            localAxisY.color = new BABYLON.Color3(0, 1, 0)

            const localAxisZ = BABYLON.Mesh.CreateLines('localAxisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], scene)
            localAxisZ.color = new BABYLON.Color3(0, 0, 1)

            const localAxisZM = BABYLON.Mesh.CreateLines('localAxisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -15)
            ], scene)
            localAxisZ.color = new BABYLON.Color3(0, 0, 1)

            const localOrigin = BABYLON.MeshBuilder.CreateBox('localOrigin', {size:1}, scene)
            localOrigin.isVisible = false

            localAxisX.parent = localOrigin
            localAxisY.parent = localOrigin
            localAxisZ.parent = localOrigin
            localAxisZM.parent = localOrigin

            return localOrigin
        }

        function getAxis (needGlobalAxis=true, needLocalAxis=false, origin=false, globalSize=8, localSize=2) {
            if (needGlobalAxis) {
                globalAxis(globalSize)
            }
            if (needLocalAxis && parent) {
                const localOrigin = localAxis(localSize)
                localOrigin.parent = origin
            }
        }
    }

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
            this.minDistance = 2
            this.maxDistance = 5
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

    class Host extends BABYLON.Mesh {
        constructor(name, scene, position, son) {
            super(name, scene)
            this.position = position
            this.layerMask = 0
            this.son = son
            this.son.parent = this
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
        constructor (height=10, time=1) {
            this.g = 2 * height / time / time
            this.gframe = this.g / 60 / 60
        }

        getTime (speed) {
            return sq2 * speed / this.g
        }

        getFrames (speed) {
            return parseInt(this.getTime(speed, this.g) * 60)
        }

        getDistance (speed) {
            return speed * speed / this.g / 2
        }
    }

    class GameController {
        constructor (pilot) {
            this.end = false
            this.TIME = 0 // contorls the render loop
            this.t = 0
            this.pressed = false
            this.power = 0
            this.curDIR = 'right'
            this.pilot = pilot
            this.pilot.controller = this
            this.G = new Physics()
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
                if (this.pilot.scaling.y > 0.4) {
                    down += 0.1
                    this.pilot.scaling.y -= 0.004
                    this.pilot.position.y -= 0.002
                }
            } else {
                if (this.completed) {
                    this.down = 0
                    this.TIME = 0
                } else if (this.TIME) {
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
            this.translate = this.pilot.translate
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
    pilot.speed = 6.5 * sq2
    pilot.speedframe = speed / 60

    const stages = new Stages()
    const cmrHost = new CameraHost('cmrHost', scene, new V3(1, 2, 1), camera, stages)

    const controller = new GameController(pilot)

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
        controller.pilot.speedframe = speed / 60
        controller.t = 0
        controller.TIME = getFrames(controller.pilot.speed, controller.G.g)
        cmrHost.getNextPosition()
    }

    scene.registerAfterRender(controller.runGame)

    return scene
}
