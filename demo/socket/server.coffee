net = require('net')
listenPort = 9091

doSetTimeout = (socket)->
    setInterval ->
      timeStamp = new Date().getTime()
      socket.write(timeStamp.toString())
    ,500

server = net.createServer (socket)->
    socket.write('小鸡炖蘑菇');
    doSetTimeout(socket)

    socket.on 'data',(data)->
      console.log('data from client:' + data)

    socket.on 'error',(exception)->
      console.log('socket error:' + exception)
      socket.end()

    socket.on 'close',(data)->
        console.log('client is closed');



server.listen(listenPort);

server.on 'listening',->
    console.log("server listening:" + server.address().port)

server.on "error",(exception)->
    console.log("server error:" + exception)