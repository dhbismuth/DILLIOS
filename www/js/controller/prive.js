angular.module('espacePrive', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
            $scope.deconexion=function(){
            window.location="index.html";
            }
            
            
            })
.controller('MapCtrl', function($scope,$http, $ionicLoading, $compile) {
            
            var infoWindow = new google.maps.InfoWindow();
            $scope.markers = [];
            var map ="";
            
            $scope.detailBonPlan=function(cat){
            window.location='#/app/detailBonPlan/'+cat;
            }
            
            $scope.createMarker = function (info){
            var marker = new google.maps.Marker({
                                                map:map,
                                                position: new google.maps.LatLng(parseFloat(info.laltetude), parseFloat(info.longitude)),
                                                flat: true
                                                
                                                });
            
            marker.content = '<div class="infoWindowContent">'+info.nomLieux+'<br><a href="#/app/detailBonPlan/'+info._id+'">Detail</a> </div>';
            
            google.maps.event.addListener(marker, 'click', function(){
                                          infoWindow.setContent(marker.content);
                                          infoWindow.open(map, marker);
                                          });
            
            $scope.markers.push(marker);
            }
            
            
            $scope.loadMarkers = function(lat,lng){
            var res = $http({method: 'GET',url: path+'bonplans/'+lat+'/'+lng+'/2/proximiter', cache: 'false'});
            res.success(function(data, status, headers, config) {
                        console.log('Markers avant', $scope.markers);
                        console.log('liste', data);
                        for (i = 0; i < data.length; i++)
                        {
                        $scope.createMarker(data[i]);
                        }
                        console.log('Markers apres', $scope.markers);
                        
                        $scope.openInfoWindow = function(e, selectedMarker){
                        e.preventDefault();
                        google.maps.event.trigger(selectedMarker, 'click');
                        }
                        })
            res.error(function(data, status, headers, config) {
                      console.log(status);
                      })
            }
            
            $scope.initialize = function(lat,lng) {
            var myLatlng = new google.maps.LatLng(lat,lng);
            
            var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map"),
                                      mapOptions);
            
            
            var marker = new google.maps.Marker({
                                                position: myLatlng,
                                                map: map
                                                });
            
            $scope.loadMarkers(lat,lng);
            $scope.map = map;
            }
            
            $scope.getPosition=function(){
            if (navigator.geolocation) {
            var locationMarker = null;
            $ionicLoading.show({
                               template: 'En cours de chargement, n\'oubliez pas d\'activer votre géolocalisation dans votre smartphone...'
                               });
            navigator.geolocation.getCurrentPosition(
                                                     function( position ){
                                                     if (locationMarker){
                                                     return;
                                                     }
                                                     $scope.latitude=position.coords.latitude;
                                                     $scope.longitude=position.coords.longitude;
                                                     $scope.initialize($scope.latitude,$scope.longitude);
                                                     console.log(position);
                                                     $ionicLoading.hide();
                                                     },
                                                     function( error ){
                                                     $scope.latitude=parseFloat(48.856614);
                                                     $scope.longitude=parseFloat(2.3522219);
                                                     $scope.initialize($scope.latitude,$scope.longitude);
                                                     $ionicLoading.hide();
                                                     },
                                                     {
                                                     timeout: (12 * 1000),
                                                     maximumAge: (10000 * 60 * 15),
                                                     enableHighAccuracy: true
                                                     }
                                                     );
            
            }
            }
            
            $scope.getPosition();
            })

.controller('ProfilCtrl', function($scope,$http,$rootScope,$cordovaCamera,$ionicPopup,$state) {
            
            $scope.user={
            _id: "",
            src_avatar: '0',
            avatar: 0,
            last_name: '',
            first_name: '',
            email:''
            }
            
            
            $scope.load_profil=function(){
            var idUser=localStorage.getItem('idUser');
            var token=localStorage.getItem('token');
            console.log('token',token);
            var res = $http({method: 'GET', url: path+'users/'+idUser });
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        
                        $scope.user={
                        _id: data['_id'],
                        src_avatar: data['src_avatar'],
                        avatar: data['avatar'],
                        last_name: data['last_name'],
                        first_name:  data['first_name'],
                        email:data['email']
                        }
                        
                        
                        if($scope.user.avatar==0){
                        $scope.picture="img/avatar.png";
                        }
                        else{
                        $scope.picture=$scope.user.src_avatar;
                        }
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.change=function(){
            $scope.updateInfoPrestation();
            }
            }
            
            
            
            
            
            $scope.updateInfoPrestation=function(){
            var idUser=localStorage.getItem('idUser');
            var token=localStorage.getItem('token');
            var res = $http.put(path+'users/'+idUser,$scope.user);
            res.success(function(data, status, headers, config) {
                        console.log(status);
                        })
            res.error(function(data, status, headers, config) {
                      console.log(status);
                      })
            }
            $scope.takePicture = function() {
            var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
            };
            
            $cordovaCamera.getPicture(options).then(function(imageData) {
                                                    //$scope.imgURI = "data:image/jpeg;base64," + imageData;
                                                    console.log("data:image/jpeg;base64," + imageData);
                                                    $scope.picture="data:image/jpeg;base64," + imageData;
                                                    $scope.user.avatar=1;
                                                    $scope.user.src_avatar=$scope.picture;
                                                    $scope.updateInfoPrestation();
                                                    }, function(err) {
                                                    // An error occured. Show a message to the user
                                                    console.log('err',err)
                                                    });
            }
            $scope.load_profil();
            
            })

