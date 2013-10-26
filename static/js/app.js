(function(){
   var
      socket = io.connect('http://localhost'),
      gameInst;



   var Game = function(playerId){
      this.playerId    = playerId;
      this.iAmActive   = false;
      this.turnTimeout = null;

      this.init();
   };

   Game.prototype.init = function(){
      var self = this;

      pWorld.initWorld({
         onHit : function(data){
            if(data.name){
               socket.emit("hit", data);
            }
            self.nextTurn();
         }
      });

      setInterval(function(){
         pWorld.step();
         self.drawArcher("archer1", pWorld.getArcher("archer1"));
         self.drawArcher("archer2", pWorld.getArcher("archer2"));
         if (pWorld.bulletExists()){
            self.drawBullet(pWorld.getBullet());
         }
      }, 1000/60);
   };

   Game.prototype.end = function(){
      window.location = "/";
   };

   Game.prototype.onState = function(data){
      var self = this;
      if(this.playerId == playerId){
         //значит мы ходим
         this.iAmActive = true;
         this.turnTimeout = setTimeout(function(){
            self.nextTurn()
         }, 20000);
      } else{
         var players = data.players;
         players.forEach(function(obj){
            pWorld.setArcherPos(obj.name, obj.pos);
         });
      }
   };

   Game.prototype.fire = function(){
      this.iAmActive = false;
      socket.emit("fire", {name: pId, vec: vec});
   };

   Game.prototype.nextTurn = function(){
      clearTimeout(this.turnTimeout);
      socket.emit("nextTurn");
   };

   Game.prototype.drawArcher = function(name, pos){
      $("." + name).offset(pos);
   };

   Game.prototype.drawBullet = function(pos){
      $(".bullet").addClass("bulletVisible").offset(pos);
   };
   Game.prototype.destroyBullet = function(){
      $(".bullet").removeClass("bulletVisible");
   };

   gameInst =  new Game("archer1");

   socket.on('gameStart', function(pId){
      gameInst =  new Game(pId);
   });

   socket.on('state', function (data) {
      gameInst.onState(data);
   });

   socket.on('fire', function(data){
      pWorld.createBullet(data.pId, data.vec);
   });

   socket.on('gameEnd', function(){
      gameInst.end();
   });

   socket.emit("ready");
}());
