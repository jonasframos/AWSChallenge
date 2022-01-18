module.exports.classifyTriangle = async (dimension1, dimension2, dimension3) => {
    try{
        //input validation
        if(typeof dimension1 != 'number' || typeof dimension2 != 'number' || typeof dimension3 != 'number') throw new Error('dimensions values must be numbers')
        if(dimension1 <= 0 || dimension2 <= 0 || dimension3 <= 0) throw new Error('dimensions values must be greater than 0')
        if((dimension1 + dimension2) < dimension3 || (dimension2 + dimension3) < dimension1 || (dimension3 + dimension2) < dimension1) throw new Error('The sum of any two sides must be not be greater than the third side')

        //classification itself
        let result = []
        if(dimension1 == dimension2 && dimension2 == dimension3) result.push('equilateral', 'isosceles')
        else if(dimension1 == dimension2 || dimension2 == dimension3 || dimension3 == dimension1) result.push('isosceles')
        else result.push('scalene')

        return result
    } catch(e) {
        throw e
    }
} 

