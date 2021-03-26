call pkg . -t node12-win
md sql_server
cd sql_server
copy ..\sql_server.exe
copy ..\CRC_CAT.db
copy  ..\statements.json
xcopy /E /I ..\config config
