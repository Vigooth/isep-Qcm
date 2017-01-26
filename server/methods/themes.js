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
});
Meteor.publish('themes', function() {
    const selector = {
        $or: [{
            // the public parties
            $and: [{
                public: true
            }, {
                public: {
                    $exists: true
                }
            }]
        }, {
            // when logged in user is the owner
            $and: [{
                owner: this.userId
            }, {
                owner: {
                    $exists: true
                }
            }]
        }]
    };

    return Themes.find(selector);
});
