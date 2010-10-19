var net = require('net');
var sys = require('sys');

var ircServer = { 
  host: 'irc.ozinger.org',
  port: 6667,
  channel: '#langdev'
};

var botConfig = {
  nick: 'ㅋㄷㅁ',
  user: 'cadmium',
  verbose: false
};

var sock = net.createConnection(ircServer.port, ircServer.host);
sock.setEncoding('utf8');

packetHandlers = [
  [ /^\:[a-zA-Z0-9_\.]+\s001/, function(socket) { writeln(socket,"JOIN "+ircServer.channel);} ],
  [ /^PING\s\:(.+)/, function(socket,line,m) { writeln(socket, "PONG :" + m[1]);} ],
  [ /PRIVMSG\s(.+)\s\:(.+)/, function(socket,line,m) {
    var ch = m[1];
    var text = m[2];

    if ( /낚지/.test(text) == true ) { 
      writeln(socket,"PRIVMSG " + ch + " :국산 산낚지는 안전하지 말입니다");
    }

  } ]
];

sock.on('connect', function() {
  log("connected");
  writeln(sock,"USER " + botConfig.user +" 0 * :"+botConfig.user);
  writeln(sock,"NICK " + botConfig.nick);

});

sock.on('data', function(data) {

  if ( botConfig.verbose == true ) { log(data); }

  var lines = data.split("\r\n");
  lines.forEach(function(line) {
    
    packetHandlers.forEach(function(obj) {

      var exp = obj[0];
      var fun = obj[1];
      var m = exp.exec(line);

      if ( m != null ) {
        fun(sock, line, m);
      }
      
    });

  });

});



function log(text) {
  sys.log(text); 
};

function writeln(socket,data) {
  socket.write(data+"\r\n");
};
