'use strict';

module.exports.fileProcess = (event) => {
  try {
    const record = event.Records[0];
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;

    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(filename.replace(new RegExp('\\+', 'g'), ' ')); //Replace + with space


    console.log(`A new .csv file has been created: ${key} (${filesize} bytes)`);

    var AWS = require('aws-sdk');
    AWS.config.region = process.env.REGION;

    const s3 = new AWS.S3({
      apiVersion: '2010-12-01',
      signatureVersion: 'v4'
    });

    s3.getObject({ Bucket: bucket, Key: key }).promise().then(data => {
      console.log(data.Body.toString('utf-8'));
    }).catch(err => {
      console.log(`Error when reading file from S3. ${err}`)
    });

  } catch (e) {
    console.log(`Exception occured. ${e}`);
  }

};

