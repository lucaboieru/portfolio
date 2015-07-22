$.embedly.defaults.key = '0291b99310294191a17b5307ce1db307';

var Portfolio = angular.module("Portfolio", []);

Portfolio.controller("portfolioCtrl", function ($scope, $http) {
    $http.get("/projects.json").success(function (projects) {
        $scope.projects = projects;
        $scope.addImages(0);
    });


    $scope.addImages = function (skip) {

        $(".spinner").show();
        $(".loadMore").hide();

        for (var i = 0; i < $scope.projects.length; ++ i) {
            (function (i) {
                var url = "http://104.155.46.85:9999/projects/" + $scope.projects[i];

                $.embedly.extract(url).progress(function(obj) {
                    // Grab images and create the colors.
                    var img = obj.images[0];
                    var color = "rgb(" + img.colors[0].color[0] + "," + img.colors[0].color[1] + "," + img.colors[0].color[2] + ")";

                    // Display the image.
                    displayImage(i, img, color, url);
                });
            })(i);
        }
    };
});

$(document).ready(function () {
    $('#zoom').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var url = button.data('url');
        var modal = $(this);
        modal.find('img').attr("src", url);
    });
});

var displayImage = function(i, img, color, url) {
 
    var width = $(".container0").width(),
        height = Math.ceil(img.height * (width / img.width));
    
    var $temp = $('<div data-url="' + url + '" class="backgroundBlock" data-toggle="modal" data-target="#zoom"></div>');

    // Add the block to the results section.
    var container = ".container" + (i % 4);
    $(container).append($temp);

    // Build the actually placeholder.
    $temp.css({
        background: color,
        width: width,
        height: height
    });

    // Animate the fade in.
    $temp.animate({opacity: 1}, 500);
 
    // Use Embedly display to resize the image, we add a timestamp in the demo
    var src = $.embedly.display.resize(img.url,
        {query: {width:width, height:height}, key: $.embedly.defaults.key}) +
        '&_' + Math.floor(Math.random() * 1000);
 
    // Create the img element
    var elem = document.createElement('img');
 
    // Set up the onload handler.
    var loaded = false;
    var handler = function() {
        if (loaded) {
            return;
        }
        loaded = true;
        // Fade the image into view.
        $temp.find("img").animate({opacity: 1}, 500);
    };
 
    // Add the attributes to the image.
    elem.onload = handler;
    elem.src = src;
    elem.style.display = 'block';
    
    $temp.html($(elem).addClass("thumbnail"));
 
    // If the image is already in the browsers cache call the handler.
    if (elem.complete) {
        handler();
    }
};
