// Description:
//   Add notes to a notebook
//
// Commands:
//   hubot make a note <note> - Adds a note to a user's notebook
//   hubot get all my notes - Returns the user a list of his/her notes
//
// Author:
//   nemanjaaks

module.exports = function(robot) {
    "use strict";

    robot.respond(/make\sa\snote (.*)/i, function(msg){
      var noteBookName = msg.message.user.name.toLowerCase()+"-notebook";
      var userNotebook = robot.brain.get(noteBookName) || [];


      userNotebook.push(msg.match[1])
      robot.brain.save(noteBookName, userNotebook);
      msg.reply("Right away sir! Note '"+msg.match[1]+"' has been added to your notebook.");
    });

    robot.respond(/get\sall\smy\snotes/i, function(msg){
      var userNotebookName = msg.message.user.name.toLowerCase()+"-notebook";
      var notes = robot.brain.get(userNotebookName);
      var reply =">>> *Your notes:*\n"+notes.reduce((curr,prev)=> prev.concat("\n"+curr),"");

      msg.reply(reply)
    });
}
