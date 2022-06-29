const request = require('supertest')
const app = require('../src/app')
const User = require('../src/db/models/user')

const userOne = {
    name: 'Mike',
    email: 'mike@example.com',
    password:'56what!!!'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up a new user', async ()=>{
    await request(app)
        .post('/users')
        .send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'asodahashao1234'
        })
        .expect(201)
})

test('Should login existing user', async () =>{
    await request(app)
        .post('/users/login')
        .send({
        email: userOne.email,
        password: userOne.password
        })
        .expect(200)
})

test('Should login fail', async ()=>{
    await request(app)
        .post('/users/login')
        .send({
        email: userOne.email,
        password: 'asdasdasdasd'
        })
        .expect(400)
})

test('Should update user field', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization')
})
