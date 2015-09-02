angular.module('espaceGenerale', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {



    })

    .controller('InscriptionCtrl', function($scope,$http,$ionicPopup,$state, $ionicModal, $timeout) {
        $scope.user = {
            "first_name": "",
            "last_name": "",
            "email": "",
            "pass": "",
            "type_account":"client",
            "src_account": "mail"
        }

        $scope.valider=function() {
            $scope.user = {
                "first_name": $scope.user.first_name,
                "last_name": $scope.user.last_name,
                "email": $scope.user.email,
                "pass": $scope.user.pass,
                "type_account":"client",
                "src_account": "mail"
            }

            console.log('User',$scope.user)

            var res = $http.post(path+'users', $scope.user);
            res.success(function(data, status, headers, config) {
                if(status==200){
                    $ionicPopup.alert({
                        title: 'Félicitation',
                        template: 'Votre compte est créé avec succée'
                    }).then(function(res) {
                        console.log('compte crié');
                        $scope.user = {
                            "first_name": "",
                            "last_name": "",
                            "email": "",
                            "pass": "",
                            "type_account":"",
                            "src_account": "mail"

                        }
                        $state.go('app.start');
                    });
                }
            })
            res.error(function(data, status, headers, config) {
                console.log(status);
                if(status==422){
                    $ionicPopup.alert({
                        title: 'Erreur',
                        template: 'Email entré est associé à un autre compte !'
                    }).then(function(res) {
                        console.log('alert mail existant');
                    });
                }
                if(status==404){
                    $ionicPopup.alert({
                        title: '',
                        template: 'Service non disponible pour le moment'
                    })
                        .then(function(res) {
                            console.log('service login 404');
                        });
                }
            });
        }


    })

    .controller('LoginCtrl', function($scope,$http,$ionicPopup,$state,$ionicLoading, $ionicModal, $timeout) {
        $scope.user = {
            "email": "",
            "password": ""
        }

        $scope.valider=function() {
            console.log('eeeee');
            $ionicLoading.show({template: 'Chargement'});
            $scope.user = {
                "email": $scope.user.email,
                "password": $scope.user.password
            }

            console.log('User',$scope.user);

            var res = $http.post(pathLogin+'auth/local', $scope.user);
            res.success(function(data, status, headers, config) {
                $ionicLoading.hide();
                if(status==200){
                    $ionicLoading.hide();
                    localStorage.setItem('idUser',data['user']['_id']);
                    localStorage.setItem('token',data['user']['token']);
                    window.location="prive.html";
                }
            })
            res.error(function(data, status, headers, config) {
                $ionicLoading.hide();
                if(status==401){
                    $ionicPopup.alert({
                        title: 'Erreur',
                        template: data.message
                    }).then(function(res) {
                        console.log('alert mail ou mots de passe non valide');
                    });
                    //window.location="index.html";
                }
                if(status==500){
                    $ionicPopup.alert({
                        title: 'Erreur',
                        template: 'Email entré est associé à un compte !'
                    }).then(function(res) {
                        console.log('alert mail existant');
                    });
                }
                if(status==404){
                    $ionicPopup.alert({
                        title: '',
                        template: 'Service non disponible pour le moment'
                    })
                        .then(function(res) {
                            console.log('service login 404');
                        });
                }
            })


        }


    })

    .controller('EmailController', function($scope,$cordovaEmailComposer) {
        console.log('eeeee')
        $scope.sendFeedback= function() {
            $cordovaEmailComposer.isAvailable().then(function() {
                var email = {
                    to: 'no-replay@dillapp.net',
                    bcc: ['sammouda.mohamed@hotmail.com', 'superconseil@gmail.com'],
                    subject: 'Contact application DILL',
                    body: '',
                    isHtml: true
                };
                $cordovaEmailComposer.open(email).then(null, function () {
                    // user cancelled email
                });
            }, function () {
                console.log('non');
            });
        }
    });