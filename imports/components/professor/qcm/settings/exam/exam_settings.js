
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './exam_settings.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '/imports/api/questions'
import {Qcms} from '/imports/api/qcms'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
class ExamSettingsCtrl{

    constructor($scope,$stateParams) {

        'ngInject';
        $scope.viewModel(this);
        var qcmId = $stateParams.qcmId;

        const questions = Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}});
        const questionsExam = Questions.find({qcm_id: qcmId,examen:true}, {sort: {createdAt: -1}});
        const answers = Answers.find({qcm_id: qcmId}, {sort: {created: -1}});
        const themes = Themes.find({});
        $('input').bind('keypress', function(e)
        {
            if(e.keyCode)
            {
                return false;
            }
        });
        this.autorun(()=>{
            var qcms = Qcms.findOne(qcmId);
            var penalty=0;
            var bonus=0;
            var numberOfExamQuestions=0;
            if(!!qcms){
                numberOfExamQuestions=qcms.numberOfExamQuestions;
                penalty=qcms.penalty;
                bonus=qcms.bonus;
            }
            $scope.qcm={
                maxQuestion:questions.count(),
                questionNumber:numberOfExamQuestions,
                penalty:penalty,
                bonus:bonus
            };

            $scope.numberOfExamQuestions=questionsExam.count();

            $scope.additionalQuestions=function(){
                return isPositiv(numberOfExamQuestions,$scope.numberOfExamQuestions);
            }

        });


        $scope.update=function(){
            var numberOfExamQuestion=$scope.qcm.questionNumber;
            var penalty=$scope.qcm.penalty;
            var bonus=$scope.qcm.bonus;
            Meteor.call('updateOption',qcmId,numberOfExamQuestion,penalty,bonus);

        };

        $scope.displayNumberOfQuestionsAdded=function(){
            $scope.numberOfQuestionsAdded=isEqual(this.qcm.questionNumber-$scope.numberOfExamQuestions);
        }
        this.helpers({
            questions(){
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

export default angular.module('examSettings', [

    angularMeteor,angularMeteor,angularBootstrap

])
    .component('examSettings',{
        templateUrl:template,
        controller:['$scope','$stateParams',ExamSettingsCtrl]
    })

