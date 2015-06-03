jQuery(document).ready(function($) {
    var query_data = ""
    $('#weather_location').autocomplete({
        valueKey: 'name',
        source: [{
            url: "http://autocomplete.wunderground.com/aq?query=%QUERY%&format=jsonp",
            type: 'remote',
            ajax: {
                dataType: 'jsonp',
                jsonp: 'cb',
            },
                getTitle: function(item){
                return item.name;
            },
                getValue: function(item){
                return item.name;
            },
        }],
        
    }).on('selected.xdsoft', function(e, datum) {
        alert(datum.name);
        alert(datum.name);
    });

    $('#weather_submit').click(function() {

        $.ajax({
            url: "http://autocomplete.wunderground.com/aq?query=" + $('#weather_location').val(),
            dataType: "jsonp",
            jsonp: "cb",
            success: function(parsed_json) {
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
                Materialize.toast('Found 1 City', 3000, 'rounded') // 'rounded' is the class I'm applying to the toast

                $('#modal1').openModal();

            }
        });
        // url : "http://api.wunderground.com/api/231c3e1e6f58bfd1/geolookup/conditions/q/CA/" + $('#weather_location').val() + ".json",

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
    });
});
