// Description:
//   Redd verden - én middag om gangen
//
// Commands:
//   hubot middag <emoji> - Oppdaterer poengsummen basert på hvordan kjøtt/grønnsak middagen er basert på representert av <emoji>.
//   hubot middag status - Returnerer en oversikt over hvor mange poeng enhver bruker som har registrert en (eller flere) middag(er) har.
//
// Author:
//   nemanjaaks

module.exports = function(robot) {
    "use strict";
    const setOppMiddagData = () => robot.brain.data['middag'] == null ? robot.brain.data['middag'] = {} : null;
    const finnesBrukerData = (bruker) => robot.brain.data['middag'].hasOwnProperty(bruker);
    const setOppBrukerData = (bruker) => !finnesBrukerData(bruker) ? resetBruker(bruker) : null;
    const resetBruker = (bruker) => robot.brain.data['middag'][bruker] = 0;

    const emojiData = [{value:0, emojis:['cow','cow2','ox']},
          {value:1, emojis:['sheep']},
          {value:3, emojis:['pig', 'pig2']},
          {value:5, emojis:['chicken','turkey','egg']},
          {value:7, emojis:['tropical_fish','blowfish','fish']},
          {value:10, emojis:['leaves','maple_leaf','eggplant']}];

    setOppMiddagData();

    robot.respond(/middag\s:(.*):/i, function(msg){
      const dinnerpoint = emojiData.find(dinnerpoint => dinnerpoint.emojis.indexOf(msg.match[1])>=0);
      const bruker = msg.message.user.name.toLowerCase();

      console.log(robot.brain.data['middag'][bruker]+" "+finnesBrukerData(bruker));
      setOppBrukerData(bruker);
      console.log(robot.brain.data['middag'][bruker]+" "+finnesBrukerData(bruker));

      if(dinnerpoint != null || dinnerpoint != undefined){
        robot.brain.data['middag'][bruker] += dinnerpoint.value;
        robot.brain.emit('save', robot.brain.data); //-- Brukt hos nav - bytt ut denne med robot.brain.save funksjonen i kombo med redis
        msg.reply(`Høres godt ut! Du får ${dinnerpoint.value} poeng for den retten.`);
      }
      else{
        msg.reply(`Æsj! Hva er det du spiser @${bruker}?`);
      }
    });

    robot.respond(/middag\sstatus/i, function(msg){
      robot.brain.data['middag']["test"] = 100;
      robot.brain.data['middag']["aytest"] = 1;
      const poeng = robot.brain.data['middag'];
      const sortertBrukerData = Object.keys(poeng).sort((abruker,bbruker)=>poeng[abruker]-poeng[bbruker]);

      let poengtavle = "```Poengtavle";
      poengtavle = poengtavle.concat(sortertBrukerData.map((bruker,index)=>`\n${bruker} har ${poeng[bruker]} poeng.`).reduce((curr,prev)=> prev.concat(curr),""));
      poengtavle = poengtavle.concat("```");

      msg.reply(poengtavle);
    });
}
