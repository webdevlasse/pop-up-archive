angular.module('Directory.dashboard.controllers', ['Directory.loader', 'Directory.user'])
.controller('DashboardCtrl', [ '$scope', 'Item', 'Loader', 'Me', 'Dashboard', 'Search', function ItemsCtrl($scope, Item, Loader, Me, Dashboard, Search) {

  new Dashboard();

  Me.authenticated(function (data) {
    $scope.recent = Search.recent();
  });

}])