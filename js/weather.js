(function($) {

    $('#weather_submit').click(function() {

        $.ajax({
            type:"POST",
            url: "http://api.wunderground.com/api/231c3e1e6f58bfd1/geolookup/conditions/q/CA/" + $('#weather_location').val() + ".json",
            dataType: "jsonp",
            success: function(parsed_json) {

                generate_weather_card_and_extra_info(parsed_json);

            }
        });
    });

    generate_weather_card_and_extra_info = function(parsed_json) {
        if(typeof parsed_json['location'] == "undefined"){
            Materialize.toast('No City Found', 3000, 'rounded')
            return;
        }

        var location = parsed_json['location']['city'];
        location = location.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        var radar_image = "http://api.wunderground.com/api/231c3e1e6f58bfd1/animatedradar/q/CA/" + $('#weather_location').val() + ".gif?newmaps=1&timelabel=1&timelabel.y=10&num=5&delay=50";
        var icon = parsed_json['current_observation']['icon_url'];
        var temp_f = parsed_json['current_observation']['temp_f'];

        $('.weather_radar').attr('src', radar_image);
        $('.weather_icon').attr('src', icon);
        $('#weather_title').text(location + " Temp:" + temp_f);
        $('.card-reveal .card-title').text(location);
        $('#weather_info').text(" Temp:" + temp_f);
        $('#weather_extra').html(generate_weather_infos(parsed_json));

        $('#weather_extra').collapsible();
        Materialize.toast('Found 1 City', 3000, 'rounded')
    }

    generate_weather_infos = function(parsed_weather_data) {

        var extra_info_list = {
            "dewpoint_f": "Dew Point in F",
            "weather": "Weather",
        }


        var result_string = "";

        for (var info in extra_info_list) {
            var data = parsed_weather_data.current_observation[info];

            result_string += '<li>' +
                '<div class="collapsible-header"><i class="mdi-image-filter-drama"></i>' + extra_info_list[info] + '<a class="btn-floating btn-small right waves-effect waves-light red"></a></div>' +
                '<div class="collapsible-body"><p>' + data + '</p></div>' +
                '</li>';
        }
        return result_string;


    }
})(jQuery);
