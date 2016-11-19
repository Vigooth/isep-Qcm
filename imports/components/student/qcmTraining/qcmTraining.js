
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
        console.log(scoreBeforeEvent);
        //const questions=Questions.find({qcm_id:qcmId,examen:false}, { limit :numberOfQuestions});
        //var questionsCounted;
 console.log(numberOfQuestions);
        var $question=1
        var arrayTest={1:{},2:{}};
        console.log(arrayTest);
        var a=[
            [1,[['23',true],['2',false]]],
            [2,[['23',true],['2',false]]],
            [3,[['23',true],['2',false]]]
        ];
        console.log(a[0][1]);
        a[0][1].push([23,false]);
        console.log(a[1]);
        console.log(a[1][1]);
        console.log(a[2][1]);
        a=_.fromPairs(a);
        
        console.log(a);
        console.log(_.fromPairs(a[1])[23]);
        
        var questionETreponse= {
            1:{1:true,2:false,3:false},
            2:{4:false,5:true,6:true}}
        console.log(questionETreponse);
        console.log(questionETreponse[1][2])
        var generateArray=[];
        generateMyArray();
        //generateArray=_.fromPairs(generateArray);

        //generateArray=_.fromPairs(generateArray)
        //console.log(generateArray[0][0][1].push([1,false]));
        //console.log(generateArray[0][0][1].push([2,true]));
        //console.log(generateArray[0][0][1]);
        console.log(generateArray)

        $scope.generateArray=function(indexQuestion,indexReponse){
            generateArray[indexQuestion][0][1].push([indexReponse,false]);
            console.log(generateArray)
             //generateArray[indexQuestion][0][0][1].push([indexReponse,false]);
             //generateArray[0][1].push([indexReponse,false]);
                //generateArray[indexQuestion][1].push([indexReponse,false]);



         };
        $scope.checkBoxValue=function(indexQuestion,indexReponse){
            //generateArray=_.fromPairs(generateArray[indexQuestion][0][1]);
            console.log(generateArray)
            console.log(indexQuestion);
            console.log(indexReponse);
            
            _.fromPairs(generateArray[indexQuestion][0][1])[indexReponse]="ok";
            console.log(_.fromPairs(generateArray[indexQuestion][0][1]));
            console.log(this.myVar)
        }
$scope.getQuestions=function(a){
    array.push(a);
};
        
function generateMyArray(){
    for (var i=1;i<=numberOfQuestions;i++){
        generateArray.push([[i,[]]]);
        //exemple:[1,[]]
    }
}
  

;
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

