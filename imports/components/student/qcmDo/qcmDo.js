
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


var TEST=0;

class QcmDoCtrl {

    constructor($scope,$reactive,$state) {
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        const qcmId=$state.params.qcmId;
        const numberOfQuestions=Number($state.params.question);

        const qcms=Qcms.find({_id:qcmId});
        const questions=Questions.find({qcm_id:qcmId,examen:false}, { limit :numberOfQuestions});
         
        const answers=Answers.find({qcm_id:qcmId});
        const modules= Modules.find({});
        const themes= Themes.find({});
        var correction=[];
        var statusOfEachQuestions=[];

        ///////////////////////////////
        var listeQuestions=[];
        var listeAnswers=[false,false][true,true];
        initialisationlisteQuestions();//[false,false,false]
        function initialisationlisteQuestions(){
            var a=[];
            for (var i=1;i<=numberOfQuestions;i++){
                a.push(false);
            }
            listeQuestions=a;

        }
        ///////////////////////////////
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
            
          
        });
        
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
                console.log(qcmScore2);
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
        var qcmScore2=[];
        initialisationQcmscore();
        function initialisationQcmscore(){
            var a=[];
            //console.log(numberOfQuestions);
            for (var i=1;i<=numberOfQuestions;i++){
                a.push(false);
            }
            qcmScore2=a;
            $scope.asuppr=a;

        }
        $scope.getQcmScore2=function(index,p){
            console.log(qcmScore2);
            console.log(index+" : "+p)
            var array=qcmScore2;
            //[false,false,false,false]
            

        },
        $scope.getQcmScore=function(index1){
            var array=qcmScore2;

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
                    }correction.push(isQuestionTrue);
                    array[index1]=isQuestionTrue;
                    qcmScore2[index1]=isQuestionTrue;
                    $scope.asuppr[index1]=isQuestionTrue
console.log(index1);
                    $scope.correction=correction;

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
            console.log($scope.asuppr);
            console.log($scope.correction);

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
        var listeIdQuestion=[];

        function a(){for(var x of questions.fetch()){
            listeIdQuestion.push(x._id);
            var answers=Answers.find({question_id:{$in: listeIdQuestion}});
            this.TEST=_.shuffle(answers.fetch());
        } return Answers.find({question_id:{$in: listeIdQuestion}})}

        this.helpers({
            testss(){
               a();
                return getA();
            },
            qcms(){
                return qcms.fetch()[0]
            },
            questions(){
                if((questions.count()!=0)&&(questions.count()!=numberOfQuestions)){
                   $state.go('qcmChoose')
                }
                return questions
            },
            answers(){
                var answersShuffled = _.shuffle(a().fetch());
                //getA();
                return getA();
               

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
            }


        });


//remove Previous button, disable the option 'disabled' and switch from content from Next to Terminer
        function disableSomePagerFeatures(onReady){
            var buttonDisabled=$(".pager >li.disabled.next").length!=0;
            if(onReady){$(".pager >li.previous").remove();}
                if(((numberOfQuestions<=$scope.viewby)&&buttonDisabled)||buttonDisabled){
                    $(".pager >li.disabled.next>a.ng-binding")[0].innerHTML="Terminer";
                    $(".pager >li.next")[0].className="next";
                }
            
        


        }
        function getA(){
            console.log(this.TEST)
            return this.TEST;
        }
        var val="";
        function isNewQuestion(val){
            if (val!=this.val){

                this.val=val;
                return true
            } else return false;

        }



    }



}

export default angular.module('qcmDo', [

    angularMeteor,angularBootstrap

])

    .component('qcmDo', {

        templateUrl: template,

        controller:['$scope','$reactive','$state','$stateParams',QcmDoCtrl]

    });

