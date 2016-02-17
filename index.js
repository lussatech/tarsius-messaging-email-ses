/**
 * SMTP Mail Service
 */

var Promise = require('bluebird'),
	nodemailer = require('nodemailer'),
	sesTransport = require('nodemailer-ses-transport');

var Ses = function(configs){
    // configure transporter
    this.transporter = Promise.promisifyAll(nodemailer.createTransport(sesTransport({
		accessKeyId : configs.accessKeyId,
		secretAccessKey : configs.secretAccessKey,
		sessionToken : configs.sessionToken,
		region : configs.region || 'us-east-1',
		rateLimit : configs.rateLimit || 1
	})));
    this.transporter.use('compile', htmlToText());
};

/**
 * send function
 * @param  {Object} author   { name : {string}, email : {email}  }
 * @param  {String} receiver receiver email address
 * @param  {String} subject  email title / subjects
 * @param  {String} content  html mail content
 * @return {Promise}
 */
Ses.prototype.send = function(author,receiver,subject,content){
    // make request
    return this.transporter.sendMailAsync({
        'from' : author.name+' <'+author.email+'>',
        'to' : receiver,
        'subject' : subject,
        'html' : content
    });
};

module.exports = function(configs) {
    return new Ses(configs);
};
