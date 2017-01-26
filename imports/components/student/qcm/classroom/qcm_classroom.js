
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcm_classroom.html';
import angularBootstrap from 'angular-ui-bootstrap';
import _ from 'lodash';
import {Questions} from '/imports/api/questions'
import {Answers} from '/imports/api/answers';
import {Qcms} from '/imports/api/qcms';
import {Stats} from '/imports/api/stats';

class QcmClassroomCtrl {

    constructor($scope,$reactive,$state) {
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        const qcmId=$state.params.qcmId;
        var qcm=Qcms.findOne({_id:qcmId})
        var numberOfQuestions=$state.params.question;
        $scope.aaaa=Questions.find({qcm_id:qcmId}).fetch();
        var scoreBeforeEvent=[];
        var isFirstBoxChecked=true;
        initScoreArray();
        var generateArray=[];
        var questions_all={};
        $scope.showScore=false;

        step1_2();//generateArray={1:[],2:[],3:[],... }
        /*step1:[ [1,[]],[2,[]],[3[]],... ]
         step2:{1:[],2:[],3:[],... }
         step3:{1:[[26,{"correct_answer":true ,"user_answer":false}],[27,{..}],..],2:... }
         lastStep:{1:{26:{"correct_answer":true ,"user_answer":false},{27:{..},..},2:... }*/
        $scope.generateArray=function(indexQuestion,indexReponse,correct_answer){
            //generateArray[indexQuestion+1].push([indexReponse,false]);//step3:{1:[[26,false],[27,false],..],2:... }
                generateArray[indexQuestion+1].push([indexReponse,{"correct_answer":correct_answer ,"user_answer":false}]);


            if((indexQuestion+1)==numberOfQuestions){
                $('#trainingPager').hide();$scope.isUserOnLastPage=true}
        };
        $scope.checkBoxValue=function(indexQuestion,indexReponse) {

            if (isFirstBoxChecked) {
                var questionsPerPage=Number($scope.data.selectedOption.value);
                var firstQuestionOfThePage=indexQuestion-indexQuestion%questionsPerPage+1;
                var lastQuestionOfThePage=firstQuestionOfThePage-1+questionsPerPage;
                if(numberOfQuestions-firstQuestionOfThePage<questionsPerPage){lastQuestionOfThePage=numberOfQuestions}

                if(questionsPerPage>numberOfQuestions){
                    lastQuestionOfThePage=numberOfQuestions
                }
                lastStep(firstQuestionOfThePage,lastQuestionOfThePage);
                isFirstBoxChecked = false;
            }//lastStep
            var currentQuestion=generateArray[indexQuestion + 1];
            var thisAnswer= currentQuestion[indexReponse];
            thisAnswer.user_answer = this.myVar;
            var isQuestionTrue=true;
            var currentAnswer=1;
            var lastAnswer=_.keys(currentQuestion).length;
            while(currentAnswer<=lastAnswer){
                thisAnswer= currentQuestion[_.keys(currentQuestion)[currentAnswer-1]];
                isQuestionTrue=((isQuestionTrue)&&(thisAnswer.user_answer==thisAnswer.correct_answer));
                currentAnswer++
            }
            scoreBeforeEvent[indexQuestion]=isQuestionTrue;

        };

        $scope.data = {
            availableOptions: [
                {value: '3'},
                { value: '5'},
                {value: '10'}
            ],
            selectedOption: {value: '10'} //This sets the default value of the select in the ui
        };
        $scope.data.selectedOption.value =5;
        $scope.totalItems =numberOfQuestions;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.data.selectedOption.value;
        $scope.maxSize = 5; //Number of pager buttons to show


        $scope.setItemsPerPage = function(num) {
            $('#trainingPager').show();
            if(this.data.selectedOption.value>=numberOfQuestions){$('#trainingPager').hide();}else{this.isUserOnLastPage=false;}
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
        };
        $scope.nextPage=function(){
            isFirstBoxChecked=true;
            this.hideItemsPerpage=true;
        };
        $scope.showCorrectionPage=function(){
            this.hideQcm=true;
            this.hideItemsPerpage=true;
            this.score=getScore();
            pushStatistic();
            this.successRate=Math.round(this.score/numberOfQuestions*100);

            this.showScore=true;
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
            var questionIsCorrect=scoreBeforeEvent[index];
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
            if($scope.qcm.status=='close'){
                alert('Le test est terminé');
                $state.go('home')
            }
            $scope.getDeadLine= moment(Stats.findOne({qcm_id:qcmId,status:'open'}).createdAt).add(qcm.settings.duration, 'm').format('LTS');
            $scope.Datenow=moment().format('LTS')

            ;});
        this.helpers({

            questions: () =>{
                //numberOfQuestions=Questions.find({qcm_id:qcmId}).count();
                var questions=Questions.find({qcm_id:qcmId,examen:false});
                questions=_.shuffle(questions.fetch());
                questions=_.take(questions,numberOfQuestions);
                questions=_.orderBy(questions,['difficulty'],['asc']);
                questions_all=questions;
                return questions;
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
                count++;
                return count;
            }
        });
        function getScore(){
            var score=0;
            for(var index=0;index<scoreBeforeEvent.length;index++){
                if(scoreBeforeEvent[index]){
                    score++;
                }
            }
            return score;
        }
        function pushStatistic(){
            var array=[];
            for (var i=0;i<numberOfQuestions;i++){
                array.push([questions_all[i]._id,scoreBeforeEvent[i]])
            }
            var statistic=_.fromPairs(array);
            Meteor.call('updateStat',qcmId,statistic,numberOfQuestions)
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
        function lastStep(indexQuestion,lastQuestion){
            for (var i=indexQuestion;i<=lastQuestion;i++){
                generateArray[i]=_.fromPairs(generateArray[i]);
            }
        }
        $(document).ready(function(){
            $(".pager >li.previous").remove();

        });

    }



}



export default angular.module('qcmClassroom', [

    angularMeteor,angularBootstrap

])

    .component('qcmClassroom', {

        templateUrl: template,

        controller:['$scope','$reactive','$state','$stateParams',QcmClassroomCtrl]

    });

