
import {Qcms}from '/imports/api/qcms';

 export var Prof= {
     "getQcms":function(id){return Qcms.findOne({_id:id})},
     "getMyQcms":function(mail){return Qcms.find({createdBy:mail}).fetch()}
    
 }
isep-Qcm
    .idea
    .meteor
client
js
login.css
main.css
main.html
router.js
imports
api
components
node_modules
public
server
methods
main.js
startup.js
    .gitignore
npm-debug.log