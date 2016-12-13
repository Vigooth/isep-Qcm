import {Qcms} from '../../../api/qcms';

import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers';
import  angular from 'angular';

import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './qcmExam.html'
import _ from 'lodash';


class QcmExamCtrl{
    constructor($scope,$reactive,$state) {
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        const qcmId=$state.params.qcmId;
        const numberOfQuestions=Number($state.params.question);
        var scoreBeforeEvent=[];
        var isFirstBoxChecked=true;
        initScoreArray();
        var generateArray=[];
        $scope.showScore=false;
        const bonus=Number($state.params.bonus);
        const penalty=Number($state.params.penalty);
        console.log(bonus)

        step1_2();//generateArray={1:[],2:[],3:[],... }
        /*step1:[ [1,[]],[2,[]],[3[]],... ]
         step2:{1:[],2:[],3:[],... }
         step3:{1:[[26,{"correct_answer":true ,"user_answer":false,"penalty":0}],[27,{..}],..],2:... }
         lastStep:{1:{26:{"correct_answer":true ,"user_answer":false,"penalty":0},{27:{..},..},2:... }*/
        $scope.generateArray=function(indexQuestion,indexReponse,correct_answer){
            //generateArray[indexQuestion+1].push([indexReponse,false]);//step3:{1:[[26,false],[27,false],..],2:... }
            generateArray[indexQuestion+1].push([indexReponse,{"correct_answer":correct_answer ,"user_answer":false,"penalty":0}]);

            if((indexQuestion+1)==numberOfQuestions){
                $('#trainingPager').hide();$scope.isUserOnLastPage=true}
        };
        $scope.checkBoxValue=function(indexQuestion,indexReponse) {

            if (isFirstBoxChecked) {
                lastStep();
                isFirstBoxChecked = false;
            }//lastStep
            var currentQuestion=generateArray[indexQuestion + 1];
            var thisAnswer= currentQuestion[indexReponse];
            console.log(currentQuestion)
            thisAnswer.penalty=0;
            thisAnswer.user_answer = this.myVar;
            var isQuestionTrue=true;
            var currentAnswer=1;
            var lastAnswer=_.keys(currentQuestion).length;
            while(currentAnswer<=lastAnswer){
                thisAnswer= currentQuestion[_.keys(currentQuestion)[currentAnswer-1]];
                console.log(thisAnswer.user_answer)
                isQuestionTrue=((isQuestionTrue)&&(thisAnswer.user_answer==thisAnswer.correct_answer));
                if((thisAnswer.user_answer==true)&&(thisAnswer.correct_answer==false)){thisAnswer.penalty=-1;isQuestionTrue="penalty"}
                currentAnswer++
                if(isQuestionTrue=="penalty"){break;}
            }
            scoreBeforeEvent[indexQuestion]=isQuestionTrue;

            console.log(scoreBeforeEvent);
        };
        
        $scope.showCorrectionPage=function(){
            this.hideQcm=true;
            this.score=getScore();
            this.successRate=Math.round(this.score/numberOfQuestions*100);
            this.note=getNote();

            this.showScore=true;
            console.log(scoreBeforeEvent)
        };
        $scope.numberOfQuestions=numberOfQuestions;
        $scope.successRate=0;
        $scope.showCorrection=function(){
            this.showCorrectionn=true;
        };
        $scope.displayAlert=function(successRate){

            var alert='';
            switch(true) {
                case successRate>=60:
                    alert='alert-success';
                    break;
                case successRate<45:
                    alert='alert-danger';
                    break;
                default:alert='alert-warning'
            }
            return alert
        };
        $scope.returnPanelColor=function(index){
            var questionIsCorrect=scoreBeforeEvent[index]==true;
            if (questionIsCorrect){return "panel-success"}
            else return "panel-danger"
        };
        $scope.isAnswerTrue=function(){
            if(this.answer.status){
                return "alert-success"
            }};
        var count=0;
        this.autorun(()=>{
            $scope.qcm=Qcms.findOne({_id:qcmId});
        });

        $(document).ready(function(){
        })

        this.helpers({

            questions: () =>{
                var question=[];
                var questions_exam=Questions.find({qcm_id:qcmId,examen:true});
                questions_exam.forEach(function(element) {
                    question.push(element)
                });
                var numberOfQuestionsForExam=questions_exam.count();
                var numbOfTrainingQuestionsNeeded=numberOfQuestions-numberOfQuestionsForExam;
                var questions_training=_.shuffle(Questions.find({qcm_id:qcmId,examen:false}).fetch());
                questions_training=_.take(questions_training,numbOfTrainingQuestionsNeeded);
                questions_training.forEach(function(element) {
                    question.push(element)
                });
                question=_.orderBy(question,['difficulty'],['asc']);
                return question;
            },
//Pour chaque question on prends les réponses justes puis on va chercher des réponses fausses pour arriver à 4 réponses par questions
            answers:()=>{
                var answers=[];
                var answersTrue= Answers.find({qcm_id:qcmId,status:true});
                var uniqueAnswersTrue=_.uniqBy(answersTrue.fetch(), 'question_id');
                answersTrue.forEach(function(element) {
                    answers.push(element)
                });


                uniqueAnswersTrue.forEach(function(element){
                    var numberOfAnswersTrue=Answers.find({question_id:element.question_id,status:true}).count();
                    var answersFalse= Answers.find({question_id:element.question_id,status:false});
                    answersFalse= _.shuffle(answersFalse.fetch());//answers are shuffled
                    answersFalse=_.take(answersFalse,4-numberOfAnswersTrue);//Pick the x number of false answers needed to get 4 answers

                    answersFalse.forEach(function(element){
                        answers.push(element);
                    })
                });
                Answers.find({qcm_id:qcmId,status:false});

                return _.shuffle(answers)},
            cronos(){
                Chronos.update();
                // console.log(count);
                count++;
                return count;
            }
        });
        function getNote(){
            var note=0;
            for(var index=0;index<scoreBeforeEvent.length;index++){
                if("ok"){console.log("ok")}
                if(scoreBeforeEvent[index]==true){
                    note=note+bonus;
                }
                if(scoreBeforeEvent[index]=="penalty"){note=note+penalty;}
            }
            console.log(numberOfQuestions)
            var facteur=20/numberOfQuestions;
            console.log(facteur)

            note=note*facteur;
            if(note<0){note=0};
            if(note>20){note=20};

            note=Math.round(note*10)/10;
            
            return note;
        }
        function getScore(){
            getNote();
            var answers_right=0;
            for(var index=0;index<scoreBeforeEvent.length;index++){
                if(scoreBeforeEvent[index]==true){
                    answers_right++;
                }
            }
            return answers_right;
        }
        function initScoreArray(){
            var array=[];
            for (var i=1;i<=numberOfQuestions;i++){
                array.push(false);
            }
            scoreBeforeEvent=array;

        }

        function step1_2(){
            for (var i=1;i<=numberOfQuestions;i++){
                generateArray.push([i,[]]);
            }

            generateArray=_.fromPairs(generateArray);
        }
        function lastStep(){
            for (var i=1;i<=numberOfQuestions+1;i++){
                generateArray[i]=_.fromPairs(generateArray[i]);
            }
            console.log(generateArray)
        }
        $(document).ready(function(){
            $(".pager >li.previous").remove();

        });

    }




}

export default angular.module('qcmExam', [

    angularMeteor,angularBoostrap

])
    .component('qcmExam',{
        templateUrl:template,
        controller:['$scope','$reactive','$state','$stateParams',QcmExamCtrl]
    })

