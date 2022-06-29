const axios = require('axios')

const loginRequest = async (body) => {
    try{
        const data = await axios.post('http://localhost:3000/users/login', body)
        return data.data
    } catch(e) {
        console.log(e)
    }
}

module.exports = {
    loginRequest
}