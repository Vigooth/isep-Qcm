
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import qcmList from '../imports/components/professor/qcm/list/qcmList'
import qcmStats from '../imports/components/professor/qcm/stats/qcm_stats'
import qcm_modify from '../imports/components/professor/qcm/modify/qcm_modify'
import qcmChoose from '../imports/components/student/qcm/choose/qcm_choose';
import qcmTraining from '../imports/components/student/qcm/training/qcm_training';
import qcmClassroom from '../imports/components/student/qcm/classroom/qcm_classroom';
import qcmExam from '../imports/components/student/qcm/exam/qcm_exam';
import home from '../imports/components/home/home';
import login from '../imports/components/register/login';
import logout from '../imports/components/register/logout';
import alert from '../imports/components/alert/alert';
import navbar from '../imports/components/register/navbar';
import qcm_add from '../imports/components/professor/qcm/add/qcm_add';
import listMytrainingQcm from '../imports/components/professor/qcm/list/training/training';
import ListMyClassroomQcm from '../imports/components/professor/qcm/list/classroom/classroom';
import myQcms from '../imports/components/professor/qcm/list/mQcms/myQcms';
import qcmSettings from '../imports/components/professor/qcm/settings/settings';
import classroom_settings from '../imports/components/professor/qcm/settings/classroom/classroom_settings';
import exam_settings from '../imports/components/professor/qcm/settings/exam/exam_settings'

import {Qcms} from '../imports/api/qcms';
import {Questions} from '../imports/api/questions';
import { Accounts } from 'meteor/accounts-base';


angular.module('isep-qcm', [
  angularMeteor,
    uiRouter,
    ngSanitize,
    navbar.name,
    logout.name,
    login.name,
    home.name,
    qcmList.name,
    qcmStats.name,
    qcm_modify.name,
    exam_settings.name,
    qcmChoose.name,
    qcmTraining.name,
    qcmClassroom.name,
    qcmExam.name,
    qcm_add.name,
    alert.name,
    myQcms.name,
    classroom_settings.name,
    qcmSettings.name,
    listMytrainingQcm.name,
    ListMyClassroomQcm.name
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
    'ngInject';

  $stateProvider
      .state('login',{
          url:"/login",
          templateUrl:login,
          template:'<login></login>',
          resolve: {
              currentUser($q,$meteor) {
                  $meteor.waitForUser();

                  if (Meteor.userId() === null) {
                      console.log("Je ne suis pas connecté")
                      return $q.resolve();
                  } else {
                      console.log("Je suis connecté")
                      console.log(Meteor.user())
                      return $q.resolve();
                  }
              },
              'currentUser': ['$meteor', function($meteor) {
                  $meteor.waitForUser();
                  console.log($meteor);

              }]
          }
      })
      .state('qcms',{
          url:"/isepQcm/prof/qcms",
        templateUrl:qcmList,
        template:'<qcms></qcms>'
      })
      .state('home',{
          url:"/isepQcm",
          templateUrl:home,
          template:'<home></home>'
     /*     controller:function($state,$stateParams){
              var userId=Meteor.userId()
              if (userId){
                  if(Meteor.user().profile.type=='eleve'){
                      $state.go('choose')
                  }else{$state.go('qcmList')}
                  console.log(Meteor.users.findOne({_id:userId}))
                  console.log($stateParams)

              }
          }*/
      })
      .state('qcms.list',{
          url:'/list',
        templateUrl:myQcms,
        template:'<my-qcms></my-qcms>'
      })
      .state('qcms.add',{
          url:'/new',
        templateUrl:qcm_add,
        template:'<qcm-add></qcm-add>'
      })
   
      .state('qcm_modify',{
          url:"/isepQcm/prof/qcms/:qcmId/modify",
          templateUrl:qcm_modify,
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]},
          template:'<qcm-modify></qcm-modify>'
      })

      .state('qcmSettings',{
          url:"/isepQcm/prof/qcms/:qcmId/settings",
          templateUrl:qcmSettings,
          params:
          {
              'qcmId':['$stateParams',function($stateParams){
                  return $stateParams.qcmId;
              }]
          },

          template:'<qcm-settings></qcm-settings>'
      })
      .state('qcmStats',{
          url:'/isepQcm/prof/qcms/:qcmId/stats/:statId',
          templateUrl:qcmStats,
          template:'<qcm-stats></qcm-stats>',
          params:{
              'qcmId':['$stateParams',function($stateParams){
                  return $stateParams.qcmId;
              }],
              'question':['$stateParams',function($stateParams){
                  return $stateParams.question;
              }]}

      })
      .state('qcmChoose',{
          url:"/isepQcm/prof/qcms/choose",
          templateUrl:qcmChoose,
          template:'<qcm-choose></qcm-choose>',
          controller:function($scope){
          },
          params:{
              'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }],
              'question':['$stateParams',function($stateParams){
              return $stateParams.question;
          }]}

      })
      .state('qcmTraining',{
          url:'/isepQcm/student/qcms/:qcmId/training/:question',
          templateUrl:qcmTraining,
          template:'<qcm-training></qcm-training>',
          controller:function($stateParams,$state){if(!($stateParams.question>0)){$state.go('qcmChoose')}}

      })
      .state('qcmClassroom',{
          url:'/isepQcm/student/qcms/:qcmId/classroom/:question',
          templateUrl:qcmClassroom,
          template:'<qcm-classroom></qcm-classroom>',
          params:{
              'bonsoir':['$http','$stateParams',function($http,$stateParams){
                  console.log($stateParams.qcmId)
                  return $stateParams}]
          },
          controller:function($scope,$stateParams,$state){
              var qcmId=$stateParams.qcmId;
              var qcm=Questions.find({qcm_id:qcmId});
              $scope.teston=qcm.count();
              console.log(qcm.count())
              //if(((qcmNotFound)||($stateParams.question!=qcm.numberOfExamQuestions))){$state.go('choose')}
          },
          resolve:{
              'test':function($stateParams){
                  console.log($stateParams)
                  //console.log(Qcms.findOne({$stateParams}))
                  
                  return $stateParams
              }
          }

      })
.state('qcmExam',{
        url:"/qcms/:qcmId/exam/:question?bonus&penalty",
        templateUrl:qcmExam,
        template:'<qcm-exam></qcm-exam>',
    controller:function($scope,$stateParams,$state){
        var qcmId=$stateParams.qcmId;
        var qcm=Qcms.findOne({_id:qcmId});
        var qcmNotFound=!qcm;              console.log(qcm)

        //if(((qcmNotFound)||($stateParams.question!=qcm.numberOfExamQuestions))){$state.go('choose')}
        }


});
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login')
}