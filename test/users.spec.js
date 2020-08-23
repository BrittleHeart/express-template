const chai = require('chai')
const chaiHttp = require('chai-http')
const {expect} = chai

chai.use(chaiHttp)

describe('Users', () => {
    describe('GET /users', () => {
        it('Should return status 200', (done) => {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibm9zaGkiLCJpYXQiOjE1OTgxNzc4MzMsImV4cCI6MTU5ODM1MDYzM30.3_Q6LUOJu7-JKByAMP9V10E_HYrxPNRdGlSoPnJE45c')
                .end((error, response) => { 
                    if(error) done(error)

                    expect(response).to.have.status(200)
                    expect(response).to.include({status: 200})
                    expect(response).to.be.an('object')
                    
                    done()
                })
        })
    })

    describe('GET /users/:id', () => {
        it('Should return status 200', (done) => {
            chai.request('http://localhost:3000')
                .get('/api/v1/users/1')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibm9zaGkiLCJpYXQiOjE1OTgxNzc4MzMsImV4cCI6MTU5ODM1MDYzM30.3_Q6LUOJu7-JKByAMP9V10E_HYrxPNRdGlSoPnJE45c')
                .end((error, response) => { 
                    if(error) done(error)

                    expect(response).to.have.status(200)
                    expect(response).to.include({status: 200})
                    expect(response).to.be.an('object')
                    
                    done()
                })
        })
    })
})