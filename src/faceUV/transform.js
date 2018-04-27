function getImage (src, width=100, height=100) {
    var image = new Image(width, height)
    image.src = './A.png' // onload callback!
    image.crossOrigin = 'Anonymous' // FOR canvas.toDataURL
    return image
  }

function getCanvas () {
    var canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    return canvas
}

function process (canvas, image, i) {
    canvas.width  = 600
    canvas.height = 100

    var ctx = canvas.getContext('2d')

    var degree = -180
    ctx.rotate(degree * Math.PI / 180)
    ctx.drawImage(image, -100, -100)
    ctx.rotate(degree * Math.PI / 180)
    ctx.drawImage(image, 100, 0)
    degree = 90
    ctx.rotate(degree * Math.PI / 180)
    ctx.drawImage(image, 0, -300)
    ctx.drawImage(image, 0, -400)
    degree = -90
    ctx.rotate(degree * Math.PI / 180)
    ctx.drawImage(image, 400, 0)
    ctx.drawImage(image, 500, 0)
}

function getCanvasURL (canvas) {
    return canvas.toDataURL('image/png')
}
