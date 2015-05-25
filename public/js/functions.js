$(document).ready(function (){

	$(".btn").on("click", function () {

		makeAjaxRequest({
			operation: "/@/getExample",
			data: {}
		}, function (err, data) {
			console.log(data);
		});
	});
});

function makeAjaxRequest (ajaxObj, callback) {

    $.ajax({
        url: ajaxObj.operation,
        type: "POST",
        data: ajaxObj.data,
        crossDomain: true,
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                callback('Not connect. Verify Network.' + jqXHR.responseText);
            } else if (jqXHR.status == 404) {
                callback('Requested page not found. [404].' + jqXHR.responseText);
            } else if (jqXHR.status == 500) {
                callback('Internal Server Error [500].' + jqXHR.responseText);
            } else if (exception === 'parsererror') {
                callback('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                callback('Time out error.');
            } else if (exception === 'abort') {
                callback('Ajax request aborted.');
            } else {
                callback('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
        success: function (data) {

            // response is a string, needs to be parsed
            var data = JSON.parse(data);
            callback(null, data);
        }
    });
}