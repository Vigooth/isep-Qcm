
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from '../qcmChoose/qcmChoose.html';


import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'
import {Questions} from '../../../api/questions'

class QcmChooseCtrl {

    constructor($scope,$reactive,$state) {
        
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        var id="";
        var questions=Questions.find({});
        $scope.mode='training';

        $scope.openModal=function(qcmId) {
            id=qcmId;
            var numberOfExamQuestions=Qcms.findOne({_id:id}).numberOfExamQuestions;
            var penalty=Qcms.findOne({_id:id}).penalty;
            var bonus=Qcms.findOne({_id:id}).bonus;
            if(this.mode==='exam'){
                $state.go('qcmExam',{qcmId:qcmId,question:numberOfExamQuestions,bonus:bonus,penalty:penalty});
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)

            }
            if(this.mode==='classroom'){
                var a=Qcms.findOne({_id:id}).settings.password;
                var question_nb=Qcms.findOne({_id:id}).questions.number;
                var quizz= prompt("Mot de passe: ");
                if(quizz==a){
                    Meteor.call('saveAuthorizeUser',id,Meteor.user().profile.email)
                    $state.go('qcmClassroom',{qcmId:id,question:question_nb})

                }
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)
            }
            if(this.mode==='training'){
                $(document).ready(function () {
                    $("#numberOfquestion").modal("show");
                });
            }
           
        };
        $scope.goToDoQcmPage=function(){
            var questionLimit=this.$ctrl.numberOfQuestions;
            if(this.mode==='training'){
                $(location).attr('href',"qcms/"+this.mode+"/"+id+"/"+questionLimit)
            };
            if(this.mode==='exam'){
                $state.go('qcmExam',{qcmId:id})
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)
            }
            if(this.mode==='classroom'){
                var quizz= prompt("Mot de passe: ");
                if(quizz!=null){
                    $state.go('qcmClassroom',{qcmId:id})

                }
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)
            }
        };
        $scope.range = function() {
            var isExam=this.mode=="exam";
            var max=Questions.find({qcm_id:id,examen:isExam}).count();
            var array = [];
            for (var i = 1; i <= max; i ++) {
                array.push(i);
            }
            return array;
        };
 
            $scope.validate=function(){
                
                this.numberOfQuestionsEntered=true;
            };

        $scope.numberOfQuestionsEntered=false;
        this.helpers({
          
            questions(){
                return questions
            },

            qcms(){
                    return Qcms.find({})

            },
            returnIdmodulee(){
                return Qcms.find({})

        },
            modules(){
                return Modules.find({})
            },
            themes(){
                return Themes.find({})
            }

        })

    }


}



export default angular.module('qcmChoose', [

    angularMeteor
])

    .component('qcmChoose', {

        templateUrl: template,

        controller:['$scope','$reactive','$state','$stateParams',QcmChooseCtrl]

    });

