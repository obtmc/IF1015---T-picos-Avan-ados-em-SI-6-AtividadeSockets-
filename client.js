const net = require('net');
const readline = require('readline');

const client = new net.Socket();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.connect(8181, '127.0.0.1', (error) => {

  if (error) {
    console.error('Erro ao tentar se conectar:', error);
  } else {
    console.log('Conexão estabelecida com sucesso.');
  }

  client.on('data', data =>  {
    const str = data.toString();
    if(str == "end"|| str == "END"){
      console.log('\nA conexao sera encerrada!');
      client.destroy();
      process.exit(0);
    }else{
      console.log('SERVIDOR: ' + str);
    }
  });

  client.on('end', () => { //informa ao client que o server se desconectou
    console.log('\nA conexao foi encerrada!');
    client.destroy();
    process.exit(0);
  });


  rl.addListener('line',line => {
    if(!client.write(line)){
      console.log('Desculpa, não conseguimos enviar sua mensagem. Verifique sua conexão.');
    }
  });


  client.on('error', (err) => {
    console.log(`Client error: ${err}`);
    client.destroy();
    process.exit(0);
  });
});

