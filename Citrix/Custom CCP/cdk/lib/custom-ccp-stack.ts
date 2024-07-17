// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from 'aws-cdk-lib'
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import {PolicyStatement, CanonicalUserPrincipal} from 'aws-cdk-lib/aws-iam';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { NagSuppressions } from 'cdk-nag';

/**
 * CustomCCP site infrastructure, which deploys site content to an S3 bucket.
 */
export class CustomCCPStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create new Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `OAI for Amazon Connect Audio Optimization for Citrix - Custom CCP`
    });

    // S3 bucket for storing the website's files
    const siteBucket = new s3.Bucket(this, 'CustomCCPStackBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true, // NOT recommended for production code
      enforceSSL: true,
      cors: [{
        allowedMethods: [s3.HttpMethods.GET],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      }],
      versioned: true      
    });

    NagSuppressions.addResourceSuppressions(siteBucket, [
      {
        id: 'AwsSolutions-S1',
        reason: 'Sample code - For production have server access logging enabled to provide detailed records for the requests that are made to the bucket.',
      }
    ]);    

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(siteBucket, { originAccessIdentity: originAccessIdentity }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }    
    })

    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: 'AwsSolutions-CFR1',
        reason: 'Sample code - Not restricting Geo.',
      },
      {
        id: 'AwsSolutions-CFR2',
        reason: 'Sample code - Not restricting IP.',
      },
      {
        id: 'AwsSolutions-CFR3',
        reason: 'Sample code - Not enabling access logging.',
      },
      {
        id: 'AwsSolutions-CFR4',
        reason: 'Sample code - Not enforcing TLS1.2 as minimum.',
      }
    ]);  

    // Output CloudFront URL
    new cdk.CfnOutput(this, 'Custom CCP URL', {
      value: 'https://' + distribution.distributionDomainName
    });

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('../src')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    NagSuppressions.addResourceSuppressionsByPath(this,
      '/CustomCCPStack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/Resource',
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Sample code - AWS managed policy might not be restrictive enough.',
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Sample code - Service role created by BucketDeployment might have broader than necessary permissions.',
        },
      ], 
      true);

      NagSuppressions.addResourceSuppressionsByPath(this,
        '/CustomCCPStack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/Resource',
      [
        {
          id: 'AwsSolutions-L1',
          reason: 'Sample code - The Lambda function managed by CDK for BucketDeployment.',
        },
      ],
      true);    

  }
}