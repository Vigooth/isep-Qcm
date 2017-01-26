
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './classroom_settings.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '/imports/api/questions'
import {Qcms} from '/imports/api/qcms'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
class ClassroomSettingsCtrl{

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
        $scope.update=function(){
            var duration=$scope.settings.duration;
            var password=$scope.settings.password;
            Meteor.call('updateSettings',qcmId,duration,password,questions.count());

        };


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
    }
}

export default angular.module('classroomSettings', [

    angularMeteor,angularMeteor,angularBootstrap

])
    .component('classroomSettings',{
        templateUrl:template,
        controller:['$scope','$stateParams',ClassroomSettingsCtrl]
    })

