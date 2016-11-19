
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

        $scope.generateArray=function(indexQuestion,indexReponse){
            generateArray[indexQuestion+1].push([indexReponse,false]);//step3:{1:[[26,false],[27,false],..],2:... }
         };
         var first=true;

        $scope.checkBoxValue=function(indexQuestion,indexReponse) {
            if (first) {
                lastStep(generateArray)
            }//lastStep:{1:{26:false 27:false}},2:...}
            first = false;
            generateArray[indexQuestion + 1][indexReponse] = this.myVar;
            //console.log(generateArray[indexQuestion + 1][indexReponse]);
            //console.log(generateArray[1][0]);
            for (var i=1;i<=numberOfQuestions;i++) {

                console.log(generateArray[1][2]);
                console.log(generateArray);
                console.log(generateArray[2][3]);
                //for(var x=0;x<_.keys(generateArray[i]).length;x++){
                  //  console.log(i);
                    //console.log(generateArray[i])
                //}
            }

        };
$scope.getQuestions=function(a){
    array.push(a);
};
        
function generateMyArray(){
    for (var i=1;i<=numberOfQuestions;i++){
        generateArray.push([i,[]]);
    }    //step1:[ [1,[]],[2,[]],[3[]],... ]

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

