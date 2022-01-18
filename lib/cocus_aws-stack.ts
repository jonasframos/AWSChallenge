import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as api from 'aws-cdk-lib/aws-apigateway';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class CocusAwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /*----------------
    -    DynamoDB    -
    -----------------*/
    const dynamoTable = new dynamodb.Table(this, "triangleClassificationHistory", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      }
    })

    /*----------------
    -     Lambda     -
    -----------------*/
    const classifyTriangle = new lambda.Function(this, 'ClassifyTriangle', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('src/lambda/classifyTriangle'),
      handler: 'main/src/app.lambdaHandler',
      environment: {
        dynamodbTableName: dynamoTable.tableName
      },
      timeout: Duration.minutes(1)
    });

    const getClassificationHistory = new lambda.Function(this, 'GetClassificationHistory', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('src/lambda/getClassificationHistory'),
      handler: 'main/src/app.lambdaHandler',
      environment: {
        dynamodbTableName: dynamoTable.tableName
      },
      timeout: Duration.minutes(1)
    });

    /*----------------
    -   CloudWatch   -
    -----------------*/
    //classifyTriangle errors and invocation alarms
    const classifyTriangleErrors = classifyTriangle.metricErrors({ period: Duration.minutes(1) });
    const classifyTriangleInvocation = classifyTriangle.metricInvocations({ period: Duration.minutes(1) });

    new cloudwatch.Alarm(this, 'classifyTriangleAlarm', {
      metric: classifyTriangleErrors,
      threshold: 1,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the the sum of classifyTriangleAlarm lambda errors is greater than or equal to the threshold for 1 evaluation period',
    });

    classifyTriangleInvocation.createAlarm(this, 'classifyTriangleAlarmInvocationAlarm', {
      threshold: 100,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the sum of classifyTriangleAlarm lambda invocations is greater than or equal to the threshold for 1 evaluation period',
    });

    //getClassificationHistory errors and invocation alarms
    const getClassificationHistoryErrors = getClassificationHistory.metricErrors({ period: Duration.minutes(1) });
    const getClassificationHistoryInvocation = getClassificationHistory.metricInvocations({ period: Duration.minutes(1) });

    new cloudwatch.Alarm(this, 'getClassificationHistoryAlarm', {
      metric: getClassificationHistoryErrors,
      threshold: 1,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the the sum of the getClassificationHistory lambda errors is greater than or equal to the threshold for 1 evaluation period',
    });

    getClassificationHistoryInvocation.createAlarm(this, 'getClassificationHistoryAlarmInvocationAlarm', {
      threshold: 100,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the sum of the getClassificationHistory lambda invocations is greater than or equal to the threshold for 1 evaluation period',
    });

    /*-------------------
    -  IAM Permissions  -
    --------------------*/
    dynamoTable.grantWriteData(classifyTriangle)
    dynamoTable.grantReadData(getClassificationHistory)

    /*----------------
    -  API Gateway   -
    -----------------*/
    const triangleClassificationAPI = new api.RestApi(this, 'TriangleClassificationAPI', {
      description: 'Triangle classification API Gateway',
      deployOptions: {
        stageName: 'development',
      }
    });

    //Adding methods and relating to the lambdas
    const triangleAPIResource = triangleClassificationAPI.root.addResource('triangle');
    const post = triangleAPIResource.addMethod('POST', new api.LambdaIntegration(classifyTriangle, { proxy: true }));
    const get = triangleAPIResource.addMethod('GET', new api.LambdaIntegration(getClassificationHistory, { proxy: true }));

    //Enablilng throttling limits
    const throttlingPost: api.ThrottlingPerMethod = {
      method: post,
      throttle: {
        burstLimit: 50,
        rateLimit: 50,
      },
    };

    const throttlingGet: api.ThrottlingPerMethod = {
      method: get,
      throttle: {
        burstLimit: 100,
        rateLimit: 100,
      },
    };
  }
}
