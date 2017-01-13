import {Meteor} from 'meteor/meteor';
import {Questions} from '../../imports/api/questions';
Meteor.methods({
    insertQuestion:function(doc){
        Questions.insert(doc);
    },
    updateQuestion:function(id,doc){
        Questions.update(id,doc,{ multi: true });
    },
    insertDifficulty:function(question_id,text){
        Questions.update({_id:question_id},{$set:{difficulty:text}})

    },
    importQuestion:function(question_id,qcm_id){
        Questions.update({_id:question_id},{$set:{qcm_id:qcm_id}});
        Meteor.call('importAnswers',question_id,qcm_id)

    },
    insertHelp:function(question_id,text){
        Questions.update({_id:question_id},{$set:{help:text}})
    },
    insertExplanation:function(question_id,text){
        Questions.update({_id:question_id},{$set:{explanation:text}})
    },
    removeQuestion(id){
        Questions.remove(id);
        Meteor.call('removeAnswer',{question_id:id}, (err, res) => {
                if (err) {
                    return(err);
                }})
    },
    //Switch the status from boolean to !boolean
    setExamStatus:function(question_id,question_status){
        Questions.update({_id:question_id},{$set:{examen:!question_status}})
    }
});