import {Meteor} from 'meteor/meteor';
import {Questions} from '../../imports/api/questions';
Meteor.methods({
    insertQuestion:function(doc){
        Questions.insert(doc);
    },
    removeQuestion(id){
        Questions.remove(id);
        Meteor.call('removeAnswer',{question_id:id}, (err, res) => {
            if (err) {
                return(err);
            }})
    },
});