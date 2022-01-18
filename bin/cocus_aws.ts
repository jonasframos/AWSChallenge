#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CocusAwsStack } from '../lib/cocus_aws-stack';

const app = new cdk.App();
new CocusAwsStack(app, 'CocusAwsStack', {});