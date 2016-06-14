var spawn = require('child_process').spawn
/*
*
* request = {
*   socketPath: '',
*   path: ''
* }
*
*/
module.exports.get = function(request, cb) {
  var curlVersion = spawn('curl', ['--version'])
  curlVersion.stdout.on('data', function(data){
    var version = parseFloat(data.toString().split(' ')[1], 10)
    if(version >= 7.40){
      var curl = spawn('curl', ['--unix-socket', request.socketPath, 'http:' + request.path])
      curl.stdout.on('data', function(data){
        var error = false
        try {
          var parsedData = JSON.parse(`${data}`)
        } catch (e){
          error = true
        }

        if(error){
          cb({
            'error': 'Failed to parse data.',
            'data': `${data}`
          })
        } else {
          cb({
            'data': parsedData
          })
        }
      })

      curl.on('close', function (code) {
        if (code !== 0) {
          console.log(`Curl process exited with code ${code}`);
        }
      })

    } else {
      console.log('Curl 7.40.0 or greater is required')
    }
  })

  curlVersion.on('close', function (code) {
    if (code !== 0) {
      console.log(`Curl process exited with code ${code}`);
    }
  })
}
