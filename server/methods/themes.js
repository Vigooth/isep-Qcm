import {Meteor} from 'meteor/meteor';
import {Themes} from '../../imports/api/themes';

Meteor.methods({
    insertTheme:function(doc){
        Themes.insert(doc)
    },
    updateTheme:function(id,text){
        Themes.update({_id:id},{$set:{text:text}});
    },
    removeTheme(id){
        Themes.remove(id);

    }
})