.controller('categorieCtrl', function($scope,$http,$rootScope,$cordovaCamera,$ionicPopup,$state) {
            
            $scope.categories = [];
            
            
            $scope.load_catecorie=function(){
            var res = $http({method: 'GET', url: path+'categories' });
            res.success(function(data, status, headers, config) {
                        console.log('dd',data);
                        if(status==200){
                        $scope.categories = data;
                        
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.change=function(){
            $scope.updateInfoPrestation();
            }
            }
            
            $scope.listByCategorie=function(cat){
            window.location='#/app/allBonsPlan/'+cat;
            }
            
            
            $scope.load_catecorie();
            
            })

.controller('bonsPlansCtrl', function($scope,$http,$stateParams) {
            $scope.id=$stateParams.id;
            
            $scope.bonPlans = [];
            
            $scope.categorie = function () {
            var res = $http.get(path + 'categories/' + $scope.id, { headers: { 'Cache-Control': 'no-cache' } });
            res.success(function (data, status, headers, config) {
                        if (status == 200) {
                        console.log('catt', data.img);
                        $scope.img = data.img;
                        $scope.name = data.name;
                        
                        }
                        })
            res.error(function (data, status, headers, config) {
                      
                      if (status == 404) {
                      $ionicPopup.alert({
                                        title: '',
                                        template: 'Service non disponible pour le moment'
                                        })
                      .then(function (res) {
                            console.log('service login 404');
                            });
                      }
                      });
            
            }
            
            $scope.load_bonPlansByCategorie=function(){
            var res = $http({method: 'GET', url: path+'bonplans/byCategorie/'+ $scope.id});
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        $scope.bonPlans = data;
                        
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.detailBonPlan=function(cat){
            window.location='#/app/detailBonPlan/'+cat;
            }
            
            $scope.categorie();
            $scope.load_bonPlansByCategorie();
            
            })

.controller('bonsDetailPlansCtrl', function($scope,$http,$stateParams) {
            $scope.id=$stateParams.id;
            
            $scope.bonPlans = [];
            
            $scope.initialize = function(lat,lng) {
            var myLatlng = new google.maps.LatLng(lat,lng);
            
            var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mapdetail"),
                                          mapOptions);
            
            
            var marker = new google.maps.Marker({
                                                position: myLatlng,
                                                map: map,
                                                title: 'Uluru (Ayers Rock)'
                                                });
            
            google.maps.event.addListener(marker, 'click', function() {
                                          infowindow.open(map,marker);
                                          });
            
            $scope.map = map;
            }
            
            $scope.load_DetailBonPlans=function(){
            var res = $http({method: 'GET', url: path+'bonplans/'+ $scope.id,cache:false});
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        $scope.bonPlans = data;
                        $scope.initialize($scope.bonPlans.laltetude,$scope.bonPlans.longitude);
                        
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.load_DetailBonPlans();
            
            })

.controller('bonsPlansCtrls', function($scope,$http,$stateParams) {
            $scope.id=$stateParams.id;
            
            $scope.bonPlans = [];
            
            
            $scope.load_bonPlansByCategorie=function(){
            var res = $http({method: 'GET', url: path+'bonplans'});
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        $scope.bonPlans = data;
                        
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.detailBonPlan=function(cat){
            window.location='#/app/detailBonPlan/'+cat;
            }
            
            
            $scope.load_bonPlansByCategorie();
            
            })

.controller('acceuilCtrl', function($scope,$http,$stateParams,$ionicPopup,$ionicSlideBoxDelegate) {
            $scope.bonPlans = [];
            
            $scope.images = [];
            $scope.actualiters = [];
            $scope.nbBonplan=0;
            
            $scope.load_bonPlans=function(){
            var res = $http({method: 'GET', url: path+'bonplans'});
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        console.log(data);
                        $scope.nbBonplan = data.length;
                        
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.load_bonPlansLast=function(){
            var res = $http({method: 'GET', url: path+'bonplans/last/0/2'});
            res.success(function(data, status, headers, config) {
                        if(status==200){
                        $scope.bonPlans = data;
                        $ionicSlideBoxDelegate.update();
                        }
                        })
            res.error(function(data, status, headers, config) {
                      
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
            
            $scope.load_Actuliter=function(){
            $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q": "http://www.ensemble-en-regions.fr/feed/" } })
            .success(function(data) {
                     $scope.rssTitle = data.responseData.feed.title;
                     $scope.rssUrl = data.responseData.feed.feedUrl;
                     $scope.rssSiteUrl = data.responseData.feed.link;
                     $scope.entries = data.responseData.feed.entries;
                     })
            .error(function(data) {
                   console.log("ERROR: " + data);
                   });
            var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
            };
            $scope.browse = function(v) {
            window.open(v, "_blank", "location=yes");
            }
            }
            
            $scope.detailBonPlan=function(cat){
            window.location='#/app/detailBonPlan/'+cat;
            }
            
            $scope.load_bonPlans();
            $scope.load_bonPlansLast();
            $scope.load_Actuliter();
            
            })

