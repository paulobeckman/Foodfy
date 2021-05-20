const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')

async function createUsers() {

    const user = {
        name: 'admin',
        email: 'admin@gmail.com',
        password: '1111',
        is_admin: true
    }

    User.create(user)
}

async function init(){
    await createUsers()
}

init()