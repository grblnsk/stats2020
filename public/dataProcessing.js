/*$( document ).ready(function() {
    console.log( getData() );
});*/

var getData = function(){
    var t0 = performance.now();
    return fetch('https://cors-anywhere.herokuapp.com/https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide.xlsx').then(function(res) {
      if(!res.ok) throw new Error("fetch failed");
      //console.log(res);
      return res.arrayBuffer();
    }).then(function(ab) {
      let data = new Uint8Array(ab);
      //console.log(data);
      let workbook = XLSX.read(data, {type:"array"});
      //console.log(workbook);
      let sheetJSON = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      //console.log( processData(sheet) );
      let t1 = performance.now();
      //console.log("Fetch processed in " + (t1 - t0) + " milliseconds.");
      return processData(sheetJSON);
    });  
}

var processData = function(ecdcData) {
        //console.log(ecdcData);
        //data is the JSON string
        //DATASET-LEVEL
        let countryNames = [...new Set(ecdcData.map((obj)=> obj.countriesAndTerritories))];
        let countryGeoIds = [...new Set(ecdcData.map((obj)=> obj.geoId))];
        
        let t0 = performance.now();
        let countriesData = countryGeoIds.map( (geoId) => processCountryData(geoId, ecdcData) );
        let t1 = performance.now();
        console.log("Countries processed in " + (t1 - t0) + " milliseconds.");
    
        return {
            "data":{
                cases: countriesData.reduce( (a,b)=> (a[b.name]=b.cases,a),{} ),
                casesDaily: countriesData.reduce( (a,b)=> (a[b.name]=b.casesDaily,a),{} ),
                casesDailyPerMillion: countriesData.reduce( (a,b)=> (a[b.name]=b.casesDailyPerMillion,a),{} ),
                casesPerMillion: countriesData.reduce( (a,b)=> (a[b.name]=b.casesPerMillion,a),{} ),
                deaths: countriesData.reduce( (a,b)=> (a[b.name]=b.deaths,a),{} ),
                deathsDaily: countriesData.reduce( (a,b)=> (a[b.name]=b.deathsDaily,a),{} ),
                deathsDailyPerMillion: countriesData.reduce( (a,b)=> (a[b.name]=b.deathsDailyPerMillion,a),{} ),
                deathsPerMillion: countriesData.reduce( (a,b)=> (a[b.name]=b.deathsPerMillion,a),{} ),
                caseFatalityRate: countriesData.reduce( (a,b)=> (a[b.name]=b.caseFatalityRate,a),{} )
            },
            "timestamp":moment().local().toString()}
};

var processCountryData = function(countryGeoId, ecdcData){
        //COUNTRY-LEVEL
        let countryData = ecdcData.filter( (obj) => obj.geoId.localeCompare(countryGeoId) == 0 ).reverse();
        //console.log(countryData);
        let population = countryData[0].popData2019;
        let name = countryData[0].countriesAndTerritories;
        const cummulator = (accumulator, currentValue) => accumulator + currentValue;
        
        //CASE-LEVEL
        let casesDaily = countryData.map( entry => ({x:entry.day+'/'+entry.month+'/'+entry.year, y:entry.cases}) );
        let casesDailyPerMillion = casesDaily.map( (xyEntry) => (
            {
             x:xyEntry.x,
             y:1000000*xyEntry.y/population
            }
        ) );
        let cases = casesDaily.map( (xyEntry,index) => (
            {
             x:xyEntry.x,
             y:countryData.slice(0,index+1)
                .map(entry => parseInt(entry.cases))
                .reduce(cummulator)
            }
        ) );
        let casesPerMillion = cases.map( (xyEntry) => (
            {
             x:xyEntry.x,
             y:1000000*xyEntry.y/population
            }
        ) );
        
        
        
        //DEATH-LEVEL
        let deathsDaily = countryData.map( entry => ({x:entry.day+'/'+entry.month+'/'+entry.year, y:entry.deaths}) );
        let deathsDailyPerMillion = deathsDaily.map( (xyEntry) => (
            {
             x:xyEntry.x,
             y:1000000*xyEntry.y/population
            }
        ) );
        let deaths = deathsDaily.map( (xyEntry,index) => (
            {
             x:xyEntry.x,
             y:countryData.slice(0,index+1)
                .map(entry => parseInt(entry.deaths))
                .reduce(cummulator)
            }
        ) );
        let deathsPerMillion = deaths.map( (xyEntry) => (
            {
             x:xyEntry.x,
             y:1000000*xyEntry.y/population
            }
        ) );
        
        //CFR-LEVEL
        //console.log(cases[0])
        //console.log(deaths.filter((entry, index) => cases[index].y >= 1000 ))
        //console.log(cases.filter((entry, index) => cases[index].y >= 1000 ))
        
        let casesOver1000 = cases.filter( (entry, index) => cases[index].y >= 1000 );
        let caseFatalityRate = deaths.filter( (entry, index) => cases[index].y >= 1000 );
        //console.log(casesOver1000);
        //console.log(caseFatalityRate);
        caseFatalityRate = caseFatalityRate.map((xyEntry, index) => (
            {
             x:xyEntry.x,
             y:Number(100*xyEntry.y/casesOver1000[index].y).toPrecision(4)
            }
        ) );
    
        let processedCountryData = {
            name: name.replace("(","_").replace(")","_").replace(",","_"),
            population: population,
            cases: cases,
            casesPerMillion: casesPerMillion,
            casesDaily: casesDaily,
            casesDailyPerMillion: casesDailyPerMillion,
            deaths: deaths,
            deathsPerMillion: deathsPerMillion,
            deathsDaily: deathsDaily,
            deathsDailyPerMillion: deathsDailyPerMillion,
            caseFatalityRate: caseFatalityRate
        };
        
        return processedCountryData;
};