const ClassifyTriangleService = require("../../src/services/ClassifyTriangle")

describe('Triangle Classification', () => {
    it('should be able to identify non valid type', async () => {
        try{
            const dimension1 = "a"
            const dimension2 = 2
            const dimension3 = 3
            
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
        } catch(err) {
            expect(err.message).toEqual('dimensions values must be numbers')
        }
    })

    it('should be able to identify non valid numbers', async () => {
        try{
            const dimension1 = -1
            const dimension2 = 2
            const dimension3 = 2
            
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
        } catch(err) {
            expect(err.message).toEqual('dimensions values must be greater than 0')
        }
    })

    it('should be able to identify non valid triangle', async () => {
        try{
            const dimension1 = 2
            const dimension2 = 10
            const dimension3 = 2
            
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
        } catch(err) {
            expect(err.message).toEqual('The sum of any two sides must be not be greater than the third side')
        }
    })

    it('should be able to classify a equilateral, isosceles triangle', async () => {
        try{
            const dimension1 = 2
            const dimension2 = 2
            const dimension3 = 2
            
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
            expect(classification).toEqual(['equilateral', 'isosceles'])
        } catch(err) {
            throw err
        }
    })

    it('should be able to classify a isosceles triangle', async () => {
        try {
            const dimension1 = 2
            const dimension2 = 1
            const dimension3 = 2
        
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
            expect(classification).toEqual(['isosceles'])
        } catch(err) {
            throw err
        }
    })

    it('should be able to classify a scalene triangle', async () => {
        try {
            const dimension1 = 2
            const dimension2 = 1
            const dimension3 = 3
        
            const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
            expect(classification).toEqual(['scalene'])
        } catch(err) {
            throw err
        }
    })
});