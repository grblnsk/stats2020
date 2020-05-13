$( document ).ready(function() {
    

    
    // Assign html elements to js variables
    var ctx_cases = document.getElementById("casesChart");
    var ctx_casesPerMillion = document.getElementById("casesPerMillionChart");
    var ctx_logCases = document.getElementById("logCasesChart");
    var ctx_casesDaily = document.getElementById("casesDailyChart");
    var ctx_casesDailyPerMillion = document.getElementById("casesDailyPerMillionChart");
    var ctx_deaths = document.getElementById("deathsChart");
    var ctx_deathsDaily = document.getElementById("deathsDailyChart");
    var ctx_deathsDailyPerMillion = document.getElementById("deathsDailyPerMillionChart");
   var ctx_deathsPerMillion = document.getElementById("deathsPerMillionChart")
   var ctx_logDeaths = document.getElementById("logDeathsChart");
   var ctx_caseFatalityRate = document.getElementById("caseFatalityRateChart");
    
    var chartList = $('#chartList');
    var chartTabs = $('#chartTabs');
    function addChartToList(chartTabId, canvasId, title1, title2, description){
        chartList.append( '<a class="list-group-item list-group-item-action" data-toggle="list" href="#'+chartTabId+'" role="tab"><p class="h6">'+title1+'</p>'+title2+'</a>' );
        
        chartTabs.append('<div class="tab-pane fade" id="'+chartTabId+'" role="tabpanel"><div class="col-md-12 col-sm-12"><div class="card"> <div class="card-body"><br><div id="wrapper" style="position: relative; height: 70vh"><canvas id="'+canvasId+'"></canvas></div></div></div><hr><div class="card"><div class="card-body"><p>'+description+'</p><p>The chart uses the latest data acquired from European Center for Disease Prevention and Control (ECDC) at the time shown in the top of the website "Last Updated".</p></div></div></div></div>');
    }
    
    //CASES
    addChartToList("casesDay0", "casesDay0Chart", "Day 0: Confirmed Cases", "Cumulative", "In the chart you can find data on the total number of COVID-19 confirmed cases since the pandemic started for the countries you selected.");
    var ctx_casesDay0 = document.getElementById("casesDay0Chart");
        
    addChartToList("casesPerMillionDay0", "casesPerMillionDay0Chart", "Day 0: Confirmed Cases", "Per 1 Million People", "This chart shows how the number of confirmed cases is related to the population of a selected country. In the chart you can find data on the total number of confirmed cases per one million people living in the countries you selected.");
    var ctx_casesPerMillionDay0 = document.getElementById("casesPerMillionDay0Chart");
    
    addChartToList("casesDailyDay0", "casesDailyDay0Chart", "Day 0: Confirmed Cases", "Daily", "In the chart you can find data on the number of new confirmed cases that were reported on a given day for the countries you selected. This chart does not show the total number of cases on any given day.");
    var ctx_casesDailyDay0 = document.getElementById("casesDailyDay0Chart");
    
    addChartToList("casesDailyPerMillionDay0", "casesDailyPerMillionDay0Chart", "Day 0: Confirmed Cases", "Daily - Per 1 Million People", "In the chart you can find data on the number of new confirmed cases that were reported on a given day per one million people living in the countries you selected.");
    var ctx_casesDailyPerMillionDay0 = document.getElementById("casesDailyPerMillionDay0Chart");
    
    //DEATHS
    addChartToList("deathsDay0", "deathsDay0Chart", "Day 0: Reported Deaths", "Cumulative", "In the chart you can find data on the total number of reported deaths from COVID-19 since the pandemic started for the countries you selected.");
    var ctx_deathsDay0 = document.getElementById("deathsDay0Chart");
        
    addChartToList("deathsPerMillionDay0", "deathsPerMillionDay0Chart", "Day 0: Reported Deaths", "Per 1 Million People", "This chart shows how the number of reported deaths from COVID-19 is related to the population of a selected country. In the chart you can find data on the total number of deaths per one million people living in the countries you selected.");
    var ctx_deathsPerMillionDay0 = document.getElementById("deathsPerMillionDay0Chart");
    
    addChartToList("deathsDailyDay0", "deathsDailyDay0Chart", "Day 0: Reported Deaths", "Daily", "In the chart you can find data on the number of new deaths from COVID-19 that were reported on a given day for the countries you selected.");
    var ctx_deathsDailyDay0 = document.getElementById("deathsDailyDay0Chart");
    
    addChartToList("deathsDailyPerMillionDay0", "deathsDailyPerMillionDay0Chart", "Day 0: Reported Deaths", "Daily - Per 1 Million People", "In the chart you can find data on the number of new deaths from COVID-19 that were reported on a given day per one million people living in the countries you selected.");
    var ctx_deathsDailyPerMillionDay0 = document.getElementById("deathsDailyPerMillionDay0Chart");
    
    //MORTALITY
    
    addChartToList("caseFatalityRateDay0", "caseFatalityRateDay0Chart", "Day 0: Case Fatality Rate", "In Percent", "In this chart you can find data on the <a href=\"https://en.wikipedia.org/wiki/Case_fatality_rate\">case fatality rate</a> (CFR) since the pandemic started. Case fatality rate is defined here as the total number of reported deaths divided by the total number of confirmed cases. The index here is only calculated for days where the cumulative number of cases exceeds 1000.");
    var ctx_caseFatalityRateDay0 = document.getElementById("caseFatalityRateDay0Chart");
    
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
            //console.log(countryId);
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
            setMaximumYLimitBasedOnVisibleDatapoints(charts[chart]);
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
            setMaximumYLimitBasedOnVisibleDatapoints(charts[chart]);
        };
    }
    
    function toggleCountryInCharts(countryId, countryName){
        //console.log( activeCountries.includes( countryId ) );
        if( activeCountries.includes( countryId ) ){ removeCountryFromCharts(countryId, countryName); }
        else{ addCountryToCharts(countryId, countryName) };
    }
    
    
    
   var activeCountries = [];
    
    
    var dataCovid;
    var dataCovidTimeFiltered;
    var charts = [];
    // CALL FOR DATA
    
    progressText(progress, "Loading data...");
    /////////////////////////////////////////
    var t0 = performance.now();
    
    var dataCall = {responseJSON:{}};
    fetch('https://cors-anywhere.herokuapp.com/https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide.xlsx').then(function(res) {
        
      
      if(!res.ok) throw new Error("fetch failed");
      //console.log(res);
      return res.arrayBuffer();
    }).then(function(ab) {
      let t0 = performance.now();
      let data = new Uint8Array(ab);
      //console.log(data);
      let workbook = XLSX.read(data, {type:"array"});
      //console.log(workbook);
      let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      let processedData = processData(sheet);
      dataCall.responseJSON = processedData;
      dataCovid = dataCall.responseJSON.data;
      let t1 = performance.now();
      console.log("Fetch processed in " + (t1 - t0) + " milliseconds.");
        
      var dateFilter = dataPoint => moment(dataPoint.x, "DD/MM/YYYY").diff(moment("01/01/2020", "DD/MM/YYYY")) >= 0;
    
          dataCovidTimeFiltered = dataCovid;
          
          //console.log( dataCovidTimeFiltered );
          
          for(metric in dataCovidTimeFiltered){
              
              let Day0Metric = metric.concat("Day0");
              dataCovidTimeFiltered[Day0Metric] = {};
              //console.log(Day0Metric);
              
              for( country in dataCovidTimeFiltered.cases ){
                  let cases100 = dataCovidTimeFiltered.cases[country].filter(el => el.y >= 100);
                  casesX100 = cases100.map(el => el.x);
                  //console.log(casesX100);
                  let data100 = dataCovidTimeFiltered[metric][country].filter(el => casesX100.includes(el.x));
                  let numOfDays = data100.length;
                  let startDate = moment("31/12/0000","DD/MM/YYYY");
                  let data100Day0 =[];
                  let data100_2 =[];
                  for(let i=0; i< numOfDays; i++){
                      data100Day0[i] = startDate.add(1,'day').format("DD/MM/YYYY");
                      data100_2[i] = {x: data100Day0[i], y: data100[i].y}
                  }
                  dataCovidTimeFiltered[Day0Metric][country] = data100_2;
              }
              
          }
          //console.log(dataCovidTimeFiltered);
          
          addCountriesToList();
          initCharts();
          progress.innerHTML = "";
          updateTimestamp.innerHTML = "Last Updated: ".concat( dataCall.responseJSON.timestamp );
          
          try {
              let userCountryMatch = stringSimilarity.findBestMatch(userCountry, Object.getOwnPropertyNames(dataCovid.cases));
              //console.log(userCountryMatch);
              if( userCountryMatch.bestMatch.rating > 0.5){
                  userCountry = userCountryMatch.bestMatch.target;
              };
              $('#'+userCountry).trigger( "click" );
          }catch(err){
              console.log("Error of String Similarity")
              $('#United_States_of_America').trigger( "click" );
          }
          $('#'+'casesDailyButton').trigger( "click" );
          //
          //$('#Poland').trigger( "click" );
        let t2 = performance.now();
        console.log("Loaded in " + (t2 - t0) + " milliseconds.");
        
    });
    ///////////////////////////////////////
    
    
    function initCharts(){
        progressText(progress, "Loading Charts...");
                
        progress.value = 0.8;  
        
        let normalStartDate = moment().startOf('day').subtract(2, 'months');
        let day0StartDate = moment("31/12/0000","DD/MM/YYYY");
        
        
          charts.push( chartInit(ctx_cases, dataCovidTimeFiltered.cases,'cases',
                    'COVID-19 Confirmed Cases In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed',
                   'linear','',normalStartDate) );
          
          charts.push( chartInit(ctx_casesPerMillion, dataCovidTimeFiltered .casesPerMillion,'casesPerMillion',
                    'COVID-19 Confirmed Cases Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases Per Million People',
                   'linear','',normalStartDate,normalStartDate));
          
          charts.push(chartInit(ctx_logCases, dataCovidTimeFiltered.cases,'cases',
                    'COVID-19 Confirmed Cases In Selected Countries  - Logarithmic',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed - Logarithmic',
                   'logarithmic','',normalStartDate));
          
          charts.push(chartInit(ctx_casesDaily, dataCovidTimeFiltered.casesDaily,'casesDaily',
                    'COVID-19 Confirmed Cases (Daily) In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases - Daily',
                   'linear','',normalStartDate));
        
        charts.push(chartInit(ctx_casesDailyPerMillion, dataCovidTimeFiltered.casesDailyPerMillion,'casesDailyPerMillion',
                    'COVID-19 Reported Cases (Daily) Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Reported Cases Per Million People - Daily',
                   'linear', '',normalStartDate));
          
          charts.push(chartInit(ctx_deaths, dataCovidTimeFiltered.deaths,'deaths',
                    'COVID-19 Reported Deaths In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Deaths',
                   'linear','',normalStartDate));
          
          charts.push(chartInit(ctx_deathsPerMillion, dataCovidTimeFiltered.deathsPerMillion,'deathsPerMillion',
                    'COVID-19 Reported Deaths Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Deaths Per Million People',
                   'linear','',normalStartDate));
          
          charts.push(chartInit(ctx_deathsDaily, dataCovidTimeFiltered.deathsDaily,'deathsDaily',
                    'COVID-19 Reported Deaths (Daily) In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Reported Deaths - Daily',
                   'linear', '',normalStartDate));
        
            charts.push(chartInit(ctx_deathsDailyPerMillion, dataCovidTimeFiltered.deathsDailyPerMillion,'deathsDailyPerMillion',
                    'COVID-19 Reported Deaths (Daily) Per Million People In Selected Countries',
                    'Time (DD/MM/YY)',
                   'Reported Deaths Per Million People - Daily',
                   'linear', '',normalStartDate));
          
            charts.push(chartInit(ctx_logDeaths, dataCovidTimeFiltered.deaths,'deaths',
                    'COVID-19 Reported Deaths In Selected Countries - Logarithmic',
                    'Time (DD/MM/YY)',
                   'Reported Deaths - Logarithmic',
                   'logarithmic', '',normalStartDate));
        
            charts.push(chartInit(ctx_caseFatalityRate, dataCovidTimeFiltered.caseFatalityRate, 'caseFatalityRate',
                    'COVID-19 Case Fatality Rate In Selected Countries Since 1000 Confirmed Cases',
                    'Time (DD/MM/YY)',
                   'Case Fatality Rate in Percents',
                   'linear', '%',normalStartDate));
        
        //cases day 0
        charts.push( chartInit(ctx_casesDay0, dataCovidTimeFiltered.casesDay0,'casesDay0',
                    'COVID-19 Confirmed Cases In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Cases Confirmed',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_casesPerMillionDay0, dataCovidTimeFiltered.casesPerMillionDay0,'casesPerMillionDay0',
                    'COVID-19 Confirmed Cases Per Million People Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases Per Million People',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_casesDailyDay0, dataCovidTimeFiltered.ctx_casesDailyDay0,'casesDailyDay0',
                    'COVID-19 Confirmed Cases (Daily) In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases - Daily',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_casesDailyPerMillionDay0, dataCovidTimeFiltered.casesDailyPerMillionDay0,'casesDailyPerMillionDay0',
                    'COVID-19 Reported Cases (Daily) Per Million People In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Confirmed Cases Per Million People - Daily',
                   'linear','',day0StartDate) );
        
        
        //deaths day 0 
        
        charts.push( chartInit(ctx_deathsDay0, dataCovidTimeFiltered.deathsDay0,'deathsDay0',
                    'COVID-19 Reported Deaths In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Reported Deaths',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_deathsPerMillionDay0, dataCovidTimeFiltered.deathsPerMillionDay0,'deathsPerMillionDay0',
                    'COVID-19 Reported Deaths Per Million People In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Reported Deaths - Per Million People',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_deathsDailyDay0, dataCovidTimeFiltered.deathsDailyDay0,'deathsDailyDay0',
                    'COVID-19 Reported Deaths (Daily) In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Reported Deaths - Daily',
                   'linear','',day0StartDate) );
        
        charts.push( chartInit(ctx_deathsDailyPerMillionDay0, dataCovidTimeFiltered.deathsDailyPerMillionDay0,'deathsDailyPerMillionDay0',
                    'COVID-19 Reported Deaths (Daily) Per Million People In Selected Countries Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Reported Deaths Per Million People - Daily',
                   'linear','',day0StartDate) );
        
        //cfr day 0
        
        charts.push( chartInit(ctx_caseFatalityRateDay0, dataCovidTimeFiltered.caseFatalityRateDay0,'caseFatalityRateDay0',
                    'COVID-19 Case Fatality Rate In Selected Countries From 1000 Confirmed Cases, Since Day 0 (after first 100 confirmed cases)',
                    'Time (DD/MM/YY)',
                   'Case Fatality Rate in Percents',
                   'linear','%',day0StartDate) );
        
    }
    
    
    //for

    //const arr3 = data.filter(ageAndGender);
    //console.log('arr3', arr3);
    // INIT CHART
    
    
    function chartInit(ctx, covidMetric, metricName, chartTitle, xLabel, yLabel, yType, unit, startDate){
        
        
        
        return new Chart(ctx, {
        type: 'line',
        data: {
            metricName: metricName,
            datasets: []
        },
        options: {
            
            legend: {
                    display: true,
                    onClick: function(e, legendItem){
                        //console.log(defaultLegendClickHandler);
                        var chart = this.chart;
                        var defaultLegendClickHandler = function(t,e,chart){
                            var n=e.datasetIndex;
                            i=chart;
                            a=i.getDatasetMeta(n);
                            a.hidden=null===a.hidden?!i.data.datasets[n].hidden:null;
                            i.update()
                        };
                        defaultLegendClickHandler(e, legendItem,chart);
                        setMaximumYLimitBasedOnVisibleDatapoints(chart);
                    }
            },
            
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
                        min: startDate
						
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
                    onPanComplete: setMaximumYLimitBasedOnVisibleDatapoints
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
                    },
                    onZoomComplete: setMaximumYLimitBasedOnVisibleDatapoints
                }
            }
        }
            

        }
    });
    }
    
    var  getXAxis = function(chartInstance) {
                            var scales = chartInstance.scales;
                            var scaleIds = Object.keys(scales);
                            for (var i = 0; i < scaleIds.length; i++) {
                                var scale = scales[scaleIds[i]];

                                if (scale.isHorizontal()) {
                                    return scale;
                                }
                            }
                        };
    
    var getYAxis = function(chartInstance) {
                            var scales = chartInstance.scales;
                            var scaleIds = Object.keys(scales);
                            for (var i = 0; i < scaleIds.length; i++) {
                                var scale = scales[scaleIds[i]];

                                if (!scale.isHorizontal()) {
                                    return scale;
                                }
                            }
                        };
    
    var round_to_precision =  function(x, precision) {
        var y = +x + (precision === undefined ? 0.5 : precision/2);
        return y - (y % (precision === undefined ? 1 : +precision));
    }   
    
            var setMaximumYLimitBasedOnVisibleDatapoints = function({chart}) { 
                        
                        //console.log( [ getXAxis(chart).min, getXAxis(chart).max ] ); 
                        //console.log( [ getYAxis(chart).min, getYAxis(chart).max ] );
                        
                        let xMin = getXAxis(chart).min;
                        let xMax = getXAxis(chart).max;
                        let dateFilter = 
                            dataPoint => 
                            moment(dataPoint.x, "DD/MM/YYYY").diff(xMin) >= 0
                            && moment(dataPoint.x, "DD/MM/YYYY").diff(xMax) <= 0 ;
                        let maxVal = 0;
                        let minVal = Number.MAX_VALUE;
                        for (datasetIndex in chart.config.data.datasets){
                            
                            let dataset = chart.config.data.datasets[datasetIndex];
                            //console.log(dataset);
                            key = Object.keys(dataset._meta)[0];
                            //if( hidden in dataset._meta )
                            if(dataset._meta[key].hidden) {continue;}
                            
                            let ddata = dataset.data;
                            //console.log(ddata);
                            let visibleData = ddata.filter(dateFilter);
                            //console.log(visibleData);
                            let yData = visibleData.map(el =>{ return Number(el.y) });
                            //console.log(Math.max(...yData));
                            let maxDatasetValue = Math.max(...yData);
                            let minDatasetValue = Math.min(...yData);
                            if(maxVal<maxDatasetValue){maxVal = maxDatasetValue;};
                            if(minVal>minDatasetValue){minVal = minDatasetValue;};
                            
                        }
                        //console.log(chart.config.options.scales.yAxes[0].ticks.max);
                        let maxDecs = Math.pow( 10, Math.ceil(Math.log10(maxVal))-1 );
                        let minDecs = Math.pow( 10, Math.floor(Math.log10(maxVal))-1 );
                        chart.config.options.scales.yAxes[0].ticks.max = round_to_precision(maxVal+maxDecs/2, maxDecs/5);
                        let newYminVal = round_to_precision(minVal-minDecs, minDecs/5);
                        if(newYminVal<0) newYminVal = 0;
                        //chart.config.options.scales.yAxes[0].ticks.min = newYminVal;
                        chart.update();
                        
            }
            
  
});

