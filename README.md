# Amazon Connect audio optimization

## Background
Integrating Amazon Connect, an [omnichannel](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-glossary.html#omnichannel-def) cloud contact center solution from AWS, with virtualization technology poses unique challenges, particularly in audio quality during customer interactions. This project addresses these challenges, enabling seamless and high-quality audio communication utilizing [Amazon Connect - Connect RTC JS](https://github.com/aws/connect-rtc-js) and [Amazon Connect - Streams API](https://github.com/amazon-connect/amazon-connect-streams) to enhance audio quality for contact centers agents using VDI services. 

## What is in the library?
This library is divided into vendor specific deployments relative to [Amazon Connect audio optimization](https://docs.aws.amazon.com/connect/latest/adminguide/using-ccp-vdi.html).
Each subfolder has a `README.md` which provides details about the sample code, how to configure the sample code, how to deploy the sample code and other relevant information.

### Citrix
Within the Citrix folder are examples for both an Embedded CCP and Custom CCP that utilizes [Amazon Connect audio optimization for Citrix](https://docs.aws.amazon.com/connect/latest/adminguide/using-ccp-vdi-citrix-step-by-step.html)

## Where can I find more documentation?
To learn more about using Amazon Connect in a VDI environment check out the [official documentation](https://docs.aws.amazon.com/connect/latest/adminguide/using-ccp-vdi.html).

## License
Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0