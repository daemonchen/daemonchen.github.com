initSocket = ->
	connectSocket = Ti.Network.Socket.createTCP
		host:'192.168.26.95'
		port:9091
		connected:(e)->
			postConnect()
			readResponse(e)
		error:(e)->
			Ti.API.info('Error (' + e.errorCode + '): ' + e.error)
	postConnect = ->
		writtenBuffer = Ti.createBuffer
			value:'天王盖地虎'
		connectSocket.write writtenBuffer

	readResponse = (e)->
		#读取server返回的数据，并传给readCallback来处理
		# http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Stream
		Ti.Stream.pump(e.socket, readCallback, 1024, true);	

	readCallback = (e)->
		if e.bytesProcessed is -1
	    console.error 'end'
	  try 
	      if e.buffer
	        received = e.buffer.toString()
	        Ti.API.error('data from server: ' + received)
	      else 
	        Ti.API.error('Error: read callback called with no buffer!')
	      
	  catch ex
	    Ti.API.error(ex)

	connectSocket


socketInstance = initSocket()
socketInstance.connect() 

setInterval ->
	#自动断点重连
	if socketInstance.getState() is Ti.Network.Socket.ERROR
		socketInstance = initSocket()
		socketInstance.connect()
,2000    



