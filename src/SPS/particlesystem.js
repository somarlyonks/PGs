var createScene = function () {
    {
        var scene = new BABYLON.Scene(engine)

        // Setup environment
        var light0 = new BABYLON.PointLight('Omni', new BABYLON.Vector3(0, 2, 8), scene)
        var camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene)
        camera.attachControl(canvas, true)

        // Fountain object
        var fountain = BABYLON.Mesh.CreateBox('fountain', 1, scene)

        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem('particles', 2000, scene)
    }

    // Emitter
    particleSystem.emitter = fountain
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 11, 0)
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, -11, 0)
    // Emission rate
    particleSystem.emitRate = 150
    // Directions
    particleSystem.direction1 = new BABYLON.Vector3(-7, -8, 3)
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3)
    // Speed
    particleSystem.minEmitPower = 0.5
    particleSystem.maxEmitPower = 2
    particleSystem.updateSpeed = 0.005

    // Texture
    particleSystem.particleTexture = new BABYLON.Texture('http://d33wubrfki0l68.cloudfront.net/2e1f167031edb2d710f5af42e795afe3203fb2bc/3186e/img/how_to/particles/flare.png', scene)
    // Colors
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0)
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0)
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)
    // Sizes
    particleSystem.minSize = 0.1
    particleSystem.maxSize = 0.5
    // Life time
    particleSystem.minLifeTime = 0.3
    particleSystem.maxLifeTime = 1.5
    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE
    // Gravity
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0)
    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0
    particleSystem.maxAngularSpeed = Math.PI

    // Start the particle system
    particleSystem.start()

    // Fountain's animation
    var keys = []
    var animation = new BABYLON.Animation(
        'animation', 'rotation.x', 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )
    keys.push({
        frame: 0,
        value: 0
    })
    keys.push({
        frame: 50,
        value: Math.PI
    })
    keys.push({
        frame: 100,
        value: 0
    })

    // Launch animation
    animation.setKeys(keys)
    fountain.animations.push(animation)
    scene.beginAnimation(fountain, 0, 100, true)
    fountain.isVisible = false
    //scene.stopAnimation(fountain, animation)

    return scene
}
