
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './qcm_modify.html'
import angularBootstrap from 'angular-ui-bootstrap';


import {Questions} from '/imports/api/questions'
import {Prof} from '/imports/api/methods/professor/professor'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
import {Qcms} from '/imports/api/qcms'
class QcmModifyCtrl{
    constructor($scope,$stateParams) {
        'ngInject';
        $scope.viewModel(this);
        var qcmId = $stateParams.qcmId;
const qcm=Qcms.findOne({_id:qcmId});
        //Meteor.call('updateQuestion',{qcm_id:qcmId},{$set:{createdBy:Meteor.user().profile.email}})
        //Questions.update({qcm_id:qcmId},{$set:{createdBy:Meteor.user().profile.email}})
        const questions=Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}});
        const answers=Answers.find({qcm_id: qcmId}, {sort: {created: -1}});
        const themes=Themes.find({});
        console.log(Prof.getQcms(qcmId))
        console.log(Prof.getMyQcms(Meteor.user().profile.email))
        $scope.importQuestion=function(){
            var importQuestions=this.question.import;
            importQuestions.forEach(function(question_id) {
                Meteor.call('importQuestion',question_id,qcmId)
            });
        };
        this.helpers({
            qcms(){
                return Qcms.findOne({_id:qcmId})
            },
            questions(){
                return questions
            },
            importQuestions(){
                return  Questions.find({qcm_id:{$not:qcmId},createdBy:Meteor.user().profile.email})
            },
            answers(){
                return answers
            },
            themes(){
                return themes
            }

        });
        $scope.sortedBy = {
            options: [
                {name:'examen',value:'true'},
                {name:'entrainement',value:'false'},
                {name:'tous',value:''}
            ],
            selected:{name:'tous',value:''} //This sets the default value of the select in the ui
        };
        $scope.qcm={
            text:this.qcms.text
        };
        $scope.setQcmTitle=function(){
            var text=$scope.qcm.text;
            Meteor.call('qcm_setTitle',qcmId,text
            );
        };

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
                createdBy:Meteor.user().profile.email,
                help:"",
                explanation:"",
                difficulty:"1"
            });
            this.$ctrl.text='';
        };
        $scope.addHelp=function(){
            var text=$scope.$ctrl.help;
            Meteor.call('insertHelp',this.question._id,text
            );
        };
        $scope.getHelp = function(){
            $scope.$ctrl.help=this.question.help;
        } ;
        $scope.addExplanation=function(){
            var text=$scope.$ctrl.explanation;
            Meteor.call('insertExplanation',this.question._id,text
            );
        };
        $scope.getExplanation = function(){
            $scope.$ctrl.explanation=this.question.explanation;
        } ;
        $scope.setStatus=function(){
            Meteor.call('setAnswerStatus',this.answer._id,this.answer.status);
        };
        $scope.setExamStatus=function(){
            Meteor.call('setExamStatus',this.question._id,this.question.examen);
        };
        $scope.isAnswerTrue=function(){
            if(this.answer.status){
                return "alert-success"
            }
            //return this.answer.status;
        };
        $scope.isExamQuestion=function(){
            if(this.question.examen){
                return "alert-danger"

            }
            //return this.answer.status;
        };
        //-----Indicates the difficulty of the question
        $scope.rate = 1;
        $scope.max = 3;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.getDifficulty=function(){
            this.rate=this.question.difficulty||1;
        };
     //--------------------------------------------------
        $scope.ratee=function(){
            Meteor.call('insertDifficulty',this.question._id,this.rate);
        };

        this.qcm={};
    }

}

export default angular.module('qcmModify', [

    angularMeteor,angularMeteor

])
    .component('qcmModify',{
        templateUrl:template,
        controller:['$scope','$stateParams',QcmModifyCtrl]
    })

