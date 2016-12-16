(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngTouch',
    'ngAnimate',
    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ]).controller('HomeCtrl',function($scope){

  })
    .controller('CalendarCtrl', function($scope,getDateDataAPIService,$timeout,$window,displayModeService,preferencesStorageService) {

      preferencesStorageService.retrieveFromLocalStorage.facility();
      preferencesStorageService.retrieveFromLocalStorage.service();
      preferencesStorageService.retrieveFromLocalStorage.standby();
      preferencesStorageService.retrieveFromLocalStorage.roboblocks();

      $scope.display = {
        width:displayModeService.detectSize().width,
        orientation:displayModeService.detectOrientation()?"landscape":"portrait",
        landscapeView:function(){
          return displayModeService.detectOrientation();
        },
        mode:{
          orientation:displayModeService.detectOrientation(),
        },
        class:displayModeService.detectOrientation()?'landscape':'portrait',
      };

      $scope.day = moment();

      //this is where all the data goes
      $scope.data = {};
      $scope.data = {
        selectedDate:moment(),
        //selectedDate.capBooked = 0;
        dailyMetricsList:[
          // WARNING -- CAP BOOKED VALUE IS OVER WRITTEN IN DAILY METRICS DIRECTIVE!!!!
          {responseId:'cap_booked',label:'Capacity Booked',percent:true,icon:"orc-folder",class:"flex-2x",order:0},
          {responseId:'booked_case_count',label:'Booked Cases',percent:false,icon:"orc-folder",class:"",order:9},
          {responseId:'booked_start',label:'Booked Starts',percent:false,icon:"orc-folder",class:"",order:10},
          {responseId:'actual_case_count',label:'Actual Cases',percent:false,icon:"orc-folder",class:"",order:3},
          {responseId:'tot_staff_mins',label:'Staffed Mins',percent:false,icon:"orc-users",class:"",order:4},
          {responseId:'tot_booked_mins',label:'Booked Mins',percent:false,icon:"orc-clock",class:"",order:5},
          {responseId:'actual_start_pat_in',label:'On-Time Starts ("Patient in Room")',percent:false,icon:"orc-clock",class:"",order:6},
          {responseId:'tot_actual_mins',label:'Actual Mins',percent:false,icon:"orc-clock",class:"",order:7},
          {responseId:'tot_turnover_mins',label:'Turnover Mins',percent:false,icon:"orc-clock",class:"",order:8},
          {responseId:'actual_percentage',label:'Actual vs Staffed',percent:true,icon:"",class:"",order:1},
          {responseId:'percent_pat_in',label:'% of On-Time Starts ("Patient in Room")',percent:true,icon:"",class:"",order:2},
          {responseId:'avg_pat_turnover_time',label:'Avg Turnover Mins',percent:false,icon:"orc-clock",class:"",order:11},
          {responseId:'first_case_wasted_mins',label:'On-Time Start Delay Mins',percent:false,icon:"orc-clock",class:"",order:12}
        ],
        roomsRunningChart:{}
      };


      //TODO display info to be migrated into data object
      //$scope.data.selectedDate = $scope.day;
      $scope.data.selectedDate.capBooked = 0;

      $scope.selectedDate = moment();

      //this is static params for SVGs
      $scope.svgData = {
        calendar:{
          //TODO migrate from array to circleparams object
          circles:[
            {'x': 200, 'y': 200, 'r':200,'fill':"#dddcd2",'stroke':"#dddcd2",'strokewidth':"0"},
            {'x': 200, 'y': 200, 'r':160,'fill':"#ffffff",'stroke':"#dddcd2",'strokewidth':"0"},
          ],
          circleParams:{
            'line':{'x': 200, 'y': 200, 'r':200,'fill':"#dddcd2",'stroke':"#dddcd2",'strokewidth':"0"},
            'white':{'x': 200, 'y': 200, 'r':160,'fill':"#ffffff",'stroke':"#dddcd2",'strokewidth':"0"}
          },
          pathData:{'r':400},
          textData:{'x': '50%','y': '50%'},
        },
        dailyMetricData:{
          roomsRunningChart:{
            graph:{'width':100, 'height':100},
            //TODO migrate from array to circleparams object
            circles:[
              {'x': 200, 'y': 200, 'r':200,'fill':"#dddcd2",'stroke':"#dddcd2",'strokewidth':"0"},
              {'x': 200, 'y': 200, 'r':160,'fill':"#ffffff",'stroke':"#dddcd2",'strokewidth':"0"}
            ],
            circleParams:{
              'line':{'x': 200, 'y': 200, 'r':200,'fill':"#dddcd2",'stroke':"#dddcd2",'strokewidth':"0"},
              'white':{'x': 200, 'y': 200, 'r':160,'fill':"#ffffff",'stroke':"#dddcd2",'strokewidth':"0"},
            },
            chartTopPadding:5,
            gridIncrement:5.5,
            gTransform:displayModeService.detectWide()?"scale(1.5,1.5) translate(10,-50)":"scale(1,1.5) translate(10,-50)",
            gridSVGWidth:displayModeService.detectElementSize("roomsrunning").width + "px",
            lineStyle:"stroke:#04AA35;stroke-width:6",
            lineTextSize:10,
            lineLabelSize:10,
            lineLabelTransform:"rotate(90)",
            //for portrait mode
            rectangleWidth:displayModeService.detectElementSize("roomsrunning").width + 'px',
            staffLine:{
              style:"fill:none;stroke:#da291c;stroke-width:3;height:180px",
              points:'0,180 ',
            },
          },
          pathData:{'r':400},
          textData:{'x': '50%','y': '50%'},
        },
      };
      $scope.svgData.dailyMetricData.circles = [
        {'x': 200, 'y': 200, 'r':200,'fill':"#dddcd2",'stroke':"#dddcd2",'strokewidth':"0"},
        {'x': 200, 'y': 200, 'r':160,'fill':"#ffffff",'stroke':"#dddcd2",'strokewidth':"0"},
      ];
    })
    .controller('PreferencesCtrl', function($scope,preferencesStorageService){
      $scope.preferences = {};
      $scope.preferences.facility = preferencesStorageService.retrieveFromLocalStorage.facility();
      $scope.preferences.service = preferencesStorageService.retrieveFromLocalStorage.service();
      $scope.preferences.standby = preferencesStorageService.retrieveFromLocalStorage.standby();
      $scope.preferences.roboblocks = preferencesStorageService.retrieveFromLocalStorage.roboblocks();
      $scope.$watchCollection('preferences',function(newValue,oldValue){
        console.log(newValue)
        angular.forEach(newValue,function(value,key){
          preferencesStorageService.updateLocalStorageItem(key,value)
        });
        $scope.preferences.facility = preferencesStorageService.retrieveFromLocalStorage.facility();
        $scope.preferences.service = preferencesStorageService.retrieveFromLocalStorage.service();
        $scope.preferences.standby = preferencesStorageService.retrieveFromLocalStorage.standby();
        $scope.preferences.roboblocks = preferencesStorageService.retrieveFromLocalStorage.roboblocks();
      });
      $scope.facilitiesOptions = [
        {optionId:'Main OR',optionValue:'1'},{optionId:'ACB OR',optionValue:'2'}
      ];
      $scope.serviceOptions = [
        {optionId:'ALL',optionValue:'ALL'},
        {optionId:'Bone Marrow',optionValue:'BMT'},
        {optionId:'Cardiology',optionValue:'CARDIO'},
        {optionId:'Dental',optionValue:'DENTAL'},
        {optionId:'Gynecology',optionValue:'GYN'},
        {optionId:'Head & Neck',optionValue:'HEAD_NECK'},
        {optionId:'Neurosurgery',optionValue:'NEURO'},
        {optionId:'Ophthalmology',optionValue:'OPHTH'},
        {optionId:'Orthopedic',optionValue:'ORTHO'},
        {optionId:'Pain',optionValue:'PAIN'},
        {optionId:'Plastic Surgery',optionValue:'PLAS_RECON'},
        {optionId:'Radiology',optionValue:'RAD'},
        {optionId:'Surgical Oncology',optionValue:'SURG_ONC'},
        {optionId:'Thoracic',optionValue:'THOR_CV'},
        {optionId:'Urology',optionValue:'UROLOGY'}
      ];
      $scope.standbyOptions = [
        {optionId:'Yes',optionValue:'yes'},
        {optionId:'No',optionValue:'no'}
      ];
      $scope.roboblocksOptions = [
        {optionId:'Yes',optionValue:'yes'},
        {optionId:'No',optionValue:'no'}
      ];
    })
    .directive('calendar', function(getDateDataAPIService,makeDoughnutChartService,buildCalendarService,timeServices) {
      return {
        restrict: "E",
        templateUrl: "templates/cal.html",
        //templateUrl: "templates/calweekly.html",
        /*templateUrl: function(elem,attr){
         var templateName = attr.view=="portrait"?"templates/cal.html":"templates/calweekly.html";
         return templateName;
         },*/
        scope: {
          selected: "=",
          view: "="
        },
        link: function(scope,elem,attr) {
          scope.orientation = scope.$parent.display.orientation;
          scope.selected = moment();
          scope.$parent.data.selected = moment();
          scope.today = timeServices.removeTime(moment());
          scope.$parent.data.today = timeServices.removeTime(moment());
          scope.month = scope.selected.clone();
          scope.$parent.data.month = scope.$parent.data.selected.clone();
          scope.tempDate = '0';
          scope.$parent.data.tempDate = '0';
          scope.svgData = scope.$parent.svgData.calendar;
          //var start = scope.selected.clone();
          var start = scope.$parent.data.selected.clone();
          start.date(1);
          timeServices.removeTime(start.day(0));
          _buildMonth(scope, start, scope.$parent.data.month);
          //buildCalendarService.buildMonth(scope, start, thisMonth);
          var thisMonth = scope.$parent.data.month;
          _findCurrentWeek(scope, start, scope.$parent.data.month);
          scope.$parent.data.selected.indexArray = [timeServices.getWeekOfMonth(scope.selected),scope.selected._d.getDay()];

          scope.$watchGroup(["selected"],function(newValue,oldValue){
            scope.$parent.data.month = newValue[0];
            scope.month = newValue[0];
            scope.$parent.data.selectedDate = scope.$parent.data.selected;
            scope.$parent.data.selectedDate.capBooked = scope.$parent.data.weeks[scope.$parent.data.selected.indexArray[0]].days[scope.$parent.data.selected.indexArray[1]].chartData;
          });

          scope.select = function(day,weekIndex,dayIndex) {
            scope.selected = day.date;
            scope.$parent.data.selected = scope.selected;
            scope.$parent.data.selected.indexArray = [weekIndex,dayIndex];
          };

          scope.next = function() {
            //scope.$parent.emptyCalShow = true;
            //var next = scope.month.clone();
            var next = scope.$parent.data.month.clone();
            //_removeTime(next.month(next.month()+1).date(1));
            timeServices.removeTime(next.month(next.month()+1).date(1));
            //scope.month.month(scope.month.month()+1);
            scope.$parent.data.month.month(scope.$parent.data.month.month()+1);
            _buildMonth(scope, next, scope.$parent.data.month);
            scope.$parent.data.selected.indexArray = [timeServices.getWeekOfMonth(scope.selected),scope.selected._d.getDay()]
          };

          scope.previous = function() {
            //scope.$parent.emptyCalShow = true;
            //var previous = scope.month.clone();
            var previous = scope.$parent.data.month.clone();
            console.log(scope.$parent.data.month)
            console.log(previous.month())
            console.log(previous.month()-1)
            //_removeTime(previous.month(previous.month()-1).date(1));
            console.log(previous.date(1))
            timeServices.removeTime(previous.month(previous.month()).date(1));
            console.log(previous.month(previous.month()-1).date(1))
            scope.month.month(scope.month.month()-1);
            console.log(scope.$parent.data.month)
            console.log(previous)
            _buildMonth(scope, previous, scope.$parent.data.month);
            scope.$parent.data.selected.indexArray = [timeServices.getWeekOfMonth(scope.selected),scope.selected._d.getDay()]

          };

          scope.zoomToday = function(){
            scope.selected = moment();
            scope.$parent.data.selected = moment();
            //_buildMonth(scope, scope.today, scope.month);
            _buildMonth(scope, scope.$parent.data.today, scope.$parent.data.month);
            //var next = scope.month.clone();
            var next = scope.$parent.data.month.clone();
            //_removeTime(next.month(next.month()+1).date(1));
            timeServices.removeTime(next.month(next.month()+1).date(1));
            //var previous = scope.month.clone();
            var previous = scope.$parent.data.month.clone();
            //_removeTime(previous.month(previous.month()-1).date(1));
            timeServices.removeTime(previous.month(previous.month()-1).date(1));
            scope.month = scope.selected;
            scope.$parent.data.month = scope.$parent.data.selected;
            scope.$parent.data.selected.indexArray = [timeServices.getWeekOfMonth(scope.selected),scope.selected._d.getDay()]
          };

        }
      };

      function _buildMonth(scope, start, month) {
        //console.log(start)
        //scope.weeks = [];
        scope.$parent.data.weeks = [];
        scope.weekNumberSelected = 0;
        scope.weekNumberStart = buildCalendarService.weekOfMonth(month);
        scope.$parent.data.weekNumberSelected = 0;
        scope.$parent.data.weekNumberStart = buildCalendarService.weekOfMonth(month);
        buildCalendarService.lazyLoadCalendarMetricsRoomsRunning(start,scope);

        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
          //scope.weeks.push({ days: buildCalendarService.buildWeek(date.clone(), start, month) });
          scope.$parent.data.weeks.push({ days: buildCalendarService.buildWeek(date.clone(), start, month) });
          date.add(1, "w");
          done = count++ > 2 && monthIndex !== date.month();
          monthIndex = date.month();
        }
        buildCalendarService.addDataMonth(scope)

      }

      function _findCurrentWeek(scope, start, month){
        scope.currentWeek = 0;
      }
    })
    .directive('watchResize', function(){
      return {
        restrict: 'A',
        scope: {
          selected: "=",
          view: "="
        },
        link: function(scope, elem, attr) {
          scope.watchresize = scope.$parent.display;
          angular.element(window).on('resize', function(){
            scope.$apply(
              function(){
                /*scope.display.orientation.class = function(){
                  if (displayModeService.detectOrientation()==true){
                    return 'landscape'
                  } else {
                    return 'portrait'
                  }
                };*/
              }
            );
          });

        }
      }
    })
    .directive('calendarnavigation', function(){
      return{
        restrict:"E",
        templateUrl:"templates/navigation.html",
        scope: {
          selected: "=",
          week: "="
        },
        link: function(scope) {
          scope.next = function() {
            scope.$parent.emptyCalShow = true;
            var next = scope.month.clone();
            _removeTime(next.month(next.month()+1).date(1));
            scope.month.month(scope.month.month()+1);
            _buildMonth(scope, next, scope.month);
            scope.moveCal = "move";
          };
          scope.previous = function() {
            scope.$parent.emptyCalShow = true;
            var previous = scope.month.clone();
            _removeTime(previous.month(previous.month()-1).date(1));
            scope.month.month(scope.month.month()-1);
            _buildMonth(scope, previous, scope.month);
            scope.moveCal = "move";
          };
          scope.zoomToday = function(){
            scope.selected = moment();
            _buildMonth(scope, scope.today, scope.month);
            var next = scope.month.clone();
            _removeTime(next.month(next.month()+1).date(1));
            var previous = scope.month.clone();
            _removeTime(previous.month(previous.month()-1).date(1));
            scope.month = scope.selected;
          };
        }
      }
    })
    .directive('weeklymetric', function(getDateDataAPIService,makeDoughnutChartService){
      return{
        restrict:"E",
        templateUrl:"templates/weeklyMetric.html",
        scope:{
          daymetric: "=",
          week: "="
        },
        link:function(scope,elem,attr){

          scope.week = scope.$parent.$parent.week;

          scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList = {
            'booked_case_count':{responseId:'booked_case_count',label:'Booked Cases',percent:false,icon:"orc-folder"},
            'booked_start':{responseId:'booked_start',label:'Booked Starts',percent:false,icon:"orc-folder"},
            'actual_case_count':{responseId:'actual_case_count',label:'Actual Cases',percent:false,icon:"orc-folder"},
            'tot_staff_mins':{responseId:'tot_staff_mins',label:'Staffed Mins',percent:false,icon:"orc-users"},
            'tot_booked_mins':{responseId:'tot_booked_mins',label:'Booked Mins',percent:false,icon:"orc-clock"},
            'actual_start_pat_in':{responseId:'actual_start_pat_in',label:'On-Time Starts ("Patient in Room")',percent:false,icon:"orc-clock"},
            'tot_actual_mins':{responseId:'tot_actual_mins',label:'Actual Mins',percent:false,icon:"orc-clock"},
            'tot_turnover_mins':{responseId:'tot_turnover_mins',label:'Turnover Mins',percent:false,icon:"orc-clock"},
            'actual_percentage':{responseId:'actual_percentage',label:'Actual vs Staffed',percent:true,icon:""},
            'percent_pat_in':{responseId:'percent_pat_in',label:'% of On-Time Starts ("Patient in Room")',percent:true,icon:""},
            'avg_pat_turnover_time':{responseId:'avg_pat_turnover_time',label:'Avg Turnover Mins',percent:false,icon:"orc-clock"},
            'first_case_wasted_mins':{responseId:'first_case_wasted_mins',label:'On-Time Start Delay Mins',percent:false,icon:"orc-clock"}
          };

          getDateDataAPIService.getRoomsRunning(scope.$parent.day.date._d.getMonth()+1 + "/" + scope.$parent.day.date._d.getDate() + "/" + scope.$parent.day.date._d.getFullYear()).then(function(response,data){

            angular.forEach(response.data.DailyMetrics[0],function(value, key){
              if(!angular.isUndefined(scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key])){

                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].svg = {};
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].svg.width = 50;
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].svg.height = 50;
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].chartData = response.data.DailyMetrics[0][key];
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].chartData = response.data.DailyMetrics[0][key];
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].pathData = {};
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].pathData.path = makeDoughnutChartService.makePathCoords(response.data.DailyMetrics[0][key],scope.$parent.$parent.$parent.svgData.pathData.r)
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].weekDay = true;
                scope.week.days[scope.$parent.day.date._d.getDay()].DailyMetricsList[key].pathData.color = makeDoughnutChartService.makeColor(response.data.DailyMetrics[0][key],scope.$parent.$parent.$parent.svgData.pathData.r)

              }
            });
            console.log(scope)
          })
        }
      }
    })
    .directive('dailymetric', function(buildCalendarService){
      return{
        restrict:"E",
        templateUrl:"templates/dailyMetric.html",
        scope:{
          selected:"=",
          week: "="
        },
        link:function(scope){

          //todo, link data to weeks data
          //scope.data = scope.$parent.data;

          scope.predicate = 'order';
          scope.day = {
            weekDay:true,
            //selected:scope.selected
            selected:scope.$parent.data.selected
          };
          scope.data = scope.$parent.data;
          scope.$parent.$watch("data.selected",function(newValue,oldValue){
            if(angular.isDefined(newValue)){
              var dateArray = scope.$parent.data.selected.indexArray
              buildCalendarService.buildDailyMetric(scope,newValue,dateArray);
            }
          });
        }
      };
    })
    .directive('doughnutgraph', function(){
      return{
        restrict:"E",
        templateUrl:"templates/doughnutGraph.html"
      }
    })
    .directive('roomsrunning', function(timeServices,buildCalendarService){
      return{
        restrict:"E",
        templateUrl:"templates/roomsrunning.html",
        scope:{
          selected: "=",
          week: "="
        },
        link:function(scope){
          scope.day = {
            weekDay:true,
            selected:scope.$parent.data.selected
          };
          scope.svgData = scope.$parent.svgData.dailyMetricData;
          scope.$parent.$watchGroup(['data.selected'],function(newValue,oldValue){
            if(angular.isDefined(newValue[0])){
              var dateArray = scope.$parent.data.selected.indexArray;
              buildCalendarService.buildRoomsRunningData(scope,newValue[0],dateArray);
            }
          });
        }
      }
    })
    .factory('displayModeService', function($window){
      var displayMode = {};
      displayMode.detectElementSize = function(elem){
        var parentSize = 0;
        if(document.getElementsByTagName(elem)[0])
          parentSize = document.getElementsByTagName(elem)[0].getBoundingClientRect();
        return parentSize;
      };
      displayMode.detectWide = function(){
        if($window.innerWidth > window.innerHeight){
          if (!navigator.userAgent.match(/Intel Mac OS X/i)
            || !navigator.userAgent.match(/Windows/i)
            || !navigator.userAgent.match(/iPad/i)
          //|| $window.innerWidth > window.innerHeight
          ){
            return true
          }
          else {
            return false;
          }
        } else {
          return false;
        }

      };
      displayMode.detectOrientation = function(){
        if (!navigator.userAgent.match(/Intel Mac OS X/i)
          && !navigator.userAgent.match(/Windows/i)
          && !navigator.userAgent.match(/iPad/i)
          && $window.innerWidth < 768
          && $window.innerWidth > window.innerHeight
        ){
          return true
        }
        else {
          return false;
        }
      };
      displayMode.returnAgentName = function(){
        var agentName;
        if( navigator.userAgent.match(/Android/i))
          agentName = "Android";
        if( navigator.userAgent.match(/webOS/i))
          agentName = "webOS";
        if( navigator.userAgent.match(/iPhone/i))
          agentName = "iPhone";
        if( navigator.userAgent.match(/iPad/i))
          agentName = "iPad";
        if( navigator.userAgent.match(/iPod/i))
          agentName = "iPod";
        if( navigator.userAgent.match(/BlackBerry/i))
          agentName = "BlackBerry";
        if( navigator.userAgent.match(/Windows Phone/i))
          agentName = "Windows Phone";
        if( navigator.userAgent.match(/Nokia/i))
          agentName = "Nokia";
        if (navigator.userAgent.match(/Intel Mac OS X/i))
          agentName = "Mac";
        if(navigator.userAgent.match(/Windows/i))
          agentName = "Windows";
        return agentName;
      };
      displayMode.detectSize = function(){
        var viewportSize = {};
        viewportSize.height = $window.innerHeight;
        viewportSize.width = $window.innerWidth;
        return viewportSize;
      };
      displayMode.detectAgent = function(){
        var userAgent = "";
        function detectmob() {
          if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
          ){
            return true;
          }
          else {
            return false;
          }
        }
        if(detectmob()&&navigator.userAgent.match(/iPad/)){
          userAgent = navigator.userAgent.match(/iPad/)[0];
        } else if(detectmob()&&navigator.userAgent.match(/iPhone/)){
          userAgent = navigator.userAgent.match(/iPhone/)[0];
        } else if(detectmob()&&navigator.userAgent.match(/Android/)){
          userAgent = navigator.userAgent.match(/Android/)[0];
        }
        return userAgent;
      };
      return displayMode;
    })
    .factory('preferencesStorageService', function(){
      var preference = {};
      preference.updateLocalStorageItem = function(key,value){
        localStorage.setItem(key,value)
      };
      preference.retrieveFromLocalStorage = {};
      preference.retrieveFromLocalStorage.facility = function(){
        if(localStorage.facility=="undefined"){preference.updateLocalStorageItem("facility","1")};
        return localStorage.facility;
      };
      preference.retrieveFromLocalStorage.service = function(){
        if(localStorage.service=="undefined"){preference.updateLocalStorageItem("service","ALL")};
        return localStorage.service;
      };
      preference.retrieveFromLocalStorage.standby = function(){
        if(localStorage.standby=="undefined"){preference.updateLocalStorageItem("standby","yes")};
        return localStorage.standby;
      };
      preference.retrieveFromLocalStorage.roboblocks = function(){
        if(localStorage.roboblocks=="undefined"){preference.updateLocalStorageItem("roboblocks","yes")};
        return localStorage.roboblocks;
      };
      return preference;
    })
    .factory('timeServices', function(){
      var time = {};
      time.removeTime = function(date){
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
      };
      time.isCurrentMonth = function(date){
        if(angular.equals(moment()._d.getMonth(),date._d.getMonth())){
          return true;
        } else {
          return false;
        }
      };
      time.isCalendarMonth = function(weeks,date){
        angular.forEach(weeks,function(value,key){
        })
      };
      time.getWeekOfMonth = function(date){
        var month = date.month();
        var year = date.year();
        var lastDateOfMonth = date.daysInMonth();
        var firstDayOfMonth = moment([year,month,1]);
        //console.log(firstDayOfMonth.day())
        var dayOfWeek = date.day();

        //console.log(dayOfWeek)
        var offSetDate = date.date() + firstDayOfMonth.day() -1;
        var index = 1;
        var weeksInMonth = index + Math.ceil((lastDateOfMonth + firstDayOfMonth - 7)/7);
        var week = Math.floor(offSetDate/7);
        //console.log(week)
        return week;
      };
      return time;
    })
    .factory('buildCalendarService', function(getDateDataAPIService,makeDoughnutChartService,cleanDataService,timeServices,displayModeService,$timeout){
      var calendar = {};
      calendar.weekOfMonth = function(date){
        var prefixes = [1,2,3,4,5];
        return prefixes[0 | moment(date).date() / 7]
      };
      calendar.buildWeek = function(date,start,month){
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push({
            name: date.format("dd").substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), "day"),
            date: date
          });
          date = date.clone();
          date.add(1, "d");
        }
        return days;
      };
      calendar.lazyLoadCalendarMetricsRoomsRunning = function(start,scope){
          start.date(1);
          timeServices.removeTime(start.day(0));
          $timeout(function() {
              calendar.getDailyMetricsForMonth(scope, start)
            },
            3000)
      };
      calendar.getDataForMonth = function(scope,a,b){
        //var weeks = scope.weeks
        var weeks = scope.$parent.data.weeks;
        var startDate = weeks[a].days[b].date._d.valueOf();
        var endDate = weeks[a].days[b].date._d.valueOf();
        getDateDataAPIService.getCalendarRapidData(startDate,endDate).then(function(response,data){
          weeks[a].days[b].weekDay = weeks[a].days[b].date._d.getDay()==0?false:weeks[a].days[b].date._d.getDay()==6?false:true;
          weeks[a].days[b].chartData=cleanDataService.removePercent(response.data[0].Booked_Capacity);
          weeks[a].days[b].pathData = {};
          weeks[a].days[b].pathData.path = makeDoughnutChartService.makePathCoords(weeks[a].days[b].date._d.getDay()==0?0:weeks[a].days[b].date._d.getDay()==6?0:cleanDataService.removePercent(response.data[0].Booked_Capacity),scope.svgData.pathData.r);
          weeks[a].days[b].pathData.color = makeDoughnutChartService.makeColor(weeks[a].days[b].date._d.getDay()==0?0:weeks[a].days[b].date._d.getDay()==6?0:cleanDataService.removePercent(response.data[0].Booked_Capacity));
          weeks[a].days[b].svg = {};
          weeks[a].days[b].svg.width = '100%';
          weeks[a].days[b].svg.height = '100%';
          //TODO, find a way that this value does not get written repeatedly, it's an ugly solution
          scope.$parent.data.selectedDate.capBooked = scope.$parent.data.weeks[scope.$parent.data.selected.indexArray[0]].days[scope.$parent.data.selected.indexArray[1]].chartData

        });
        return weeks
      };
      calendar.getDailyMetricsForMonth = function(scope, start){

        var _day = scope.$parent.data.month._d.getMonth()+1 + '/' + scope.$parent.data.month._d.getDate() + '/'+ scope.$parent.data.month._d.getFullYear();
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {

          var dateArray = [timeServices.getWeekOfMonth(date),date._d.getDay()];

          calendar.buildDailyMetric(scope,date,dateArray);

          //calendar.buildRoomsRunningData(scope,date,dateArray);

          date.add(1, "d");
          done = count++ > 2 && monthIndex !== date.month();
          monthIndex = date.month();
        }
      };
      calendar.addDataMonth = function(scope){

        //var weeks = scope.weeks;
        var weeks = scope.$parent.data.weeks;
        angular.forEach(weeks,function(value,key1){
          angular.forEach(value.days,function(value,key2){
            scope.weeks = calendar.getDataForMonth(scope,key1,key2);
            scope.$parent.data.weeks = calendar.getDataForMonth(scope,key1,key2);
          })
        });
        return weeks;
      };
      calendar.buildRoomsRunningData = function(scope,_date,dateArray){
        if (angular.isUndefined(scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data)){
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data = {};
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart = {}
        }
        scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart = {};
        scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.staffLine = {};
        scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.staffLine.points = '0,180';
        scope.$parent.svgData.dailyMetricData.roomsRunningChart.staffLine.points = '0,180';
        getDateDataAPIService.getRoomsRunning(_date._d.getMonth()+1 + "/" + _date._d.getDate() + "/" + _date._d.getFullYear()).then(function(response,data){
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunning = response.data.RoomsRunning;
          scope.$parent.data.roomsRunning = response.data.RoomsRunning;
          var chartRoomCountArray = [];
          angular.forEach(response.data.RoomsRunning,function(value,key) {
            chartRoomCountArray.push(value.room_count);
            chartRoomCountArray.push(value.staff_count);
          });
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.gridIncrement = Math.max.apply(Math, chartRoomCountArray)*scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement;
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight = Math.max.apply(Math, chartRoomCountArray)*scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement;
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.gridSVGHeight = scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight+ 'px';
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.rectangleHeight = scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight+ 'px';
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.viewBox = "0 0 " + displayModeService.detectElementSize("roomsrunning").width +"px " + scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight +"px";
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.bottomLabel = [];
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.chartWidth = scope.$parent.data.roomsRunning.length;
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartWidth = scope.$parent.data.roomsRunning.length;
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.chartHeight = ((Math.max.apply(Math, chartRoomCountArray))*scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement)/((scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement+1));
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartHeight = ((Math.max.apply(Math, chartRoomCountArray))*scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement)/((scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridIncrement+1));
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.d = "M " + scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartWidth +" 0 L 0 0 0 " + scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartHeight;
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.d = "M " + scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartWidth +" 0 L 0 0 0 " + scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartHeight;
          scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.staffLine.points = 0;
          scope.$parent.svgData.dailyMetricData.roomsRunningChart.staffLine.points = 0;
          angular.forEach(response.data.RoomsRunning,function(value,key){
            scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.lineBaseHeight = (Math.ceil((Math.max.apply(Math, chartRoomCountArray))/5)*5);
            scope.$parent.svgData.dailyMetricData.roomsRunningChart.lineBaseHeight = (Math.ceil((Math.max.apply(Math, chartRoomCountArray))/5)*5);
            scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data.roomsRunningChart.staffLine.points += key*scope.$parent.data.roomsRunning.length + "," +
              ((scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight)-(scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight *.54*scope.$parent.data.roomsRunning[key].staff_count/scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartHeight)) + " ";
            scope.$parent.svgData.dailyMetricData.roomsRunningChart.staffLine.points += key*scope.$parent.data.roomsRunning.length + "," +
              ((scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight)-(scope.$parent.svgData.dailyMetricData.roomsRunningChart.gridSVGHeight *.54*scope.$parent.data.roomsRunning[key].staff_count/scope.$parent.svgData.dailyMetricData.roomsRunningChart.chartHeight)) + " ";
            value.shortTime = value.time_interval.split('-')[0];
          });

        })

      };
      calendar.buildDailyMetric = function(scope,_date,dateArray){
        scope.svgData = scope.$parent.svgData.dailyMetricData;
        if(!angular.isUndefined(scope.$parent.data.weeks)){
          //scope.$parent.data.capBookedData = scope.$parent.data.weeks[timeServices.getWeekOfMonth(_date)].days[_date.day()].chartData;

          getDateDataAPIService.getRoomsRunning(_date._d.getMonth()+1 + "/" + _date._d.getDate() + "/" + _date._d.getFullYear()).then(function(response){
            //console.log(_date)
//console.log(scope.$parent.data.weeks)
            //console.log(dateArray)
            //console.log(scope.$parent.data.weeks[dateArray[0]])
            if(angular.isUndefined(scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data))
              scope.$parent.data.weeks[dateArray[0]].days[dateArray[1]].data = {};

            var saveDate = [timeServices.getWeekOfMonth(moment(response.config.url.split("=")[response.config.url.split("=").length-1])),moment(response.config.url.split("=")[response.config.url.split("=").length-1])._d.getDay()]
            scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList = [
                {responseId:'cap_booked',label:'Capacity Booked',percent:true,icon:"orc-folder",class:"flex-2x",order:0},
                {responseId:'booked_case_count',label:'Booked Cases',percent:false,icon:"orc-folder",class:"",order:9},
                {responseId:'booked_start',label:'Booked Starts',percent:false,icon:"orc-folder",class:"",order:10},
                {responseId:'actual_case_count',label:'Actual Cases',percent:false,icon:"orc-folder",class:"",order:3},
                {responseId:'tot_staff_mins',label:'Staffed Mins',percent:false,icon:"orc-users",class:"",order:4},
                {responseId:'tot_booked_mins',label:'Booked Mins',percent:false,icon:"orc-clock",class:"",order:5},
                {responseId:'actual_start_pat_in',label:'On-Time Starts ("Patient in Room")',percent:false,icon:"orc-clock",class:"",order:6},
                {responseId:'tot_actual_mins',label:'Actual Mins',percent:false,icon:"orc-clock",class:"",order:7},
                {responseId:'tot_turnover_mins',label:'Turnover Mins',percent:false,icon:"orc-clock",class:"",order:8},
                {responseId:'actual_percentage',label:'Actual vs Staffed',percent:true,icon:"",class:"",order:1},
                {responseId:'percent_pat_in',label:'% of On-Time Starts ("Patient in Room")',percent:true,icon:"",class:"",order:2},
                {responseId:'avg_pat_turnover_time',label:'Avg Turnover Mins',percent:false,icon:"orc-clock",class:"",order:11},
                {responseId:'first_case_wasted_mins',label:'On-Time Start Delay Mins',percent:false,icon:"orc-clock",class:"",order:12}
              ];

            scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsData = response.data;

            angular.forEach(scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsData.DailyMetrics[0],function(value0, key0){
              angular.forEach(scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList,function(value,key){
                if(angular.equals(value.responseId,key0)){
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].svg = {};
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].svg.width = '100%';
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].svg.height = '100%';
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].chartData = value0;
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].pathData = {};
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].pathData.path = makeDoughnutChartService.makePathCoords(value0,scope.$parent.svgData.dailyMetricData.pathData.r)
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].weekDay = true;
                  scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].data.dailyMetricsList[key].pathData.color = makeDoughnutChartService.makeColor(value0,scope.$parent.svgData.dailyMetricData.pathData.r)
                } else if(angular.equals(value.responseId,'cap_booked')){
                  value.svg = {width : '100%',height : '100%'};
                  value.chartData = scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].chartData;
                  value.pathData = {
                    path : makeDoughnutChartService.makePathCoords(scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].chartData,scope.$parent.svgData.dailyMetricData.pathData.r),
                    color : makeDoughnutChartService.makeColor(scope.$parent.data.weeks[saveDate[0]].days[saveDate[1]].chartData,scope.$parent.svgData.dailyMetricData.pathData.r)
                  };
                  value.weekDay = true;
                  return;
                }
              });
            });

          }).then(function(response,data){

          })
        }

      };
      return calendar;
    })
    .factory('cleanDataService', function(){
      var dataSet = {};
      dataSet.removePercent = function(_number){
        var newDateObject = _number.split("%");
        return newDateObject[0];
      };
      dataSet.cleanDateData = function(dateData){
        var newDateObject = dateData.split(" ");
        var dataTemp = [];
        angular.forEach(newDateObject,function(value,key){
          var parsedData = parseInt(value);
          if(!isNaN(parsedData)){
            dataTemp.push(parsedData);
          }
        });
        return dataTemp;
      };
      return dataSet;
    })
    .factory('getDateDataAPIService', function($http,preferencesStorageService){
      var dataAPI = {};
      var URLBase = "https://utmormwebnt.mdacc.tmc.edu/";
      dataAPI.getCalendarRapidData = function(startDate,endDate){
        var DailyIURLBase = "https://utmormwebnt.mdacc.tmc.edu/ORCapacityTest/calendarapidata.ashx?";
        var facility = "&facility=" + preferencesStorageService.retrieveFromLocalStorage.facility();
        var SVC = "&svc=" + preferencesStorageService.retrieveFromLocalStorage.service();
        var stdby = "&stdby=" + preferencesStorageService.retrieveFromLocalStorage.standby();
        var robo = "&robo=" + preferencesStorageService.retrieveFromLocalStorage.roboblocks();
        var start = "&start=" + startDate/1000;
        var end = "&end=" + endDate/1000;
        return $http({
          url:DailyIURLBase + facility + SVC + stdby + robo + start + end
        });
      };
      dataAPI.getRoomsRunning = function(date,facility){
        var URLdir = "ORCapacityTest/"
        var URLExt = "roomsrunningdata.ashx?";
        //TODO ADD facility var
        var facility = "&facility=" + preferencesStorageService.retrieveFromLocalStorage.facility();
        //TODO add service var
        var SVC = "&svc=" + preferencesStorageService.retrieveFromLocalStorage.service();
        var stdby = "&stdby=" + preferencesStorageService.retrieveFromLocalStorage.standby();
        var robo = "&robo=" + preferencesStorageService.retrieveFromLocalStorage.roboblocks();
        var booked = "&booked=1";
        var actual = "&actual=0";
        var dos = "&dos=" + date;
        return $http({
          url:URLBase + URLdir + URLExt + facility + SVC + stdby + robo + booked + actual + dos
        });
      };
      return dataAPI;
    })
    .factory('makeDoughnutChartService', function(){
      var chart = {};
      chart.makePathCoords = function(percentage, size){
        if (percentage>100)percentage=100;
        var unit = (Math.PI *2) / 100;
        var startangle = 0;
        var endangle = percentage * unit - 0.001;
        var x1 = (size / 2) + (size / 2) * Math.sin(startangle);
        var y1 = (size / 2) - (size / 2) * Math.cos(startangle);
        var x2 = (size / 2) + (size / 2) * Math.sin(endangle);
        var y2 = (size / 2) - (size / 2) * Math.cos(endangle);
        var big = 0;
        if (endangle - startangle > Math.PI) {
          big = 1;
        }
        var d = "M " + (size / 2) + "," + (size / 2) +  // Start at circle center
          " L " + x1 + "," + y1 +     // Draw line to (x1,y1)
          " A " + (size / 2) + "," + (size / 2) +       // Draw an arc of radius r
          " 0 " + big + " 1 " +       // Arc details...
          x2 + "," + y2 +             // Arc goes to to (x2,y2)
          " Z";                       // Close path back to (cx,cy)
        return d;
      };
      chart.makeColor = function(percentage){
        var colorGrid = [
          {name:'red',color:'rgb(218,41,28)','high':100,'low':85},
          {name:'orange',color:'rgb(255,134,0)','high':84,'low':80},
          {name:'green',color:'rgb(4,170,53)','high':79,'low':0}
        ];
        var color;
        angular.forEach(colorGrid,function(value,key){
          if(percentage<=value.high&&percentage>=value.low)
            color = value.color;
        });
        return color;
      };
      return chart;
    })
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];



  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/calendar');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
