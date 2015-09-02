// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'espaceGenerale'])

.run(function($ionicPlatform,$ionicPopup,$rootScope,$cordovaNetwork,$ionicLoading) {
        $rootScope.check=function(){
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            var isOffline = $cordovaNetwork.isOffline();
            console.log('type',type);
            if(type=="none"){
                $rootScope.data=0;
            }
            else{
                $rootScope.data=1;
            }
            if($rootScope.data==0 ){
                var myPopup = $ionicPopup.alert({
                    title: 'Notification',
                    template: '<ion-list >'+
                    '<ion-item item="item" item-type="item-icon-left" >'+
                    '<i ng-if="data==1" class="ion-checkmark-circled label_vert"></i>'+
                    '<i ng-if="data==0" class="ion-close-circled" style="color: red"></i>'+
                    '<span class="label_vert" style="margin-left: 10px">Connexion Data</span>'+
                    '</ion-item>'+
                    '</ion-list>',
                    buttons: [
                        {
                            text: 'Rafraîchir',type: 'button-assertive',
                            onTap: function(e) {
                                e.preventDefault();
                                $ionicLoading.show({template: 'Vérification du service de localisation et connexion data'});
                                var type = $cordovaNetwork.getNetwork();
                                var isOnline = $cordovaNetwork.isOnline();
                                var isOffline = $cordovaNetwork.isOffline();
                                if(type=="none"){
                                    $rootScope.data=0;
                                }
                                else{
                                    $rootScope.data=1;
                                }
                                console.log('type',type);
                                $ionicLoading.hide();
                                if($rootScope.data==1){
                                    myPopup.close();
                                }
                            }
                        }
                    ]
                });
            }
            else{
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            }
        }
     
     
     function didExitRegion(pluginResult) {
            clearInterval($rootScope.interfale);
            var idTicket=localStorage.getItem('idTicket');
            var clientatt={
                active : 0
            }
            if(idTicket){
                var res = $http.put(path+'clienAccueils/'+idTicket,clientatt);
                res.success(function(data, status, headers, config) {
                 if($rootScope.idAgent != ""){
                            console.log('agent',data.idAgent)
                            console.log('client',data.idClient )
                            var res = $http.get(path+'users/'+data.idAgent+'/'+ data.idClient+'?rnd='+new Date().getTime(),  { cache: false });
                            res.success(function(data, status, headers, config) {
                            if(status==200){
                                        for(var i=0;i<data.length;i++){
                                            if(data[i].type_account=="Agent"){
                                                console.log('client',data[i])
                                                if(data[i].avatar==0){
                                                    $rootScope.pictureAgent="img/avatar.png";
                                                }
                                                else{
                                                    $rootScope.pictureAgent=data[i].src_avatar;
                                                }
                                            }
                                            if(data[i].type_account="client"){
                                                $rootScope.nameClient= data[i].first_name+ ' ' + data[i].last_name;
                                            }
                                        }
                                        console.log('eeeddd',data);
                             }
                             })
                            res.error(function(data, status, headers, config) {
                                      console.log('errr',data);
                           });
                 }
                 
                 $rootScope.idAgent=data.idAgent;
                 $rootScope.idClient=data.idClient;
                 })
                res.error(function(data, status, headers, config) {
                          console.log('err 1')
                });
     }
     
     
        localStorage.setItem('idTicket',0);
        $rootScope.modalEnter.hide();
        $rootScope.enCaharge.hide();
        $rootScope.modalSortie.show();
        console.log('didExitRegion',pluginResult);
     }
     
     function didEnterRegion (pluginResult) {
        var idUser=localStorage.getItem('idUser');
        console.log('id',idUser)
        if(idUser){
            var clientatt={
            idClient : idUser
            }
            var res = $http.post(path+'clienAccueils/',clientatt);
            res.success(function(data, status, headers, config) {
                 if(status==201){
                        localStorage.setItem('idTicket',data._id);
                        $rootScope.interfale = setInterval(function(){
                        var res1 = $http.get(path+'clienAccueils/prisCharge/'+data._id,{cache:false});
                        res1.success(function(data, status, headers, config) {
                        if (status == 200) {
                                if(data){
                                    $rootScope.modalEnter.hide();
                                    $rootScope.modalSortie.hide();
                                    if(data.avatar==0){
                                          $rootScope.picture="file:///android_asset/www/img/avatar.png";
                                    }
                                    else{
                                          $rootScope.picture=data.src_avatar;
                                    }
                                    $rootScope.nameAgent= data.first_name+ ' ' + data.last_name;
                                    clearInterval($rootScope.interfale);
                                    $rootScope.enCaharge.show();
                                }
                        }
                        })
                        res1.error(function(data, status, headers, config) {
                                   console.log('err')
                        });
                        }, 12000);
                 }
            })
            res.error(function(data, status, headers, config) {
                      console.log('err')
            });
     }
     $rootScope.modalEnter.show();
     $rootScope.enCaharge.hide();
     $rootScope.modalSortie.hide();
     
     };
     
     function didRangeBeaconsInRegion (pluginResult) {
        console.log('enter')
     }
     
     $rootScope.fermerEntrer= function () {
        $rootScope.modalEnter.hide();
     }
     
     $rootScope.fermerSortie= function () {
        $rootScope.modalSortie.hide();
     }
     
     
     
     $rootScope.envoyer= function () {
        $rootScope.modalSortie.hide();
     }
     
     $rootScope.fermerCharge= function () {
        $rootScope.enCaharge.hide();
     }
     
     
     
     
    $ionicPlatform.ready(function() {
                         console,log('tag','init');
           $rootScope.check();
                         
            $ionicModal.fromTemplateUrl('entrer.html', function($ionicModal) {
                $rootScope.modalEnter = $ionicModal;
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $rootScope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
                             
                             
            $ionicModal.fromTemplateUrl('sortie.html', function($ionicModal) {
                $rootScope.modalSortie = $ionicModal;
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $rootScope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
                             
            $ionicModal.fromTemplateUrl('enCaharge.html', function($ionicModal) {
                $rootScope.enCaharge = $ionicModal;
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $rootScope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
                             
            var delegate = new cordova.plugins.locationManager.Delegate();
                delegate.didRangeBeaconsInRegion = didRangeBeaconsInRegion;
                delegate.didEnterRegion = didEnterRegion;
                delegate.didExitRegion = didExitRegion;
                var uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
                var identifier = 'beaconOnTheMacBooksShelf';
                var minor = 24772;
                var major = 4978;
                var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
                cordova.plugins.locationManager.setDelegate(delegate);
                cordova.plugins.locationManager.requestAlwaysAuthorization();
                cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                .fail(console.error)
                .done();
        });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

      .state('app', {
        url: "/app",
        templateUrl: "templates/generale/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.start', {
        url: "/start",
        views: {
          'menuContent': {
            templateUrl: "templates/generale/start.html"
          }
        }
      })
      .state('app.signUp', {
          url: "/signUp",
          views: {
              'menuContent': {
                  templateUrl: "templates/generale/signUp.html",
                  controller: 'InscriptionCtrl',
                  cache: false //required
              }
          }
      })
      .state('app.login', {
          url: "/login",
          views: {
              'menuContent': {
                  templateUrl: "templates/generale/login.html",
                  controller: 'LoginCtrl',
                  cache: false //required
              }
          }
      })
      .state('app.nousContacter', {
          url: "/nousContacter",
          views: {
              'menuContent': {
                  templateUrl: "templates/generale/nousContacter.html",
                  controller: 'EmailController',
                  cache: false //required
              }
          }
      })




  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
});
