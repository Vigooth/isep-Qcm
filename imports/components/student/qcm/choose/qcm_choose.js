
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcm_choose.html';

import {Qcms} from '/imports/api/qcms'
import {Modules} from '/imports/api/modules'
import {Themes} from '/imports/api/themes'
import {Questions} from '/imports/api/questions'

class QcmChooseCtrl {

    constructor($scope,$reactive,$state,$meteor) {
        
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        this.subscribe('themes');
        this.subscribe('modules');
        console.log(Themes.findOne({}))
        console.log($scope.subscribe('themes'))
        $scope.$meteorSubscribe('themes')
        console.log(console.log(Themes.find({}).fetch()))
 
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
                question_nb=Questions.find({qcm_id:id}).count();
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
            var state="";
            var params={};
            if(this.mode==='training'){
                state='qcmTraining';
                params={qcmId:id,question:questionLimit};}
            if(this.mode==='exam'){
                state='qcmExam';
                params={qcmId:id};}
            if(this.mode==='classroom'){
                var quizz= prompt("Mot de passe: ");
                if(quizz!=null){
                    state='qcmClassroom';
                    params={qcmId:id}}}
            setTimeout(function () {
                $state.go(state,params)


            }, 500);

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
        $scope.evalMode=function(){
            var bool=false;
            if(this.mode=='classroom'&&this.qcm.status=="open"){bool=true}
            if((this.mode!='classroom')&&this.qcm.type=='training'){bool=true}
            return bool
        }
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

        controller:['$scope','$reactive','$state','$meteor',QcmChooseCtrl]

    });

