import {Meteor} from 'meteor/meteor';
import {Themes} from '../../imports/api/themes';

Meteor.methods({
    insertThemes:function(doc){
        Themes.insert(doc)
    }

})