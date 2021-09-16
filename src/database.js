const typeorm = require('typeorm');



class Player {
    constructor(name,img) {
        
        this.name =name;
        this.img=img;
    }    
}


const EntitySchema = require("typeorm").EntitySchema; 



const PlayerSchema = new EntitySchema({
    name: "Player",
    target: Player,
    columns: {
  
                    
        name: {
            
            type: "text",
            default: null

        },

        
        img:{
            primary: true,

            type:"varchar",
            default: 'null'

        }
    }
});



async function getConnection() {
    return await typeorm.createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "mysqlpassword",
        database: "db",
        synchronize: true,
        logging: false,
        entities: [
            PlayerSchema
        ]
    })
}



async function getAllPlayers() {

    const connection = await getConnection();
    const playerRepo = connection.getRepository(Player);
    const players = await playerRepo.find();
    connection.close();

    return players;
}



async function insertPlayername(i,el1,el2) {
        

    const connection = await getConnection();
    
    // create
    const player = await new Player();
    player.name = el2;
    player.img=el1;
        
    // save
    const playerRepo = await connection.getRepository(Player);

    if (i==0) {await playerRepo.delete(() => "");}
    await playerRepo.save(player);
     
   
    const allPlayers = await playerRepo.find();
    await connection.close();

    return allPlayers;

}



module.exports = {
    getAllPlayers,
    insertPlayername,
    
}
