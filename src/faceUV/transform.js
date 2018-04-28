const config = {
    picWidth: 100,
    picHeight: 100,
}

const srcs = []

function getImage (src) {
    var image = new Image(config.picWidth, config.picHeight)
    image.src = './A.png' // onload callback!
    image.crossOrigin = 'Anonymous' // FOR canvas.toDataURL
    return image
}

function getImages (srcs) {
    return srcs.map(src => getImage(src))
}

function getCanvas () {
    var canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    return canvas
}

function process () {
    const canvas = getCanvas()
    const images = getImages(srcs)
    const [w, h] = [config.picWidth, config.picHeight]
    const cateCount = images.length

    if (cateCount < 3) return

    if (cateCount >= 3 && cateCount < 6) { // cylinder
        canvas.width = w + w * Math.PI + w
        canvas.height = h
        const ctx = canvas.getContext('2d')

        ctx.drawImage(images[0], 0, 0, w, h)
        ctx.drawImage(images[1], w, 0, w * Math.PI, h)
        ctx.drawImage(images[2], w + w * Math.PI, 0, w, h)
    }

    if (cateCount >= 6) { // box
        canvas.width = 6 * w
        canvas.height = h
        const ctx = canvas.getContext('2d')

        const rad = (degree) => degree * Math.PI / 180

        ctx.rotate(rad(-180))
        ctx.drawImage(images[0], -h, -w, w, h)

        ctx.rotate(rad(-180))
        ctx.drawImage(images[1], w, 0, w, h)

        ctx.rotate(rad(90))
        ctx.drawImage(images[2], 0, -2 * w - h, w, h)
        ctx.drawImage(images[3], 0, -2 * w - 2 * h, w, h)

        ctx.rotate(rad(-90))
        ctx.drawImage(images[4], 2 * w + 2 * h, 0, w, h)
        ctx.drawImage(images[5], 3 * w + 2 * h, 0, w, h)
    }

    const url = canvas.toDataURL('image/png')
    return url
}

function getCanvasURL (canvas) {
    return canvas.toDataURL('image/png')
}
