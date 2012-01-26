@REM  !!! attention !!!
@REM  "compile.bat" will not be distributed.
@REM  Instead, README file will show how to setup 'less' run-time environment.
@REM  !!! attention !!!

set PATH=.\not_distributed\ajaxorg-node-builds-bbbdd1c\win32;.\not_distributed\cloudhead-less.js-7739fb1\bin;%PATH%
set NODE_PATH=.\not_distributed\cloudhead-less.js-7739fb1\lib

@REM Compiles .less files in current folder, iphone, android and blackberry folders.
node compile.js
rem pause
