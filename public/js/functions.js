$.embedly.defaults.key = '7be05f589d08461494612a6cc5dcd61f';

var Portfolio = angular.module("Portfolio", []);

Portfolio.controller("portfolioCtrl", function ($scope, $http) {
    $http.get("/projects.json").success(function (projects) {
        $scope.projects = projects;
        $scope.addImages(0);
    });

    $scope.skip = 0;
    $scope.limit = 6;

    $scope.addImages = function (skip) {

        for (var i = skip; i < skip + $scope.limit; ++ i) {
            (function (i) {
                var url = window.location.origin + "/projects/" + $scope.projects[i];

                //var url = "http://i.imgur.com/ZcGEA72.png";
                $.embedly.extract(url).progress(function(obj) {
                    // Grab images and create the colors.
                    var img = obj.images[0];
                    var color = "rgb(" + img.colors[0].color[0] + "," + img.colors[0].color[1] + "," + img.colors[0].color[2] + ")";

                    // Display the image.
                    displayImage(i, img, color);
                });
            })(i);
        }

        $scope.skip = skip + $scope.limit;
    };
});

var displayImage = function(i, img, color) {
 
    var width = $(".container1").width(),
        height = Math.ceil(img.height * (width / img.width));
    
    var $temp = $('<div class="backgroundBlock"></div>');

    // Add the block to the results section.
    $((i % 2 ? ".container2" : ".container1")).append($temp);

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
