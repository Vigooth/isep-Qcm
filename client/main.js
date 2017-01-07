
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmStats from '../imports/components/professor/qcmStats/qcmStats'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'
import qcmCreateExam from '../imports/components/professor/qcmCreateExam/qcmCreateExam'
import qcmChoose from '../imports/components/student/qcmChoose/qcmChoose';
import qcmTraining from '../imports/components/student/qcmTraining/qcmTraining';
import qcmClassroom from '../imports/components/student/qcmClassroom/qcmClassroom';
import qcmExam from '../imports/components/student/qcmExam/qcmExam';
import home from '../imports/components/home/home';
import login from '../imports/components/register/login';
import logout from '../imports/components/register/logout';
import navbar from '../imports/components/register/navbar';
import create from '../imports/components/professor/qcm/create/create';
import listMytrainingQcm from '../imports/components/professor/qcm/myQcms/list/training/training';
import ListMyClassroomQcm from '../imports/components/professor/qcm/myQcms/list/classroom/classroom';
import myQcms from '../imports/components/professor/qcm/myQcms/myQcms';
import qcmSettings from '../imports/components/professor/qcm/settings/settings';
import classTest from '../imports/components/professor/classTest/classTest';
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
    qcmCreate.name,
    qcmCreateExam.name,
    qcmChoose.name,
    qcmTraining.name,
    qcmClassroom.name,
    qcmExam.name,
    create.name,
    myQcms.name,
    classTest.name,
    qcmSettings.name,
    listMytrainingQcm.name,
    ListMyClassroomQcm.name
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
    'ngInject';
    var currentUserResolver = [
        'UserSession',
        function(UserSession) {
            return UserSession.currentUserPromise();
        }
    ];
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
      .state('qcmList',{
        templateUrl:qcmList,
        template:'<qcm-list></qcm-list>',
          controller:function($state,$stateParams){
     console.log($stateParams)
      }})
      .state('home',{
          url:"/",
          templateUrl:home,
          template:'<home></home>'
     /*     controller:function($state,$stateParams){
              var userId=Meteor.userId()
              if (userId){
                  if(Meteor.user().profile.type=='eleve'){
                      $state.go('qcmChoose')
                  }else{$state.go('qcmList')}
                  console.log(Meteor.users.findOne({_id:userId}))
                  console.log($stateParams)

              }
          }*/
      })
      .state('myQcms',{
        templateUrl:myQcms,
        template:'<my-qcms></my-qcms>'
      })
      .state('classTest',{
        templateUrl:classTest,
        template:'<class-test></class-test>'
      })
      .state('create',{
        templateUrl:create,
        template:'<create></create>'
      })
   
      .state('qcmCreate',{
          url:"/qcm/:qcmId",
          templateUrl:qcmCreate,
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]},
          template:'<qcm-create></qcm-create>'
      })

      .state('qcmCreateExam',{
          url:"/qcm/exam/:qcmId",
          templateUrl:qcmCreateExam,
          params:
          {
              'qcmId':['$stateParams',function($stateParams){
                  return $stateParams.qcmId;
              }]
          },
       
          template:'<qcm-create-exam></qcm-create-exam>'
      })
      .state('qcmSettings',{
          url:"/qcm/settings/:qcmId",
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
          url:'/qcm/stats/:qcmId',
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
          url:'/qcms/training/:qcmId/:question',
          templateUrl:qcmTraining,
          template:'<qcm-training></qcm-training>',
          controller:function($stateParams,$state){if(!($stateParams.question>0)){$state.go('qcmChoose')}}

      })
      .state('qcmClassroom',{
          url:'/qcms/classroom/:qcmId/:question',
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
              //if(((qcmNotFound)||($stateParams.question!=qcm.numberOfExamQuestions))){$state.go('qcmChoose')}
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
        url:"/qcms/exam/:qcmId/:question?bonus&penalty",
        templateUrl:qcmExam,
        template:'<qcm-exam></qcm-exam>',
    controller:function($scope,$stateParams,$state){
        var qcmId=$stateParams.qcmId;
        var qcm=Qcms.findOne({_id:qcmId});
        var qcmNotFound=!qcm;              console.log(qcm)

        //if(((qcmNotFound)||($stateParams.question!=qcm.numberOfExamQuestions))){$state.go('qcmChoose')}
        }


});
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login')
}