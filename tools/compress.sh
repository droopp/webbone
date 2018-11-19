#!bin/bash

cd ../js

java -jar ../tools/yuicompressor-2.4.8.jar -o '.js$:-min.js' *.js

cat jquery-1.10.2-min.js jquery-ui-1.10.4.custom-min.js json2-min.js json2xml-min.js xml2json-min.js underscore-min.js backbone-min.js jqgridlocale-min.js jqgrid-min.js pivotui-min.js notify-min.js jquery.mask-min.js date-min.js icheck.js json2db-min.js base-min.js start-min.js >>all.js

rm *-min.js

mv all.js ./compress
