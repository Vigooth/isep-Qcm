
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcmDo.html';
import angularBootstrap from 'angular-ui-bootstrap';
import _ from 'lodash';

//import '/client/js/qcmDo';

import {Qcms} from '../../../api/qcms'
import {Themes} from '../../../api/themes'
import {Modules} from '../../../api/modules'
import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers';



class QcmDoCtrl {

    constructor($scope,$stateParams,$reactive) {
        const qcmId=$stateParams.qcmId;
        const numberOfQuestions=Number($stateParams.question)

        const qcms=Qcms.find({_id:qcmId});
        const questions=Questions.find({qcm_id:qcmId}, { limit :numberOfQuestions});
        const answers=Answers.find({qcm_id:qcmId});
        const modules= Modules.find({});
        const themes= Themes.find({});
        var correction=[];
        var statusOfEachQuestions=[];
        var score=0;

        $scope.showQcm=true;
        $scope.showScore=false;
        $scope.showCorrection=false;
        $scope.showCorrectionBtn=false;
        $scope.ifCheckBoxSelected=true;
        $scope.showNextBtn=false;
        $scope.showQuestionsPerPage=true;
        $(document).ready(function(){
            $('[data-toggle="popover"]').popover();
            disableSomePagerFeatures(true,false);
            initialiseSiCochPas();

        });
 


        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
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
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
            if(numberOfQuestions>=num) {
                $(".pager >li.next>a.ng-binding")[0].innerHTML = "Next";
            }
        };
  
        $scope.nextPage=function(lastQuestions){
            if(!lastQuestions){lastQuestions=$scope.remplace}
                       statusOfEachQuestions=_.concat(statusOfEachQuestions,lastQuestions);
            this.statusOfEachQuestions=statusOfEachQuestions;
            this.showNextBtn=false;
            this.showQuestionsPerPage=false;

            if($(".pager >li.next>a.ng-binding")[0].innerHTML=="Terminer"){
                console.log("Donne la correction")
                $scope.correction=lastQuestions;
                $(".pager").remove();


                this.showQcm=false;
                this.showCorrectionBtn=true;

                this.showScore=true;
                this.score=0;

                for (var status of statusOfEachQuestions){
                    if (status){this.score++}
                };
                console.log(this.score);
                console.log(numberOfQuestions);
                this.successRate=Math.round(this.score/numberOfQuestions*100)
            }
            disableSomePagerFeatures()
            

        };

   
        $scope.myVar=false;

        $scope.submitQcm=function(){
            this.showQcm=false;
            this.showCorrection=true
        }
        $scope.isAnswerTrue=function(){
            if(this.answer.status==true){
                return "alert-success"
            }
        };
        $scope.isQuestionFalse=function(a){
            var aReponduFaux=!a;
            if (aReponduFaux){return "alert-danger"}
        }
        $scope.returnPanelColor=function(a){
            var aReponduFaux=!a;
            if (aReponduFaux){return "panel-danger"}
            else return "panel-success"
        }


$scope.showHideNextBtn=function(bool){
    $scope.showNextBtn=true;
    if(!!bool){
        $scope.showNextBtn=false;
    }
};
        $scope.getQcmScore=function(){
            this.ifCheckBoxSelected=false;
            //Initialisation
            var questionsAnswers=document.getElementsByClassName("checkB");
            var isFirstQuestion=true;
            var isLastAnswer=questionsAnswers.length;
            var isQuestionTrue=true;
            var isAnswerTrue;
            var answerStatus;
            var questionId;
            var NBRE_QUESTION=0;
            var SCORE=0;
            var correction=[];

            //Evualation de la réponse

            //isFirstQuestion()


            console.log("BOOM IT works"+questionsAnswers);
            var temp=0;
            for(var answer of questionsAnswers){
                answerStatus=Answers.findOne(answer.id).status;
                questionId=Answers.findOne(answer.id).question_id;
                isAnswerTrue=false;
                temp++;


                if (answerStatus==answer.checked){
                    isAnswerTrue=true
                }
                console.log(isLastAnswer+"++++"+temp)

                if((isNewQuestion(questionId)&&!isFirstQuestion)||(isLastAnswer==temp)){
                    NBRE_QUESTION++;
                    if(isLastAnswer==temp){isQuestionTrue=isQuestionTrue&&isAnswerTrue;}
                    if(isQuestionTrue){SCORE++;
                    }correction.push(isQuestionTrue);$scope.correction=correction;

                    isQuestionTrue=isAnswerTrue;

                }else{
                    isQuestionTrue=isQuestionTrue&&isAnswerTrue;
                    console.log(isAnswerTrue);
                    console.log("Question is ");
                    console.log(isQuestionTrue);
                }
                //Si c'est la première question alors on ne regarde pas ce qu'il y a avant
                if (isFirstQuestion){console.log("Ceci est la première question");isFirstQuestion=false}

            };
        };
        $scope.numberOfQuestions=numberOfQuestions;
        $scope.successRate=0;
        
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
        $scope.getCorrection=function(correction){
            $scope.correction=correction;

        };
        var count = 10;
        
        this.helpers({
            qcms(){
                return qcms.fetch()[0]
            },
            questions(){
                return questions
            },
            answers(){
                var answersShuffled = _.shuffle(answers.fetch());
                return answersShuffled;
               

            },
            themes(){
                return themes
            },
            modules(){

                return modules
            },
            cronos(){
                Chronos.update();
                // console.log(count);
                count--;
                if(count>0){
                    return count;
                }else {

                }
            },


        })
     

//remove Previous button, disable the option 'disabled' and switch from content from Next to Terminer
        function disableSomePagerFeatures(onReady){
            var buttonDisabled=$(".pager >li.disabled.next").length!=0;
            if(onReady){$(".pager >li.previous").remove();}
                if(((numberOfQuestions<=$scope.viewby)&&buttonDisabled)||buttonDisabled){
                    $(".pager >li.disabled.next>a.ng-binding")[0].innerHTML="Terminer";
                    $(".pager >li.next")[0].className="next";
                }
            
        


        }

    }




}
var val="";
function isNewQuestion(val){
    if (val!=this.val){

        this.val=val;
        return true
    } else return false;

}


export default angular.module('qcmDo', [

    angularMeteor,angularBootstrap

])

    .component('qcmDo', {

        templateUrl: template,

        controller:['$scope','$stateParams', '$reactive',QcmDoCtrl]

    });

