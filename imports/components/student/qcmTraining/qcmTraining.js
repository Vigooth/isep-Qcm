
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
        initialisationQcmscore();
        var generateArray=[];
        generateMyArray();
        this.autorun(()=>{
        });
        //step1:[ [1,[]],[2,[]],[3[]],... ]
        //step2:{1:[],2:[],3:[],... }
        //step3:{1:[[26,false],[27,false],..],2:.. } ->{1:[[26,{"correct_answer":true ,"user_answer":false}],[27,{..}],..],2:... }
        //lastStep:{1:{26:false, 27:false}},2:...} ->{1:{26:{"correct_answer":true ,"user_answer":false},{27:{..},..},2:... }
        $scope.generateArray=function(indexQuestion,indexReponse,correct_answer){
            //generateArray[indexQuestion+1].push([indexReponse,false]);//step3:{1:[[26,false],[27,false],..],2:... }
            generateArray[indexQuestion+1].push([indexReponse,{"correct_answer":correct_answer ,"user_answer":false}]);};
         var first=true;
        $scope.checkBoxValue=function(indexQuestion,indexReponse,db_answerStatus) {
            console.log(scoreBeforeEvent);
            //var a={1:{26:{"user_answer":false ,"db_Answer":true},27:false}};

            if (first) {
                lastStep(generateArray)

            }//lastStep:{1:{26:false, 27:false}},2:...}
            first = false;
            console.log("-------------------"+db_answerStatus);

            generateArray[indexQuestion + 1][indexReponse].user_answer = this.myVar;
            var issquestiontrue=true;

            for(var reponse=1;reponse<=_.keys(generateArray[indexQuestion + 1]).length;reponse++){
                issquestiontrue=((issquestiontrue)&&(generateArray[indexQuestion + 1][indexReponse].user_answer==generateArray[indexQuestion + 1][indexReponse].correct_answer));
            }
            scoreBeforeEvent[indexQuestion]=issquestiontrue;

            console.log("---------LA QUESTION "+indexQuestion+1+" est "+issquestiontrue);
            console.log(scoreBeforeEvent);

        };
$scope.getQuestions=function(a){
    array.push(a);
};
        //step1:[ [1,[]],[2,[]],[3[]],... ]
function generateMyArray(){
    for (var i=1;i<=numberOfQuestions;i++){
        generateArray.push([i,[]]);
    }

    generateArray=_.fromPairs(generateArray);//step2:{1:[],2:[],3:[],... }
}
function lastStep(){
    for (var i=1;i<=numberOfQuestions;i++){
        generateArray[i]=_.fromPairs(generateArray[i]);
    }
}

        this.helpers({
        
            tests: () => _.shuffle(Questions.find({qcm_id:qcmId,examen:false}, { limit :numberOfQuestions}).fetch())
    ,
            questions: () =>{
                random=_.random(0, questions.count()-numberOfQuestions);
                randomlySorted=[-1,1][_.random()];
                return Questions.find({qcm_id:qcmId,examen:false}, { sort:{qcm_id:randomlySorted}, skip :random,limit:numberOfQuestions});
            },
    
          answers:()=>{ return Answers.find({qcm_id:qcmId})}

        });
        function initialisationQcmscore(){
            var array=[];
            //console.log(numberOfQuestions);
            for (var i=1;i<=numberOfQuestions;i++){
                array.push(false);
            }
            scoreBeforeEvent=array;

        }


    }



}



export default angular.module('qcmTraining', [

    angularMeteor,angularBootstrap

])

    .component('qcmTraining', {

        templateUrl: template,

        controller:['$scope','$reactive','$state','$stateParams',QcmTrainingCtrl]

    });

