$( document ).ready(function() {
    

    /*
     var KnockoutChartWrapper= function (name, chartInstance, rowList) {
     this.name = ko.observable(name);
     this.computed = ko.computed(function () {
     return 0;
     }, this);
     };
     */
    
    $('#cases').tab('show');
    
    function updateListener(countryId){
        $("#" + countryId).on('click', function (e) {
            e.preventDefault();
            let countryName = countryId.replace(/_/g," ");
            toggleCountryInCharts(countryId, countryName);
            
            if( activeCountries.includes( countryId ) ){
                removeCountryFromList(countryId, countryName);
                addCountryToListPrepend(countryId, countryName );
                $("#" + countryId).toggleClass('active');
                $("#" + countryId).toggleClass('border');
            };
            /*
            addCountryToListPrepend(countryId, countryName );
            updateListener(countryId);*/
            
            $(this).toggleClass('active');
            $(this).toggleClass('border');
            $("#countryInput")[0].value = "";
            $("#countryInput").keyup();
            
        });
                
        $("#countryInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            
            $(".country-item").filter(function() {
                  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });

            $("#countryListCollapse").collapse('show');
        });
    }
    
    
    var userCountry = "United States of America";
    function ipLookUp () {
      $.ajax('https://ipapi.co/json/')
      .then(
          function success(response) {
              //console.log('User\'s Location Data is ', response);
              console.log('User\'s Country', response.country_name);
              userCountry = response.country_name;
          },

          function fail(data, status) {
              console.log('Request failed.  Returned status of',
                          status);
          }
      );
    }
    ipLookUp();
    
    
    
        
    window.chartColorsIndex = 0;
    window.chartColors = [
        'rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(75, 192, 192)',
        'rgb(255, 205, 86)','rgb(153, 102, 255)','rgb(54, 162, 235)',
        'rgb(201, 203, 207)'];
        //,transparent: 'rgb(201, 203, 207, 0)'
    
    var updateTimestamp = document.getElementById('updateTimestamp');
    var progress = document.getElementById('progressIndicator');
    function progressText(progressDiv, text){
        document.getElementById('progressIndicatorText').innerHTML = text;
    }
    
    var countryListHTML = $('#countryList');
    
    function addCountryToListAppend(id, countryName){
        countryListHTML.append('<a href="#" class="list-group-item list-group-item-action country-item '+id+'" id="'+id+'">' + countryName + '</a>');
        updateListener(id);
    }
    function addCountryToListPrepend(id, countryName){
        countryListHTML.prepend('<a href="#" class="list-group-item list-group-item-action country-item '+id+'" id="'+id+'">' + countryName + '</a>');
        updateListener(id);
    }
    function removeCountryFromList(id, countryName){
        $( "#"+id ).remove();
    }
    
        
    function addCountriesToList(data){
        countries = dataCall.responseJSON.data.cases;
        //console.log(dataCall.responseJSON.data.cases)
        for( country in countries ){
            addCountryToListAppend( country, country.replace(/_/g," "));
        }
        //initListeners();
        
    }
    
    function addCountryToCharts(countryId, countryName, countryJQueryItem){
        if( activeCountries.includes( countryId ) ){ return };
        for(chart in charts){
            //console.log(charts);
            //console.log(charts[chart].chart.config.data.metricName);
            //console.log(dataCovidTimeFiltered)
            
            countryDataset = {
                label: countryName,
                data: dataCovidTimeFiltered[charts[chart].chart.config.data.metricName][countryId],
                backgroundColor: window.chartColors[window.chartColorsIndex],
				borderColor: window.chartColors[window.chartColorsIndex],
                fill: false,
                stacked: false,
                lineTension: 0,
                hidden: false
            };
            charts[chart].chart.config.data.datasets.push(countryDataset);
            charts[chart].update();
        }
        activeCountries.push(countryId);
        window.chartColorsIndex++;
        window.chartColorsIndex = (window.chartColorsIndex) % window.chartColors.length;
                        
    }
    function removeCountryFromCharts(countryId, countryName){
        if( !( activeCountries.includes( countryId ) ) ){ return };
        activeCountries = activeCountries.filter( (e) =>  ( e.localeCompare(countryId) )!=0 );
        //console.log(charts[chart].chart.config.data.datasets.filter( (e) => ( e.label.localeCompare(countryName) ) != 0 ))
        for(chart in charts){
            charts[chart].chart.config.data.datasets = charts[chart].chart.config.data.datasets.filter( (e) => ( e.label.localeCompare(countryName) ) != 0);
            charts[chart].update();
        };
    }
    
    function toggleCountryInCharts(countryId, countryName){
        //console.log( activeCountries.includes( countryId ) );
        if( activeCountries.includes( countryId ) ){ removeCountryFromCharts(countryId, countryName); }
        else{ addCountryToCharts(countryId, countryName) };
    }
    
    // Assign html elements to js variables
    var ctx_cases = document.getElementById("casesChart");
    var ctx_casesPerMillion = document.getElementById("casesPerMillionChart");
    var ctx_logCases = document.getElementById("logCasesChart");
    var ctx_casesDaily = document.getElementById("casesDailyChart");
    var ctx_deaths = document.getElementById("deathsChart");
    var ctx_deathsDaily = document.getElementById("deathsDailyChart");
   var ctx_deathsPerMillion = document.getElementById("deathsPerMillionChart")
   var ctx_logDeaths = document.getElementById("logDeathsChart");
   var ctx_caseFatalityRate = document.getElementById("caseFatalityRateChart");
    
   var activeCountries = [];
    
    
    var dataCovid;
    var dataCovidTimeFiltered;
    var charts = [];
    // CALL FOR DATA
    
    progressText(progress, "Loading data...");
    
    var dataCall = $.getJSON( "data.json", function(data, textStatus, jqXHR) {
      console.log( "success" );
    })
      .done(function() {
          console.log( "0.5" );
          
      })
      .fail(function() {
        console.log( "error" );
      })
      .always(function() {
          dataCovid = dataCall.responseJSON.data;
          
          var dateFilter = dataPoint => moment(dataPoint.x, "DD/MM/YYYY").diff(moment("01/01/2020", "DD/MM/YYYY")) >= 0;
    
          dataCovidTimeFiltered = dataCovid;
          /*for( country in dataCovidTimeFiltered.cases ){
              //console.log( dataCovidMarch1.cases[country] );
              dataCovidTimeFiltered.cases[country] = dataCovidTimeFiltered.cases[country].filter(dateFilter);
              dataCovidTimeFiltered.casesPerMillion[country] = dataCovidTimeFiltered.casesPerMillion[country].filter(dateFilter);
              dataCovidTimeFiltered.casesDaily[country] = dataCovidTimeFiltered.casesDaily[country].filter(dateFilter);
               dataCovidTimeFiltered.deaths[country] = dataCovidTimeFiltered.deaths[country].filter(dateFilter);
              dataCovidTimeFiltered.deathsPerMillion[country] = dataCovidTimeFiltered.deathsPerMillion[country].filter(dateFilter);
              dataCovidTimeFiltered.deathsDaily[country] = dataCovidTimeFiltered.deathsDaily[country].filter(dateFilter);
          }*/
          
          addCountriesToList();
          initCharts();
          progress.innerHTML = "";
          updateTimestamp.innerHTML = "Last Updated: ".concat( dataCall.responseJSON.timestamp );
          
          let userCountryMatch = stringSimilarity.findBestMatch(userCountry, Object.getOwnPropertyNames(dataCovid.cases));
          //console.log(userCountryMatch);
          if( userCountryMatch.bestMatch.rating > 0.5){
              userCountry = userCountryMatch.bestMatch.target;
          };
          
          
          //addCountryToCharts('United_States_of_America','United_States_of_America'.replace(/_/g," "));
          $('#'+userCountry).trigger( "click" );
          //$('#United_States_of_America').trigger( "click" );
          //$('#Poland').trigger( "click" );
          
          
      });
    
    
    function initCharts(){
        progressText(progress, "Loading Charts...");
                
        progress.value = 0.8;  
        
          charts.push( chartInit(ctx_cases, dataCovidTimeFiltered.cases,'cases',
                    'COVID-19 Confirmed Cases In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed',
                   'linear','') );
          
          charts.push( chartInit(ctx_casesPerMillion, dataCovidTimeFiltered .casesPerMillion,'casesPerMillion',
                    'COVID-19 Confirmed Cases Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed Per Million People',
                   'linear',''));
          
          charts.push(chartInit(ctx_logCases, dataCovidTimeFiltered.cases,'cases',
                    'COVID-19 Confirmed Cases In Selected Countries  - Logarithmic',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed - Logarithmic',
                   'logarithmic',''));
          
          charts.push(chartInit(ctx_casesDaily, dataCovidTimeFiltered.casesDaily,'casesDaily',
                    'COVID-19 Confirmed Cases (Daily) In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases',
                   'linear',''));
          
          charts.push(chartInit(ctx_deaths, dataCovidTimeFiltered.deaths,'deaths',
                    'COVID-19 Reported Deaths In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Deaths',
                   'linear',''));
          
          charts.push(chartInit(ctx_deathsPerMillion, dataCovidTimeFiltered.deathsPerMillion,'deathsPerMillion',
                    'COVID-19 Reported Deaths Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Deaths Per Million People',
                   'linear',''));
          
          charts.push(chartInit(ctx_deathsDaily, dataCovidTimeFiltered.deathsDaily,'deathsDaily',
                    'COVID-19 Reported Deaths (Daily) In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Reported Deaths',
                   'linear', ''));
          
            charts.push(chartInit(ctx_logDeaths, dataCovidTimeFiltered.deaths,'deaths',
                    'COVID-19 Reported Deaths In Selected Countries - Logarithmic',
                    'Time (DD/MM/YY)',
                   'Reported Deaths - Logarithmic',
                   'logarithmic', ''));
        
            charts.push(chartInit(ctx_caseFatalityRate, dataCovidTimeFiltered.caseFatalityRate, 'caseFatalityRate',
                    'COVID-19 Case Fatality Rate In Selected Countries Since 1000 Confirmed Cases',
                    'Time (DD/MM/YY)',
                   'Case Fatality Rate in Percents',
                   'linear', '%'));
        
    }
    //for

    //const arr3 = data.filter(ageAndGender);
    //console.log('arr3', arr3);
    // INIT CHART
    
    function chartInit(ctx, covidMetric, metricName, chartTitle, xLabel, yLabel, yType, unit){
        
        
        
        return new Chart(ctx, {
        type: 'line',
        data: {
            metricName: metricName,
            datasets: []
        },
        options: {
            
            
            aspectRatio: 0.6,
            
            title: {
					display: true,
					text: chartTitle
				},
            
            scales: {
                xAxes: [{
                    display: true,
						scaleLabel: {
							display: true,
							labelString: xLabel
						},
                    type: 'time',
                    time: {
                        tooltipFormat: 'll',
                    displayFormats: {
                                'millisecond': 'DD/MM/YY',
                               'second': 'DD/MM/YY',
                               'minute': 'DD/MM/YY',
                               'hour': 'DD/MM/YY',
                               'day': 'DD/MM/YY',
                               'week': 'DD/MM/YY',
                               'month': 'DD/MM/YY',
                               'quarter': 'DD/MM/YY',
                               'year': 'DD/MM/YY'
                        },
                        minUnit: 'day',
                        parser: 'DD/MM/YYYY'
                    },
                    position: 'bottom',
                    ticks: {
							major: {
								fontStyle: 'bold',
								fontColor: '#FF0000'
							},
                        
                        autoSkip: true,
                        autoSkipPadding: 25,
                        //FIND
                        min: moment().startOf('day').subtract(1, 'months')
						
                    }
                    
                }],
                yAxes: [{
                        type: yType,
						display: true,
						scaleLabel: {
							display: true,
							labelString: yLabel
						}
					}]
            },
            //responsive: true,
            maintainAspectRatio: false,
            hover: {
					mode: 'x',
					intersect: false,
                    position: 'x'
				},
            tooltips: {
					mode: 'x',
					intersect: false,
                    position: 'nearest',
                    /*filter: function( tooltipItem, array ) {
                           console.log("BANG");
                        console.log(tooltipItem);
                          console.log(array);
                          return true;
                        },*/
                    callbacks: {
                        title(tooltipItems, data) {
                            let title = '';
                            const labels = data.labels;
                            const labelCount = labels ? labels.length : 0;
                            
                            if (tooltipItems.length > 0) {
                                
                                for (let i = 0; i < tooltipItems.length; i++) {
                                    let item = tooltipItems[i];
                                    //console.log(item);
                                    item.value = item.value.concat(unit);
                                    if (item.label) {
                                        //console.log("has label:",item.label, "| includes:",title.includes(item.label));
                                        if( title.includes(item.label) == false ){
                                            if( i==0 ){title = title.concat(item.label);}
                                            else{title = title.concat('\n',item.label);}
                                            //console.log("titleadd:",title, "item.label:",item.label);
                                        }
                                    }
                                    else if (labelCount > 0 && item.index < labelCount) {
                                        //console.log("labels item index");
                                        if( title.includes(labels[item.index]) == false ){
                                            if( i==0 ){title = title.concat(labels[item.index]);}
                                            else{title = title.concat('\n',labels[item.index]);}
                                        }
                                    }
                                } 
                            }
                            //console.log("title:",title);
                            return title;
                        }
                    }
                    },
            plugins: {
            zoom: {
                // Container for pan options
                pan: {
                    // Boolean to enable panning
                    enabled: true,

                    // Panning directions. Remove the appropriate direction to disable 
                    // Eg. 'y' would only allow panning in the y direction
                    mode: 'x',
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: null,
                        y: 0
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: null,
                        y: null
                    },
                    onPanComplete: function({chart}) { /*
                        function getXAxis(chartInstance) {
                            var scales = chartInstance.scales;
                            var scaleIds = Object.keys(scales);
                            for (var i = 0; i < scaleIds.length; i++) {
                                var scale = scales[scaleIds[i]];

                                if (scale.isHorizontal()) {
                                    return scale;
                                }
                            }
                        }

                        function getYAxis(chartInstance) {
                            var scales = chartInstance.scales;
                            var scaleIds = Object.keys(scales);
                            for (var i = 0; i < scaleIds.length; i++) {
                                var scale = scales[scaleIds[i]];

                                if (!scale.isHorizontal()) {
                                    return scale;
                                }
                            }
                        }
                        console.log( [ getXAxis(chart).min, getXAxis(chart).max ] ); 
                        console.log( [ getYAxis(chart).min, getYAxis(chart).max ] );
                        console.log(chart.config.data.datasets);
                        let max = 
                        for(let dataset in datasets){
                            max = dataset.data.
                        }*/
                        
                    }
                },

                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: true,
                    drag: false,

                    // Zooming directions. Remove the appropriate direction to disable 
                    // Eg. 'y' would only allow zooming in the y direction
                    mode: 'x',
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: null,
                        y: 0
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: null,
                        y: null
                    }
                }
            }
        }
            

        }
    });
    }
    


    
  
});

