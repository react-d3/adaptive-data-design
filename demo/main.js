var $lastDevice = $("#first-btn");

$(".js-device").click(function(event) {
    var device = $(this).attr("data-device");
    $lastDevice.removeClass('btn-primary');
    $lastDevice.addClass('btn-outline');
    $(this).removeClass('btn-outline');
    $(this).addClass('btn-primary');
    
    $lastDevice = $(this);
    $("#iframe-wrapper").attr('class', device);

    if (device != "notebook") {
        $(".keyboard").hide();
    } else {
        $(".keyboard").show();
    }
});