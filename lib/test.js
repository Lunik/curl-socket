var curlSocket = require('./index.js')

curlSocket.get({ socketPath: '/var/run/docker.sock', path: '/containers/json'}, function(data){
  console.log(data)
})
