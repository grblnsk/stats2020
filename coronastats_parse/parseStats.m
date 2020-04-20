%create code for the charts
clear
today = datetime( datestr(now,'dd/mm/yyyy'),'InputFormat','dd/MM/yyyy'  );
todayNum = datenum(today);
days30Ago = datetime( datestr( datenum(today-30),'dd/mm/yyyy' ),'InputFormat','dd/MM/yyyy' );
days30AgoNum = datenum(days30Ago);
March1 = datetime('01/03/2020','InputFormat','dd/MM/yyyy');
todayECDC = datestr(now,'yyyy-mm-dd');
% todayECDC = datestr(now,'2020-04-08');

updateTimestamp = string( datetime('now','TimeZone','local','Format','d-MMM-y HH:mm:ss Z') );

% url = ['https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-' todayECDC '.xlsx'];
url = ['https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide.xlsx'];
filename = "COVID-19-geographic-disbtribution-worldwide.xlsx";
outfilename = websave(filename,url)

disp(['downloaded'])

[numDATA,txtDATA,rawDATA] = xlsread( outfilename );
txtDATA = txtDATA(2:end,:);
headers = rawDATA(1,:);

disp(['pre-processed'])
%%
formatDate = @(dateVal) datestr(dateVal,'dd/MM/yyyy');

Countries = string( unique(txtDATA(:,11)) );

jsonDataStruct = struct();
for k=1:size(Countries,1)
    disp([Countries(k)])
    countryName = replace( Countries(k,:), '(', '_');
    countryName = replace( countryName, ')', '_');
    countryName = replace( countryName, 'ç', 'c');
    countryName = replace( countryName, ',', '_');
    countryName = replace( countryName, ' ', '_');
    countryName = replace( countryName, 'Ã', 'a');
    countryName = replace( countryName, '§', 's');
    countryData = parseCountry(countryName, numDATA, txtDATA);
    countryCases = countryToCasesPreJSON(countryName,countryData);
    countryCasesDaily = countryToCasesDailyPreJSON(countryName,countryData);
    countryDeaths = countryToDeathsPreJSON(countryName,countryData);
    countryDeathsDaily = countryToDeathsDailyPreJSON(countryName,countryData);
    countryCasesPerMillion = countryToCasesPerMillionPreJSON(countryName,countryData);
    countryDeathsPerMillion = countryToDeathsPerMillionPreJSON(countryName,countryData);
    countryCaseFatalityRate = countryToCaseFatalityRatePreJSON(countryName,countryData);
    jsonDataStruct.data.cases.(countryName) = countryCases.(countryName);
    jsonDataStruct.data.deaths.(countryName) = countryDeaths.(countryName);
    jsonDataStruct.data.casesDaily.(countryName) = countryCasesDaily.(countryName);
    jsonDataStruct.data.deathsDaily.(countryName) = countryDeathsDaily.(countryName);
    jsonDataStruct.data.casesPerMillion.(countryName) = countryCasesPerMillion.(countryName);
    jsonDataStruct.data.deathsPerMillion.(countryName) = countryDeathsPerMillion.(countryName);
    jsonDataStruct.data.caseFatalityRate.(countryName) = countryCaseFatalityRate.(countryName);
end
jsonDataStruct.timestamp = updateTimestamp;
jsonData = jsonencode(jsonDataStruct);
fid = fopen(['data.json'],'wt');
fprintf(fid, jsonData);
fclose(fid);

disp(['done'])

function countryData = parseCountry(countryName, numData, txtData)

countryCheck = @(row, country) strcmp( txtData{row,11}, countryName );
createDate = @(index) datenum( numData(index,3:-1:1));
cases = @(index) numData(index,4);
deaths = @(index) numData(index,5);
population = @(index) numData(index,9);
cummulative = @(timewiseIndex, dailyValues) sum( dailyValues(1:timewiseIndex) );

countryCheck2 = @(row) countryCheck(row, countryName);
countryIndices = find( arrayfun( countryCheck2, 1:size(txtData,1)) )';
countryData = [countryIndices arrayfun(createDate, countryIndices)...
    arrayfun(cases ,countryIndices) arrayfun(deaths ,countryIndices)];
countryData = sortrows(countryData,2);
countryData = [countryData arrayfun( @(index) cummulative(index,countryData(:,3)), 1:size(countryData,1))'];
countryData = [countryData arrayfun( @(index) cummulative(index,countryData(:,4)), 1:size(countryData,1))'];
countryData = [countryData arrayfun(population ,countryIndices)];

end

function countryJSON = countryToCasesPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,5) );
    countryJSON = struct( countryName, table(x,y) );
    
end

function countryJSON = countryToCasesPerMillionPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,5)./ (countryData(:,7)./1000000) );
    countryJSON = struct( countryName, table(x,y) );
end

function countryJSON = countryToDeathsPerMillionPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,6)./ (countryData(:,7)./1000000) );
    countryJSON = struct( countryName, table(x,y) );
end

function countryJSON = countryToCasesDailyPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,3) );
    countryJSON = struct( countryName, table(x,y) );
    
end

function countryJSON = countryToDeathsPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,6) );
    countryJSON = struct( countryName, table(x,y) );
end

function countryJSON = countryToDeathsDailyPreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    for k=1:size(countryData(:,2),1)
        x = [x;formatDate(countryData(k,2))];
    end
    x = string( x );
    y = string( countryData(:,4) );
    countryJSON = struct( countryName, table(x,y) );
end

function countryJSON = countryToCaseFatalityRatePreJSON(countryName, countryData)
    formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    indices = [];
    for k=1:size(countryData(:,2),1)
        if( countryData(k,5) >= 1000 )
            x = [x; formatDate(countryData(k,2))];
            indices = [indices; k];
        end
    end
    x = string( x );
    y = string( 100.*countryData(indices,6)./countryData(indices,5) );
    countryJSON = struct( countryName, table(x,y) );
   
end

% % % PLOTS
function plotCountry( countryName, countryData )
figure
hold on
title(['COVID-19 Confirmed Cases in ' countryName])
plot( datetime( countryData(:,2), 'ConvertFrom','datenum'),countryData(:, 5), '-o' );
grid minor
hold off

figure
hold on
title(['COVID-19 Deaths in ' countryName])
plot( datetime( countryData(:,2), 'ConvertFrom','datenum' ),countryData(:, 6), '-o' );
grid minor
hold off
end



