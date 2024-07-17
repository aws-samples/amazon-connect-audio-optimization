// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/* eslint-disable no-undef */
import initializeCCP from './initCCP.js';

// Set div container id for CCP initialization
const ccpContainerId = 'container-div'

// Default softphone manager parameters with allowFramedSoftphone flag and VDI platform
let softphoneManagerParams = {
    allowFramedSoftphone: true,
    VDIPlatform: "CITRIX"
}

// Add the call to init() as an onload so it will only run once the page is loaded
window.onload = () => {
    try {                
        // Check VDI connection status
        checkVdiClientStatus();       
    } catch (error) {
        console.error('CCP initialization error', error);
    }
};

// Check endpoint connection status
function checkVdiClientStatus() {
    // Get the VDI connection status message element
    let message = document.getElementById('vdiClientStatus');    
    // Default VDI connection status message to connecting
    var statusMessage = "VDI client connecting ...";        
    // Set allowFallback to enable fallback to non-redirected audio    
    let allowFallback = true;
    // isTimerExpired is used to flag if we have received a callback from UCSDK
    let isTimerExpired = false;
    // Set a timer to check if we have received a callback from UCSDK
    let timer = setTimeout(() => {
        console.log("index - checkVdiClientStatus - Timeout");
        // Set isTimerExpired to true to prevent further processing
        isTimerExpired = true;
        // Clear existing VDI connection status message
        message.innerHTML = '';
        // Update VDI connection status message to Disconnected            
        statusMessage = "VDI client disconnected. Disconnect reason: Failed to get a response from Citrix UC SDK";
        // Check to enable fallback to non-redirected audio
        if(allowFallback) {            
            // Initialize softphone manager with allowFramedSoftphone flag only by removing VDIPlatform
            delete softphoneManagerParams.VDIPlatform;
            // Append status message with fallback to non-redirected audio enabled
            statusMessage = statusMessage + " - Fallback to non-redirected audio enabled";
        }   
        message.style.color = "#FF0000";        
        const vdiClientDisconnectedSDKStatusTextNode = document.createTextNode(statusMessage);
        message.appendChild(vdiClientDisconnectedSDKStatusTextNode);   
        // Initialize CCP
        initializeCCP(ccpContainerId, softphoneManagerParams);         
    }, 5000)

    // Create a new Citrix strategy to load the UCSDK
    new connect.CitrixVDIStrategy();
    // Check if window.CitrixWebRTC and its setVMEventCallback method exist before calling it
    if (window.CitrixWebRTC && typeof window.CitrixWebRTC.setVMEventCallback === 'function') {
        // Check if window.CitrixWebRTC and its setVMEventCallback method exist before calling it
        window.CitrixWebRTC.setVMEventCallback((event) => {
            console.log("index - checkVdiClientStatus - setVMeventCallback: " + JSON.stringify(event));        
            // Check if eventType is vdiConnected or vdiDisconnected to prevent further processing
            if (event['event'] === 'vdiClientConnected' || event['event'] === 'vdiClientDisconnected') {                        
                // Check if eventType is vdiConnected and isTimerExpired is false to prevent further processing
                if (event['event'] === 'vdiClientConnected' && !isTimerExpired) {                                                             
                    console.log("index - checkVdiClientStatus - vdiClientConnected");            
                    // If VDI client is connected, stop the timer
                    clearTimeout(timer);            
                    // Applications should register any Webrtc audio elements with SDK in order to properly support redirected audio play.
                    var remoteAudioElement = document.getElementById('remote-audio');
                    window.CitrixWebRTC.mapAudioElement(remoteAudioElement);
                    // Enumerate media devices on local machine
                    enumerateDevices();
                    // Clear existing VDI connection status message
                    message.innerHTML = '';
                    // Update VDI connection status message to Connected            
                    statusMessage = "VDI client connected."
                    message.style.color = "#008000";                    
                    const vdiClientConnectedStatusTextNode = document.createTextNode(statusMessage);
                    message.appendChild(vdiClientConnectedStatusTextNode);
                    // Set isTimerExpired to true to prevent further processing
                    isTimerExpired = true;
                // Check if eventType is vdiDisconnected and isTimerExpired is false to prevent further processing
                } else if (event['event'] === 'vdiClientDisconnected' && !isTimerExpired) {
                    console.log("index - checkVdiClientStatus - vdiClientDisconnected");
                    // If VDI client is disconnected, stop the timer
                    clearTimeout(timer);
                    // Clear existing VDI connection status message
                    message.innerHTML = '';
                    // Update VDI connection status message to Disconnected            
                    statusMessage = "VDI client disconnected. Disconnect reason: " + event['reason'];
                    // Check to enable fallback to non-redirected audio
                    if(allowFallback) {
                        // Initialize softphone manager with allowFramedSoftphone flag only by removing VDIPlatform
                        delete softphoneManagerParams.VDIPlatform;
                        // Append status message with fallback to non-redirected audio enabled
                        statusMessage = statusMessage + " - Fallback to non-redirected audio enabled";
                    }   
                    message.style.color = "#FF0000";                    
                    const vdiClientDisconnectedStatusTextNode = document.createTextNode(statusMessage);
                    message.appendChild(vdiClientDisconnectedStatusTextNode);
                    // Set isTimerExpired to true to prevent further processing
                    isTimerExpired = true;
                }                
                // Initialize CCP
                initializeCCP(ccpContainerId, softphoneManagerParams);                
            }
            else {
                // If eventType is not vdiConnected or vdiDisconnected, ignore the event
                console.log("index - vmEventCallback - Event not type Connected or Disconnected - Ignoring");
            }        
        });
    } else {
        // If window.CitrixWebRTC is not available
        console.log('index - checkVdiClientStatus - window.CitrixWebRTC.setVMEventCallback is not available.');
    } 
}

