
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcmDo.html';


import {Qcms} from '../../../api/qcms'
import {Themes} from '../../../api/themes'
import {Modules} from '../../../api/modules'
import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers'

class QcmDoCtrl {
    constructor($scope,$stateParams) {
        var NOMBRE_QUESTION=2;
        var NOMBRE_POINT_PAR_QUESTION=2;
        var POINT_TOTAL=0;
        var POINT_NEGATIF=0;
        var temp=0;
        var tempp=0;
        var i=0;
        var testScore=0;

        var init=0;

        $scope.viewModel(this);
        $scope.myVar=false;
        $scope.score=function(){
            console.log("ca marche");
            testScore=5;

            return "ok";
        };
        $scope.compteNombrePoint=function(){
            var nombreReponseJuste=Answers.find({question_id:this.answer.question_id,status:true}).count();
            var bool=false;
                if(this.myVar==this.answer.status) {
                    bool = true;
                    //var point =this.NOMBRE_POINT_PAR_QUESTION/nombreReponseJuste}
                    var reponse = Answers.find({qcm_id: qcmId});
                    console.log("vous avez " + reponse);
                    console.log(this.answer.question_id);
                }
        };
        $scope.testEach=function(b){
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
 this.testScore=5;
            //Evualation de la réponse

            //isFirstQuestion()

            
                console.log(b);
            console.log("BOOM IT works"+this.myVar);
            var temp=0;
            for(var answer of questionsAnswers){
                answerStatus=Answers.findOne(answer.id).status;
                questionId=Answers.findOne(answer.id).question_id;
                isAnswerTrue=false;
                temp++;


                if (answerStatus==answer.checked){
                    isAnswerTrue=true
                }

                if((isNewQuestion(questionId)&&!isFirstQuestion)||(isLastAnswer==temp)){
                    console.log("La question précedente est : ");
                    console.log(isQuestionTrue);
                    NBRE_QUESTION++;
                    if(isQuestionTrue){SCORE++;testScore=SCORE;
                    }

                    isQuestionTrue=isAnswerTrue;

                }else{
                    isQuestionTrue=isQuestionTrue&&isAnswerTrue;

                    console.log("Question is ");
                    console.log(isQuestionTrue);
                }
                //Si c'est la première question alors on ne regarde pas ce qu'il y a avant
                if (isFirstQuestion){console.log("Ceci est la première question");isFirstQuestion=false}

                console.log(isAnswerTrue)

            };
            console.log("VOTRE SCORE EST DE :"+SCORE+"/"+NBRE_QUESTION)
            console.log("VOTRE SCORE EST DE :"+testScore+"/"+NBRE_QUESTION)

        }
        $scope.submitTest=function(){
            console.log($scope.answer)
        }
        $scope.printStatus=function(){
            $(window).load(function(){
                tempp++;
                console.log("bonsoir !!!!!");
                console.log("bonour !!!!!");
                console.log("k  "+tempp)
            })
        };
        $scope.bonsoir=function(){
            angular.forEach(a,function(){
                console.log(a)
            })
        }

        $scope.printVal=function(){
            var bool=false;
            if(this.question._id==this.answer.question_id){
                init++;
                if(this.myVar==this.answer.status)
                {bool=true}
                if(bool){
                    temp++;                console.log("Hey :"+temp+"      |    "+this.answer.text)

                }else{temp--;                console.log("Hey :"+temp+"    |    "+this.answer.text);
                }
            }
            return "aaa"
            
        };
    
        var qcmId=$stateParams.qcmId;
        this.helpers({
            qcms(){
                return Qcms.find({})
            },
            questions(){
                return Questions.find({qcm_id:qcmId})
            },
            answers(){
                console.log("$scope :"+ this.isCourse)
                return Answers.find({qcm_id:qcmId})

            },
            themes(){
                return Themes.find({})
            },
            modules(){
                console.log(Answers.find({qcm_id:qcmId}).fetch());
                var arrays=Answers.find({qcm_id:qcmId}).fetch()
                generate(qcmId,arrays);

                return Modules.find({})
            },
            isChecked(){
                console.log(this.myVar);
                return "ok"

            },
            jeTest(){
                var elements = document.getElementsByClassName('checkB');
            
                for(var a of elements){
                    console.log("bb "+a)

                }
                return elements;
            },
            loadd(){
            var elements=document.getElementsByClassName('statusAnswer');
            console.log("x : "+elements)

        },
            score(){
            return testScore

        }
            
        })
    
    
    }


}

function getTarget(val){
    if (val){
        console.log("CEST TRUE")
    }
    
}
var vall="";
function isNewQuestion(val){
    if (val!=this.vall){

        this.vall=val;
        return true
    } else return false;

}
 function generate(qcmId,arrays){
     "use strict";

     Array.from(document.getElementsByClassName("checkB")).forEach(function(item) {
         console.log(item);
     });
   
     var answers=Answers.find({qcm_id:qcmId}).fetch();
     var len=answers.length;
     var realLen=0;
var p=0;
     var allData=[];
        for( var x=0;x<=len;x++){
            realLen=Answers.find({qcm_id:qcmId}).fetch();
            allData.push(answers[x])
                console.log(answers[x]);
                console.log(len);
            
        }
        for( var y=0;y<=arrays.length;y++){
            p++;
                console.log(arrays[y]);
                console.log(len);
            
        }
     console.log("DATAS :"+allData);
     console.log("DATAS :"+p);

    }
 
var hasOwnProperty = Object.prototype.hasOwnProperty;
var elements=document.getElementsByClassName('checkB');

for (var element in elements){
    console.log($('LMYXDW7YANnuCtczk')[0]);
    console.log(element);

}
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export default angular.module('qcmDo', [

    angularMeteor

])

    .component('qcmDo', {

        templateUrl: template,

        controller:['$scope','$stateParams',QcmDoCtrl]

    });

