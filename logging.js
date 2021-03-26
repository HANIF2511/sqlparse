// logging.js
// ========
const winston = require('winston');

var logFilenameNumber = false;
const config = require('config');
const loggingConfig = config.get('Customer.loggingConfig');
logFilenameNumber = loggingConfig.logFilenameNumber;


const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, printf  } = format;



const myFormat = printf(({ level, message, label, timestamp }) => {
	//var outmsg = `${timestamp} [${label}] ${level}: ${message}`;
	var outmsg = `${timestamp} [${label}] ${level}: ${message}`;

  return outmsg;
});



const logger = winston.createLogger({

    format: combine(
        //    label(),
        timestamp(),
        //prettyPrint()
        myFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log'
        }),
        new winston.transports.File({
			level: 'warning',
            filename: 'trans.log'
        })
    ],
	silent: loggingConfig.silent

});



module.exports = {
    log: function(thisLine, level, message) {
        if (typeof thisLine == "undefined")
            thisLine = "";
        logger.log({
            label: thisLine,
            level: level,
            message: message
			
        });

    },
    info: function(message) {
        logger.info(message);

    },
    trans: function(level,message) {
            logger.log({
            level: level,
            message: message
        });

    },
	
	getThisLine: function() {
        function splitName(str) {
            return str.split('\\').pop().split('/').pop();
        }
		function buildfoundMatch(match)
		{
			var filename = match[1];
			filename = splitName(filename);
			foundMatch = filename + ':' + match[2] + ':' + match[3];
			return foundMatch;
		}

		var foundMatch = "";

		if (logFilenameNumber) {
            const e = new Error();
            const regex = /\((.*):(\d+):(\d+)\)$/
            const match = regex.exec(e.stack.split("\n")[2]);
            if (match == null) {
				const regex1 =/(.*):(\d+):(\d+)$/
				const match1 = regex1.exec(e.stack.split("\n")[2]);
			}
            if (match != null) {
				foundMatch = buildfoundMatch(match);
            }else
			{
				const regex1 =/(.*):(\d+):(\d+)$/
				const match1 = regex1.exec(e.stack.split("\n")[2]);
	            if (match1 != null) {
					foundMatch = buildfoundMatch(match1);
				}

			}
        }
        return foundMatch;
    }



};