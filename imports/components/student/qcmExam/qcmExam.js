
import  angular from 'angular';

import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './qcmExam.html'
import _ from 'lodash';
import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers';
import {Qcms} from '../../../api/qcms';

class QcmExamCtrl{
    constructor($scope,$reactive,$state) {
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        var array=[];
        const qcmId=$state.params.qcmId;
        const numberOfQuestions=Number($state.params.question);
        var questions=Questions.find({qcm_id:qcmId,examen:false});
        var scoreBeforeEvent=[];
        var random=0;
        var randomlySorted=0;
        var isFirstBoxChecked=true;
        initScoreArray();
        var generateArray=[];
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
            console.log(currentQuestion)
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

            console.log(scoreBeforeEvent);
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
            this.successRate=Math.round(this.score/numberOfQuestions*100);

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
        });
        this.helpers({

            questions: () =>{
                random=_.random(0, questions.count()-numberOfQuestions);
                randomlySorted=[-1,1][_.random()];
                return Questions.find({qcm_id:qcmId,examen:true}, { sort:{qcm_id:randomlySorted}, skip :random,limit:20});
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
        function getScore(){
            var score=0;
            for(var index=0;index<scoreBeforeEvent.length;index++){
                if(scoreBeforeEvent[index]){
                    score++;
                }
            }
            return score;
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
        controller:['$scope','$reactive','$state',QcmExamCtrl]
    })

