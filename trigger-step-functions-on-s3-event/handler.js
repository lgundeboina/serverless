'use strict';

module.exports.eventListner = (event, context) => {
  try {
    console.log(`Received an event from S3 ${JSON.stringify(event)}`);
    
    var params = {
      stateMachineArn: process.env.statemachine_arn,
      input: JSON.stringify(event)
    }

    var AWS = require('aws-sdk');
    AWS.config.region = process.env.REGION;
    
    var stepfunctions = new AWS.StepFunctions(); 
    
    stepfunctions.startExecution(params, function (err, data) {
      if (err) {
        console.log(`error while executing step function ${err}`)
        context.fail(err);

      } else {
        console.log(`started execution of step function ${JSON.stringify(data)}`);
        context.succeed(`SUCEESS.`);

      }
      
    });

  } catch (e) {
    console.log(`Exception ${e}`);
    context.fail(e);
  }
}

module.exports.eventProcess = (event, context) => {
  try {
    const record = event.Records[0];
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;

    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(filename.replace(new RegExp('\\+', 'g'), ' ')); //Replace + with space

    console.log(`A new .csv file has been created: ${key} (${filesize} bytes)`);
    context.succeed({ Bucket: bucket, Key: key });

  } catch (e) {
    console.log(`Exception occured. ${e}`);
    context.fail(err);
  }

};

module.exports.fileProcess = (event, context) => {
  try {

    console.log(`Getting data for ${JSON.stringify(event)}`);

    var AWS = require('aws-sdk');
    AWS.config.region = process.env.REGION;

    const s3 = new AWS.S3({
      apiVersion: '2010-12-01',
      signatureVersion: 'v4'
    });

    s3.getObject(event).promise().then(data => {
      console.log(data.Body.toString('utf-8'));
      context.succeed(data.Body.toString('utf-8'));

    }).catch(err => {
      console.log(`Error when reading file from S3. ${err}`)
      context.fail(err)
    });

  } catch (e) {
    console.log(`Exception occured. ${e}`);
    context.fail(e);
  }
}
