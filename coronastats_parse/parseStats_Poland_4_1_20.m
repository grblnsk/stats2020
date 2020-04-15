%create code for the charts
clear
[numDATA,txtDATA,rawDATA] = xlsread( "COVID-19-geographic-disbtribution-worldwide.xlsx");
txtDATA = txtDATA(2:end,:);
headers = rawDATA(1,:);
%%
countryCheck = @(row, country) strcmp( txtDATA{row,7}, country );
createDate = @(index) datenum( numDATA(index,3:-1:1));
cases = @(index) numDATA(index,4);
deaths = @(index) numDATA(index,5);
cummulative = @(timewiseIndex, dailyValues) sum( dailyValues(1:timewiseIndex) );
formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');

countryName = 'Poland';
polandCheck = @(row) countryCheck(row, countryName);
polandIndices = find( arrayfun( polandCheck, 1:size(txtDATA,1)) )';
PolandData = [polandIndices arrayfun(createDate, polandIndices)...
    arrayfun(cases ,polandIndices) arrayfun(deaths ,polandIndices)];
PolandData = sortrows(PolandData,2);
PolandData = [PolandData arrayfun( @(index) cummulative(index,PolandData(:,3)), 1:size(PolandData,1))'];
PolandData = [PolandData arrayfun( @(index) cummulative(index,PolandData(:,4)), 1:size(PolandData,1))'];

formatDate = @(dateVal) datestr(dateVal,'dd/mm/yyyy');
    x=[];
    indices = [];
    for k=1:size(PolandData(:,2),1)
        if( PolandData(k,5) > 100 )
            x = [x; formatDate(PolandData(k,2))];
            indices = [indices; k];
        end
    end
    x = string( x );
    y = string( PolandData(indices,6)./PolandData(indices,5) )*100;
    countryJSON = struct( countryName, table(x,y) );

% x=[];
% for k=1:size(PolandData(:,2),1)
%     x = [x;formatDate(PolandData(k,2))];
% end
% y = PolandData(:,5);

pljson = struct( 'data', struct('cases', struct('Poland',table(x,y))) ) ;
jsonCases = jsonencode(pljson);
fid = fopen(['data.json'],'wt');
fprintf(fid, jsonCases);
fclose(fid);
% type([countryName '_cases.txt'])

% moment("21/03/2020", "DD/MM/YYYY").toDate();

% % % PLOTS
figure
hold on
title(['COVID-19 Confirmed Cases in ' countryName])
plot( datetime( PolandData(:,2), 'ConvertFrom','datenum'),PolandData(:, 5), '-o' );
grid minor
hold off

figure
hold on
title(['COVID-19 Deaths in ' countryName])
plot( datetime( PolandData(:,2), 'ConvertFrom','datenum' ),PolandData(:, 6), '-o' );
grid minor
hold off



%%
% %%Country based
% PolandData = parseCountry('Poland', numDATA, txtDATA);
% % plotCountry('Poland',PolandData);
% plCases = countryToCasesPreJSON('Poland',PolandData, formatDate);
