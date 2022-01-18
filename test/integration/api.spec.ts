const request = require("request-promise-native")
const endpoint = 'YOUR_ENDPOINT'

describe('api e2e tests', () => {
    let uid: string

    it('should be able to get a 400 from bad requests', async () => {
        try{
            const data = await request ({
                method: 'POST',
                uri: `${endpoint}/triangle`,
                body: {
                    dimension1: 3,
                    dimension2: 3,
                    dimension3: -1,
                },
                json: true
            })
            uid = data.uid

        } catch(err) {
            expect(err.statusCode).toEqual(400)
        }
    })
    
    it('should be able to classify a triangle and save to the database', async () => {
        try{
            const data = await request ({
                method: 'POST',
                uri: `${endpoint}/triangle`,
                body: {
                    dimension1: 3,
                    dimension2: 3,
                    dimension3: 3,
                },
                json: true
            })
            uid = data.uid

            expect(data.classification).toEqual([ 'equilateral', 'isosceles' ])
        } catch(err) {
            console.error(err)
        }
    })

    it('should be able to find the item inserted to the database', async () => {
        try{
            const data = await request ({
                method: 'GET',
                uri: `${endpoint}/triangle`,
                json: true
            })

            expect(data.Items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: uid })
                ])
            )
        } catch(err) {
            console.error(err)
        }
    })
});
