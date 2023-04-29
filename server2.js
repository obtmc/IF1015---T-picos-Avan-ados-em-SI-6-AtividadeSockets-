const net = require('net'); //import
const readline = require('readline');//import
const server = net.createServer();

server.maxConnections = 100;//número máximo de conexões no servidor
const MAX_CONNECTIONS = 50;//número máximo de conexões no chat

const clients = [];
//let client = null;
/*client: {
    name: undefined;
    socket: undefined
};*/

server.on('connection',(socket) => {

  console.log("Alguem se conectou.");

  if(clients.length >= MAX_CONNECTIONS){
    socket.write('O número máximo de conexões com o servidor foi atingido, você será desconectado. Tente mais tarde!');
    socket.destroy();
    console.log("O número máximo de conexões foi atingido. O cliente foi desconectado.");

  }else{
    var client = {nameUser: "", naoCadastrado: true, connection: socket};
    clients.push(client);
    var index = clients.indexOf(client);
    var nameInvalid = false;
    socket.write("SERVIDOR: Seja Bem Vindo! Para ecencerrar a conexao digite 'end'.\nSERVIDOR: Insira um nome de usuario:");//envia ao cliente uma mensagem de boas vindas, confirmando a conexão
       
  }

  socket.on('end', () => { //informa ao adm do server que o cliente se desconectou
    var index = clients.indexOf(client);
    if(index != -1){//exclui este cliente da lista
      clients.splice(index,1);
    }
    for(var i = 0; i < clients.length; i++){
        clients[i].connection.write("SERVIDOR: " + client.nameUser + " saiu.");
    }
    console.log(client.nameUser + " saiu.");
    socket.destroy();
  });

  socket.on('data', data =>  {//recebe dados do cliente
    const str = data.toString();
    index = clients.indexOf(client);//atribui índice atual do cliente no array a index
    if((str == "end") || (str == "END")){//derruba o cliente caso no caso de menssagem igual a "end"
        socket.end();
    }else if(clients[index].naoCadastrado){//verifica se cliente já se identificou
        for(var i = 0; i < clients.length; i++){//percorre todos os usuários conectados
            if(i != index){//exclui este cliente da checagem
                if(clients[i].nameUser == str){
                    nameInvalid = true;
                }
            }
        }
        if(nameInvalid){
            socket.write("SERVIDOR: Nome de usuario invalido.\n\tInsira um novo nome de usuario:");
            nameInvalid = false;
        }else{
            //index = clients.indexOf(client);
            clients[index].nameUser = str;
            clients[index].naoCadastrado = false;
            console.log(clients[index].nameUser + " se identificou.")//registra que o usuário se identificou
            for(var i = 0; i < clients.length; i++){//percorre todos os usuários conectados
                index = clients.indexOf(client);
                if(i != index){//exclui este cliente da lista de envio
                    clients[i].connection.write("SERVIDOR: " + clients[index].nameUser + " entrou.");
                }
            }
        }
    }else{

        for(var i = 0; i < clients.length; i++){//percorre todos os usuários conectados
            index = clients.indexOf(client);
            if(i != index){//excui este cliente da lista de envio
                clients[i].connection.write(clients[index].nameUser + ": " + str);//envia a mensagem enviada por este cliente para os demais
            }
        }
        console.log(clients[index].nameUser + " falou: " + str);//registra o que o usuário 'x' falou no chat
    } 
  });

  server.on('error', (err) => {
    console.log(`Server error: ${err}`);
    //process.exit(0);
  });
});

server.listen(8181,'127.0.0.1',() => console.log('Servidor ativo.'))
