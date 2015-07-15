var Portfolio = angular.module("Portfolio", []);

Portfolio.controller("portfolioCtrl", function ($scope, $http) {
    $http.get("/projects.json").success(function (projects) {
        $scope.projects = projects;
    });
    $scope.limit = 10;
});
