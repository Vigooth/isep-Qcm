
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './classTest.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '../../../api/questions'
import {Qcms} from '../../../api/qcms'
import {Answers} from '../../../api/answers'
import {Themes} from '../../../api/themes'
class ClassTestCtrl{

    constructor($scope,$stateParams) {

        'ngInject';
        $scope.viewModel(this);
        var qcmId = $stateParams.qcmId;

        const questions = Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}});
        const questionsExam = Questions.find({qcm_id: qcmId,examen:true}, {sort: {createdAt: -1}});
        const answers = Answers.find({qcm_id: qcmId}, {sort: {created: -1}});
        const themes = Themes.find({});
        this.autorun(()=>{
            var qcms = Qcms.findOne(qcmId);
            var duration=0;
            var password="";
            if(!!qcms){
                duration=qcms.settings.duration;
                 password=qcms.settings.password||""
            }
            $scope.settings={
                duration:duration,
                password:password
            };

            $scope.numberOfExamQuestions=questionsExam.count();
            

        });

        console.log(Meteor.user());
        $scope.update=function(){
            var duration=$scope.settings.duration;
            var password=$scope.settings.password;
            Meteor.call('updateSettings',qcmId,duration,password,questions.count());

        };
        $scope.startTest=function(){
            console.log(questions.fetch())
            Meteor.call('startQcm',qcmId);

        };


        this.helpers({
            questions(){
                var qcms = Qcms.find(qcmId);
                if(!!qcms){   console.log(qcms)
                }


                return questions
            },
            answers(){
                return answers
            },
            themes(){
                return themes
            }

        });
        function isEqual(numberOfQuestionsAdded){
            if(numberOfQuestionsAdded<=0){numberOfQuestionsAdded=0}
            var staticString="Pour atteindre le nombre de questions demandé, "+numberOfQuestionsAdded;
            var variableString=" questions d'entrainement seront ajoutées.";
            if (numberOfQuestionsAdded==1){variableString=" question d'entrainement sera ajoutée."}

            return staticString+variableString}
        function isPositiv(a,b){
            var c=a-b;
            console.log((c<=0));
            return !(c<=0)
        }
    }
}

export default angular.module('classTest', [

    angularMeteor,angularMeteor,angularBootstrap

])
    .component('classTest',{
        templateUrl:template,
        controller:['$scope','$stateParams',ClassTestCtrl]
    })

