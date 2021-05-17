const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')

async function createUsers() {

    const user = {
        name: 'Paulo Beckman',
        email: 'beckmam.paulo@hotmail.com',
        password: '1111',
        is_admin: true
    }

    User.create(user)
}

async function init(){
    await createUsers()
}

init()