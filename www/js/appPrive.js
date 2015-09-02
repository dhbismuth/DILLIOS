// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','LocationService','espacePrive'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                templateUrl: "templates/prive/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.editProfil', {
                url: "/editProfil",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/edit-profil.html",
                        controller: 'ProfilCtrl'
                    }
                }
            })
            .state('app.acceuil', {
                url: "/acceuil",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/accueil.html",
                        controller: 'acceuilCtrl'
                    }
                }
            })
            .state('app.listeCategorie', {
                url: "/listeCategorie",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/listeCategorie.html",
                        controller: 'categorieCtrl',
                        cache : true
                    }
                }
            })
            .state('app.allBonsPlan', {
                url: "/allBonsPlan/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/bonsPlans.html",
                        controller: 'bonsPlansCtrl'
                    }
                }
            })
            .state('app.detailBonPlan', {
                url: "/detailBonPlan/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/detailBonPlan.html",
                        controller: 'bonsDetailPlansCtrl',
                        cache : false
                    }
                }
            })
            .state('app.allBonsPlans', {
                url: "/allBonsPlans",
                views: {
                    'menuContent': {
                        templateUrl: "templates/prive/allBonPlans.html",
                        controller: 'bonsPlansCtrls'
                    }
                }
            })
            .state('app.proximite', {
                url: "/proximite",
                views: {
                    'menuContent': {
                        url: "/app/proximite",
                        templateUrl: "templates/prive/proximite.html",
                        controller: 'MapCtrl',
                        cache : false

                    }
                }
            })



        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/acceuil');
    });
