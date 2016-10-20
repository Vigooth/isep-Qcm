import {Meteor} from 'meteor/meteor';
import {Modules} from '../../imports/api/modules';
Meteor.methods({
    insertModules:function(doc){
        Modules.insert(doc);
    }
})