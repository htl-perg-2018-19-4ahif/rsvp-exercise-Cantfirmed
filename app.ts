import {CREATED, BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';
import * as express from 'express';
import * as loki from 'lokijs';
import * as basicAuth from 'express-basic-auth';



interface IGuest{
  firstName: string;
  lastName: string;
}

interface IParty{
  title: string;
  loc: string;
  date: Date;
  guests: IGuest[];
}

let db = new loki('loki.json');

//const auth = basicAuth({ users: { admin: 'P@ssw0rd!' } });

let partys:Collection<IParty> = db.addCollection('partys');
partys.insert({ title: 'Christmas Party', loc: 'My Place', date: new Date('24.12.2018'), guests: []});


let server = express();
server.use(express.json());



server.get('/party', (request, response) => {
  response.send({ 'Party Info': partys.get(1).title + ", " + partys.get(1).loc + ", " + partys.get(1).date });
});

server.post('/register/:id', (request, response) => {
  //response.send({'Party Info': partys.get(1).title + ", " + partys.get(1).loc + ", " + partys.get(1).date});
  if(!request.body.firstName || !request.body.lastName){
    response.status(BAD_REQUEST).send('Missing mandatory member(s)');
  }else{ 
    if(partys.get(request.params.id)){
      var cguest: IGuest = {firstName: request.body.firstName, lastName: request.body.lastName};
      
      
      if(partys.get(request.params.id).guests.length<10){
        const party = partys.get(request.params.id);
        party.guests.push(cguest);
        partys.update(party);
        response.send("saved");
      }else{
        response.status(UNAUTHORIZED).send('Too many members');
      }
    }
  }
});

server.get('/guests/:id', (request, response) => {
  //server.use(basicAuth({
  //  users: { 'admin': 'supersecret' }
  //}));
  let mess: string = "";
  for(let i=0;i<partys.get(request.params.id).guests.length;i++){
    mess += partys.get(request.params.id).guests[i].firstName + " " +  partys.get(request.params.id).guests[i].lastName + "\n";
  }
  response.send(mess);
});

const port = 8080;
server.listen(port, function () {
  console.log(`API is listening on port ${port}`);
});