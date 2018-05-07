/* eslint-disable no-unused-vars */

var BABYLON
const randomRange = BABYLON.Scalar.randomRange

class CylinderParticleEmitter {
    constructor (radius=0.5, height=1, directionRandomizer=0) {
        this.radius = radius
        this.height = height
        this.directionRandomizer = directionRandomizer
    }

    startDirectionFunction (emitPower, worldMatrix, directionToUpdate, particle) {
        const direction = particle.position.subtract(worldMatrix.getTranslation()).normalize()
        const randX = randomRange(0, this.directionRandomizer)
        const randY = randomRange(0, this.directionRandomizer)
        const randZ = randomRange(0, this.directionRandomizer)

        if (Math.pow(direction.x, 2) + Math.pow(direction.z, 2) > 0.1 * this.radius &&
            Math.abs(direction.y) > 0.1 * this.height / 2) {
            direction.y = 0
        }

        direction.x += randX
        direction.y += randY
        direction.z += randZ

        direction.normalize()

        BABYLON.Vector3.TransformNormalFromFloatsToRef(
            ...Object.values(direction).map(axis => axis * emitPower),
            worldMatrix,
            directionToUpdate
        )
    }

    startPositionFunction (worldMatrix, posotionToUpdate, particle) {
        const s = randomRange(0, Math.PI * 2)
        const h = randomRange(-0.5, 0.5)
        const radius = randomRange(0, this.radius)
        const randX = radius * Math.sin(s)
        const randY = h * this.height
        const randZ = radius * Math.cos(s)
        BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, posotionToUpdate)
    }

    updateFunction (particles) {
        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index]
            particle.age += this._scaledUpdateSpeed

            if (particle.age >= particle.lifeTime) { // Recycle
                this._stockParticles.push(particles.splice(index, 1)[0])
                index--
                continue
            } else {
                particle.position.y += (this.emitter.position.y - particle.position.y ) / 50
                particle.position.x += (this.emitter.position.x - particle.position.x ) / 50
                particle.position.z += (this.emitter.position.z - particle.position.z ) / 50
            }
        }
    }
}

// example
BABYLON.ParticleSystem.prototype.createCylinderEmitter = function (radius=0.5, height=1) {
    var particleEmitter = new BABYLON.CylinderParticleEmitter(radius, height)
    this.particleEmitterType = particleEmitter
    this.updateFunction = particleEmitter.updateFunction
    return particleEmitter
}
