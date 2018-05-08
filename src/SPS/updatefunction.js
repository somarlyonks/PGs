// the default form of update function

updateFunction = function (particles) {
    for (var index = 0; index < particles.length; index++) {
        var particle = particles[index]
        particle.age += this._scaledUpdateSpeed

        if (particle.age >= particle.lifeTime) { // Recycle
            particles.splice(index, 1)
            this._stockParticles.push(particle)
            index--
            continue
        }
        else {
            particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep)
            particle.color.addInPlace(this._scaledColorStep)

            if (particle.color.a < 0) {
                particle.color.a = 0
            }

            particle.angle += particle.angularSpeed * this._scaledUpdateSpeed

            particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection)
            particle.position.addInPlace(this._scaledDirection)

            this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity)
            particle.direction.addInPlace(this._scaledGravity)
        }
    }
}
