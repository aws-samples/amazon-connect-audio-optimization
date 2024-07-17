// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/* eslint-disable no-undef */
import subscribeToContactEvents from './contactEvents.js';
import subscribeToAgentEvents from './agentEvents.js';

// CCP initialization and Core events
export default function (ccpContainerId, softphoneManagerParams) {

    console.debug(`CDEBUG >> CCP initialization() - ccpContainerId: ${ccpContainerId} softphoneManagerParams: ${JSON.stringify(softphoneManagerParams)}`);
    
    // Connect information: Replace with your Connect Instance
    const connectCCPUrl = "<YOURCONNECTCCPURL>"; // ex. https://`instance_alias`.my.connect.aws/ccp-v2/
    const connectRegion = "<YOURCONNECTREGION>"; // ex. us-east-1 | us-west-2 | eu-central-1 | eu-west-2

    //----------------Init CCP Start ----------------------------
    try {
        connect.core.initCCP(
            document.getElementById(ccpContainerId), {
            ccpUrl: connectCCPUrl, 	                // REQUIRED
            loginPopup: true,				        // optional - defaults to `true`
            loginPopupAutoClose: true,		        // optional - defaults to `false`
            region: connectRegion,                  // REQUIRED for `CHAT`, otherwise optional
            softphone: {                            // optional - defaults below apply if not provided
                allowFramedSoftphone: false         // optional - defaults to false
            },
            pageOptions: {                          // optional
                enableAudioDeviceSettings: false,   // optional - defaults to 'false'
                enablePhoneTypeSettings: false      // optional - defaults to 'true'
            }
        });
        connect.getLog().log("CDEBUG >> CCP initialized");
    } catch (err) {
        console.error('initCCP - Error: ' + err);
    }
    //----------------Init CCP Finished ----------------------------

    //----------------Init Softphone Manager Started ----------------------------
    // Check for SoftphoneManager initialization parameters
    try {    
        if (softphoneManagerParams) {                        
            // Initialize the Softphone Manager
            connect.core.initSoftphoneManager(softphoneManagerParams);    
        }    
    } catch (error) {
        console.error('initSoftphoneManager - Error: ' + error);            
    }    
    //----------------Init Softphone Manager Finished ---------------------------

    // Subscribe to Contact events
    connect.contact(subscribeToContactEvents);
    // Subscribe to Agent events
    connect.agent(subscribeToAgentEvents);    

    // Subscribe to event when agent clicks on another contact
    // Event includes ContactID of contact selected
    connect.core.onViewContact(
        function (event) {
            console.debug("CDEBUG >> onViewContact() - Now Viewing contact ID: '" + event.contactId + "'");
        }
    );

    // Send information to the Connect Logger
    connect.getLog().info("CDEBUG >> CCP initialized and subscribed to events");
}