// Enumerate media devices on local machine
function enumerateDevices() {
    // Get audio input and output elements
    var audioInput = document.getElementById("audioInput");
    var audioOutput = document.getElementById("audioOutput");
    // Check if window.CitrixWebRTC and its enumerateDevices method exist before calling it
    if (!window.CitrixWebRTC || !window.CitrixWebRTC.enumerateDevices) {
        console.log('index - enumerateDevices() not supported');
        return;
    }
    // Call enumerateDevices method to get list of available devices
    window.CitrixWebRTC.enumerateDevices()
        .then( function (deviceInfos) { 
        console.log('index - enumerateDevices() success');
        audioInput.innerHTML = '';
        audioOutput.innerHTML = '';
        // Add devices to the select elements
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            var option = document.createElement('option');
            option.value = deviceInfo.deviceId;            
            const textNode = document.createTextNode(deviceInfo.label);
            option.appendChild(textNode);                
            if( deviceInfo.kind === 'audioinput') { 
                audioInput.add(option);                
            } else if( deviceInfo.kind === 'audiooutput') { 
                audioOutput.add(option);
            }
        }
        setAudioDevicesToDefaultValues();   
    }).catch(function (err) {
        console.log('enumerateDevices() failure with error: ', err); 
    });
}

// Check to see if device has changed 
navigator.mediaDevices.addEventListener('devicechange', () => {      
    console.info('devicechange() notification received');    
    // Update available client endpoint devices
    enumerateDevices();
});

// Set microphone device
function setMicrophone() {
    // Get microphone device id
    var microphoneDeviceId = document.getElementById("audioInput").value;
    // Set audio input device id to global variable consumed in Connect RTC
    window.audio_input = microphoneDeviceId;
    console.log("CDEBUG >> setMicrophoneDevice with " + microphoneDeviceId);
}

// Set speaker device
function setSpeaker() {
    var speakerDeviceId = document.getElementById("audioOutput").value;
    console.info(`CDEBUG >> Speaker device id: ${speakerDeviceId}`);    
    var remoteAudioElement = document.getElementById('remote-audio');
    if (remoteAudioElement && typeof remoteAudioElement.setSinkId === 'function') { 
        console.info(`CDEBUG >> Trying to set speaker to device ${speakerDeviceId}`);        
        // Specifies which audio output device on the client endpoint to use for playing customer audio
        remoteAudioElement.setSinkId(speakerDeviceId);
    }
    connect.core.getUpstream().sendUpstream(connect.EventType.BROADCAST, {
        event: connect.ConfigurationEvents.SPEAKER_DEVICE_CHANGED,
        data: { deviceId: speakerDeviceId }
    });
    console.log("CDEBUG >> setSpeakerDevice with " + speakerDeviceId);
}

// Event listeners for the  Webpage
document.getElementById ('audioInput').addEventListener("change", setMicrophone, false);
document.getElementById ('audioOutput').addEventListener("change", setSpeaker, false);

const setAudioDevicesToDefaultValues = async () => {
    setAudioDeviceListToDefault("audioInput");
    setAudioDeviceListToDefault("audioOutput");
}

// Set the selected option containing "Default"
function setAudioDeviceListToDefault(selectId) {    
    // Get the select element by its ID
    var selectElement = document.getElementById(selectId);    
    // Find the index of the option that contains 'default'
    const defaultIndex = Array.from(selectElement.options).findIndex(
        option => option.text.toLowerCase().includes('default')
    );
    // Set the selected index if 'default' was found
    if (defaultIndex !== -1) {
        selectElement.selectedIndex = defaultIndex;
    }
}    

export function displayAgentStatus(status) {
    const agentStatusInput = status;
    const agentStatusElement = document.getElementById('agentStatus');
    agentStatusElement.innerHTML = '';
    const agentStatusTextNode = document.createTextNode(agentStatusInput);
    agentStatusElement.appendChild(agentStatusTextNode);
}