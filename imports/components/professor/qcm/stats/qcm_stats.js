
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './qcm_stats.html'
import angularBootstrap from 'angular-ui-bootstrap';
import angularChart from 'angular-chart.js';
import _ from 'lodash';

import {Questions} from '/imports/api/questions'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
import {Stats} from '/imports/api/stats'

class QcmStatsCtrl{

    constructor($scope,$stateParams, $state) {
        'ngInject';
        $scope.viewModel(this);

        var qcmId = $stateParams.qcmId;
        var statId = $stateParams.statId;
        var stats=Stats.findOne({_id:statId});
        const questions = Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}});
        const answers = Answers.find({qcm_id: qcmId}, {sort: {created: -1}});
        const themes = Themes.find({});
        $scope.removeStatBtn=false;
        $scope.hide_btnRemoveStat=function(){
            this.removeStatBtn=false;
        };
        $scope.show_btnRemoveStat=function() {
            this.removeStatBtn = true;
        };
        $scope.goToThisStat=function(){
            $state.go('qcmStats',{qcm_id:qcmId,statId:this.stat._id})
        };
        $scope.removeStat=function(){
            Meteor.call('removeStat',this.stat._id)
        };

        this.autorun(()=>{
            $scope.labels= getLabels(questions.count());
            var data=[];
            var restricted_id=[];
            var questionsFetched=questions.fetch();
            if(!!stats){
                for(var index in questionsFetched){
                    var question_id=questionsFetched[index]._id;
                    if(stats[question_id]){
                        var nb_success=stats[question_id].nb_success;
                        var total=stats[question_id].total;
                        var pourcentage=0;
                        pourcentage=Math.round(nb_success*(100/total))
                        data.push(pourcentage)
                        restricted_id.push(true);
                    }else{restricted_id.push(false)}

                }
            }
            $scope.data=[data]
            $scope.datas=data;
            console.log(restricted_id)

            $scope.restricted_id=restricted_id;

        });
        $scope.getData=function(index){
            this.success_rate=this.datas[index]
        };
        $scope.setColor=function(success_rate){
            var color="warning"
            if(success_rate<30){color="danger"}
            if(success_rate>70){color="success"}
            return color

        };
        function getLabels(nb_total_labels){
            var array=[];
            for(var i=1;i<=nb_total_labels;i++){
                array.push(i)
            }
            return array
        }
        $scope.series = ['Essai 1'];

        $scope.colors= ['#d82727','#c9c7f9'];
        $scope.options ={
            fontColor:'#27d835',
            elements: { rectangle: {
                borderWidth: 5,
            }},
            scales: {
                xAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: '% réussite',
                        fontSize:15
                    },
                    gridLines:{
                        //color:"#27d835",
                        zeroLineColor:"#000000",
                        borderDash:[0,0]
                    },
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 25
                    },
                    barThickness: 2
                }],
                yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: 'Questions',
                        fontSize:15
                    },
                    gridLines:{display:false,
                        //color:"#27d835",
                        zeroLineColor:"#000000",
                        borderDash:[0,0]
                    },
                    barThickness: 5,
                    ticks: {
                        //fontSize:9,
                        labelOffset:100,
                        max: $scope.datas.length,
                        min: 0,
                        stepSize: 0.5
                    }
                }]
            }};
        $scope.index=0;
        $scope.check=function($index) {
            var val=$scope.restricted_id[$index];
            var a=0;
            for(var index=0;index<=$index;index++){
                if($scope.restricted_id[index]==false){
                    a++;
                }
            }
            this.success_ratee=this.datas[$index-a];
            this.index=$index-a+1;
            return val
        };
        $scope.formatDate=function(){
            console.log(this.stat)
            this.stat.createdAt=moment(this.stat.createdAt).format('lll')

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
            },
            stats(){
                return Stats.find({qcm_id:qcmId})
            }

        });

    }}

export default angular.module('qcmStats', [

    angularMeteor,angularMeteor,angularChart


])  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#8f8bed','#c9c7f9'],
        responsive: true,
        defaultFontSize:2,
        defaultFontColor:'#f20707'

    });
    ChartJsProvider.setOptions('line', {
        showLines: true,
        showBars: true,
        defaultFontSize:2,
        defaultFontColor:'#f20707',
        barValueSpacing : 70,
        barDatasetSpacing : 30

    });
    // Configure all line charts
    ChartJsProvider.setOptions('QcmStats', {
        datasetFill: false,
        barShowStroke: false,
        scaleShowGridLines : false,
        barValueSpacing : 70,
        barDatasetSpacing : 30
    });
}])
    .component('qcmStats',{
        templateUrl:template,
        controller:['$scope','$stateParams','$state',QcmStatsCtrl]
    });

