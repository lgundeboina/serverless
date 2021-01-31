import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
const AWS = require('aws-sdk');

export const hello: APIGatewayProxyHandler = async (event, context) => {
  const body = JSON.parse(event.body);
  const postData = body.data;  
  await sleep(45000);

  const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: endpoint
  });

  const params = {
    ConnectionId: event.requestContext.connectionId,
    Data: postData
  };

  await apigwManagementApi.postToConnection(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };

}

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const successfullResponse = {
  statusCode: 200,
  body: 'success'
};

export const connectionHandler = (event, context, callback) => {
  console.log(event);

  if (event.requestContext.eventType === 'CONNECT') {
    console.log('connected:', event.requestContext.connectionId);

    callback(null, successfullResponse);

  } else if (event.requestContext.eventType === 'DISCONNECT') {
    console.log('disconnected:', event.requestContext.connectionId);
    callback(null, successfullResponse);

  }
};

export const defaultHandler = (event, context, callback) => {
  console.log('defaultHandler was called');
  console.log(event.requestContext.connectionId);

  callback(null, {
    statusCode: 200,
    body: 'defaultHandler'
  });
};

export const sendMessageHandler = (event, context, callback) => {
  const params = {
    FunctionName: "websocket-dev-hello",
    InvocationType: "Event",
    Payload: JSON.stringify(event)
  };

  const lambda = new AWS.Lambda({
    region: 'us-east-1' //change to your region
  });

  lambda.invoke(params, (error, data)=>{
    console.log(error);
    callback(null, successfullResponse);
  })
  
};