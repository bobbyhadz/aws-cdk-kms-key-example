// import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'my-kms-key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pendingWindow: cdk.Duration.days(7),
      alias: 'my-kms-key',
      description: 'KMS key for encrypting the objects in an S3 bucket',
      enableKeyRotation: false,
    });

    // key.addToResourcePolicy(
    //   new iam.PolicyStatement({
    //     actions: ['kms:Encrypt', 'kms:Decrypt'],
    //     principals: [new iam.AccountRootPrincipal()],
    //     resources: ['*'],
    //   }),
    // );

    const s3Bucket = new s3.Bucket(this, 'my-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
    });

    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
    });

    new cdk.CfnOutput(this, 'bucket-name', {
      value: s3Bucket.bucketName,
    });
  }
}
