export function getCanvasFixWH (basicSize=1) {
    const ratio = canvas.height / canvas.width
    const fix = 1 / Math.sqrt(ratio)

    const canvasFixW = basicSize * fix
    const canvasFixH = basicSize * fix * ratio

    return {canvasFixW, canvasFixH}
}
