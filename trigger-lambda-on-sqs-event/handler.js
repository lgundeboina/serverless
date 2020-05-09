'use strict';

module.exports.sqsTrigger = (event) => {
  try {
    console.log(JSON.stringify(event));
    //const body = JSON.parse(event.body);
    console.log('SQS_URL', process.env.SQS_URL);
    if(+event.Records[0].attributes.ApproximateReceiveCount < 3){
      throw new Error('less than 3')
    }else{
      return;
    }

  } catch (e) {
    console.log(`Exception occured. ${e}`);
  }

};

