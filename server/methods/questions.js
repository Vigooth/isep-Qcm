import {Meteor} from 'meteor/meteor';
import {Questions} from '../../imports/api/questions';
Meteor.methods({
    insertQuestion:function(doc){
        Questions.insert(doc);
    },
    updateQuestion:function(doc){
        Questions.update(doc);
    },
    test:function(question_id,text_indicatif){
        Questions.update({_id:question_id},{$set:{textIndicatif:text_indicatif}})
    },
    removeQuestion(id){
        Questions.remove(id);
        Meteor.call('removeAnswer',{question_id:id}, (err, res) => {
            if (err) {
                return(err);
            }})
    },
});