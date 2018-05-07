// http://mathworld.wolfram.com/SpherePointPicking.html
export default function pickRandomPointOnSphere () {

    function getR1R2R () {
        const r1 = Math.random() * 2 - 1
        const r2 = Math.random() * 2 - 1
        const r = Math.pow(r1, 2) + Math.pow(r2, 2)
        return r < 1 ? [r1, r2, r] : getR1R2R()
    }

    const [r1, r2, r] = getR1R2R()

    return {
        x: 2 * r1 * Math.sqrt(1 - r),
        y: 2 * r2 * Math.sqrt(1 - r),
        z: 1 - 2 * r
    }
}
