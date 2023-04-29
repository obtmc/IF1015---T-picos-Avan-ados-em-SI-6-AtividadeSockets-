const net = require('net'); //import
const readline = require('readline');//import
const server = net.createServer();

const clients = [];

const rl = readline.createInterface({//seta a entrada e saída padrão
  input: process.stdin,
  output: process.stdout
});

server.maxConnections = 10;//número máximo de conexões no servidor
const MAX_CONNECTIONS = 1;//número máximo de conexões no chat

rl.addListener('line',line => {
  //console.log(!socket.write(line));
  if(clients.length < 1){
    console.log('Desculpa, no momento não existe nenhum cliente conectado!')
  }else{
    clients.forEach(socket => {
      if(socket.destroyed){
        console.log('Desculpa, não foi possível enviar sua mensagem! Verifique sua conexão com o cliente.');
      }else{
        socket.write(line);
      }
    });
  }
});

server.on('connection',(socket) => {

  console.log("Alguém se conectou.");
  
  if(clients.length >= MAX_CONNECTIONS){
    socket.write('O número máximo de conexões com o servidor foi atingido, você será desconectado. Tente mais tarde!');
    socket.destroy();
    console.log("O número máximo de conexões foi atingido. O cliente foi desconectado.");

  }else{
    clients.push(socket);
    const index = clients.indexOf(socket);
    socket.write('Seja Bem Vind@!');//envia ao cliente uma mensagem de boas vindas, confirmando a conexão
    console.log("Cliente validado!");
    
  }

  socket.on('end', () => { //informa ao adm do server que o cliente se desconectou
    index = clients.indexOf(socket);
    if(index != -1){
      clients.splice(index,1);
    }
    console.log('Cliente desconectou!');
    socket.destroy();
  });

  socket.on('data', data =>  {//recebe dados do cliente
    const str = data.toString();
    if((str == "end") || (str == "END")){//derruba o cliente no caso de menssagem igual a "end"
      socket.write("end");
      socket.end();
      //process.exit(0);
    }else{
      console.log("CLIENTE: " + str)//imprime a mensagem enviada pelo cliente no terminal
    }
  });
});

server.listen(8181,'127.0.0.1',() => console.log('Servidor ativo.'));

//function write
