
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmStats from '../imports/components/professor/qcmStats/qcmStats'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'
import qcmCreateExam from '../imports/components/professor/qcmCreateExam/qcmCreateExam'
import qcmChoose from '../imports/components/student/qcmChoose/qcmChoose';
import qcmTraining from '../imports/components/student/qcmTraining/qcmTraining';
import qcmClassroom from '../imports/components/student/qcmClassroom/qcmClassroom';
import qcmExam from '../imports/components/student/qcmExam/qcmExam';
import login from '../imports/components/register/login';
import logout from '../imports/components/register/logout';
import create from '../imports/components/professor/qcm/create/create';
import myQcms from '../imports/components/professor/qcm/myQcms/myQcms';
import qcmSettings from '../imports/components/professor/qcm/settings/settings';
import classTest from '../imports/components/professor/classTest/classTest';
import uiRouter from 'angular-ui-router';
import {Qcms} from '../imports/api/qcms';
import {Questions} from '../imports/api/questions';


angular.module('isep-qcm', [
  angularMeteor,
    uiRouter,
    ngSanitize,
    qcmList.name,
    qcmStats.name,
    qcmCreate.name,
    qcmCreateExam.name,
    qcmChoose.name,
    qcmTraining.name,
    qcmClassroom.name,
    qcmExam.name,
    login.name,
    create.name,
    myQcms.name,
    classTest.name,
    qcmSettings.name,
    logout.name
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
    'ngInject';
  $stateProvider
      
      .state('qcmList',{
        url:"/qcm",
        templateUrl:qcmList,
        template:'<qcm-list></qcm-list>',
          controller:function($state){
             if (Meteor.userId()){}else{$state.go('qcmChoose')}
          }
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
                      return $q.resolve();
                  }
              },
              'currenttUser': ['$meteor', function($meteor) {
                  $meteor.waitForUser();
                  console.log($meteor);

              }]
          }
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
          url:"/qcms",
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
  $urlRouterProvider.otherwise('/qcm')
}