
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcmTraining.html';
import angularBootstrap from 'angular-ui-bootstrap';
import _ from 'lodash';


import {Qcms} from '../../../api/qcms'
import {Themes} from '../../../api/themes'
import {Modules} from '../../../api/modules'
import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers';

class QcmTrainingCtrl {

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
            console.log(((indexQuestion+1)==numberOfQuestions));
            if((indexQuestion+1)==numberOfQuestions){
                $('#trainingPager').hide();$scope.isUserOnLastPage=true}
        };
        $scope.checkBoxValue=function(indexQuestion,indexReponse) {

            if (isFirstBoxChecked) {
                //Si on est dans la dernière partie alors,
                var questionsPerPage=Number($scope.viewby);
                var firstQuestionOfThePage=indexQuestion-indexQuestion%questionsPerPage+1;
                var lastQuestionOfThePage=firstQuestionOfThePage-1+questionsPerPage;

                if(questionsPerPage>numberOfQuestions){lastQuestionOfThePage=numberOfQuestions}

                if((indexQuestion+1)+questionsPerPage>numberOfQuestions){
                    lastQuestionOfThePage=numberOfQuestions
                    }
                lastStep(lastQuestionOfThePage,firstQuestionOfThePage);
                isFirstBoxChecked = false;
            }//lastStep

            var currentQuestion=generateArray[indexQuestion + 1];
            var thisAnswer= currentQuestion[indexReponse];
            console.log(currentQuestion)
            thisAnswer.user_answer = this.myVar;
            var issquestiontrue=true;
            var currentAnswer=1;
            var lastAnswer=_.keys(currentQuestion).length;
            while(currentAnswer<=lastAnswer){
                thisAnswer= currentQuestion[_.keys(currentQuestion)[currentAnswer-1]];
                issquestiontrue=((issquestiontrue)&&(thisAnswer.user_answer==thisAnswer.correct_answer));
                currentAnswer++
            }
            scoreBeforeEvent[indexQuestion]=issquestiontrue;

            console.log("---------LA QUESTION "+indexQuestion+1+" est "+issquestiontrue);
            console.log(scoreBeforeEvent);

        };

        this.autorun(()=>{
            this.debugger=function(){ $(".pager >li.previous").remove();};

        });
        $scope.getQuestions=function(a){
            array.push(a);
        };
        function getScore(){
            var score=0;
            for(var index=0;index<scoreBeforeEvent.length;index++){
                if(scoreBeforeEvent[index]){
                    score++;
                }
            }
            return score;
        }

        $scope.viewby = 5;
        $scope.totalItems =numberOfQuestions;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 5; //Number of pager buttons to show

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function(num) {
            $('#trainingPager').show();
            if(this.viewby>=numberOfQuestions){$('#trainingPager').hide();}else{this.isUserOnLastPage=false;}
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
            this.successRate=Math.round(this.score/numberOfQuestions*100)

            this.showScore=true;
            console.log(scoreBeforeEvent)
        };
        $scope.numberOfQuestions=numberOfQuestions;
        $scope.successRate=0;
        $scope.showCorrection=function(){
            this.showCorrectionn=true;
        }
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

        this.helpers({

            questions: () =>{
                random=_.random(0, questions.count()-numberOfQuestions);
                randomlySorted=[-1,1][_.random()];
                return Questions.find({qcm_id:qcmId,examen:false}, { sort:{qcm_id:randomlySorted}, skip :random,limit:numberOfQuestions});
            },

            answers:()=>{  return Answers.find({qcm_id:qcmId})}

        });
        function initScoreArray(){
            var array=[];
            for (var i=1;i<=numberOfQuestions;i++){
                array.push(false);
            }
            scoreBeforeEvent=array;

        }
        //step1:[ [1,[]],[2,[]],[3[]],... ]
        function step1_2(){
            for (var i=1;i<=numberOfQuestions;i++){
                generateArray.push([i,[]]);
            }

            generateArray=_.fromPairs(generateArray);//step2:{1:[],2:[],3:[],... }
        }
        function lastStep(lastQuestion,indexQuestion){
            console.log(lastQuestion)
            console.log(indexQuestion)
            $scope.viewby=3;
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



export default angular.module('qcmTraining', [

    angularMeteor,angularBootstrap

])

    .component('qcmTraining', {

        templateUrl: template,

        controller:['$scope','$reactive','$state','$stateParams',QcmTrainingCtrl]

    });

