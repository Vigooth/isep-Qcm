
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcmCreate.html'
import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers'
import {Themes} from '../../../api/themes'
class QcmCreateCtrl{
    constructor($scope,$stateParams) {
        $scope.viewModel(this);
        var x = 0;
        var qcmId = $stateParams.qcmId;
        this.helpers({
            questions(){
                return Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}})
            },
            answers(){
                return Answers.find({qcm_id: qcmId}, {sort: {created: -1}})
            },
            themes(){
                return Themes.find({})
            }

        });
        $scope.insertAnswer = function (question) {
            var text = $scope.$ctrl.answer;
            Meteor.call('insertAnswer', {
                question_id: question._id,
                qcm_id: question.qcm_id,
                text: text,
                status: false,
                createdAt: new Date
            });
            this.$ctrl.answer = '';
        };
        $scope.removeAnswer = function () {
            Meteor.call('removeAnswer', this.answer._id);
            x++;
            console.log(x)
        };
        $scope.removeQuestion = function () {
            Meteor.call('removeQuestion', this.question._id);
        };
        $scope.addQuestion=function(){
            var text=$scope.$ctrl.text;
            Meteor.call('insertQuestion',{
                qcm_id:$stateParams.qcmId,
                text:text,
                examen:false,
                createdAt:new Date,
                createdBy:"Prof"
            });
            this.$ctrl.text='';
        };
        $scope.setStatus=function(){
            Meteor.call('setAnswerStatus',this.answer._id,this.answer.status);
        };
        $scope.isAnswerTrue=function(){
            if(this.answer.status){
                return "alert-success"

            }
            //return this.answer.status;
        }
        this.qcm={};
    }
    
}

export default angular.module('qcmCreate', [

    angularMeteor

])
    .component('qcmCreate',{
        templateUrl:template,
        controller:['$scope','$stateParams',QcmCreateCtrl]
    })

