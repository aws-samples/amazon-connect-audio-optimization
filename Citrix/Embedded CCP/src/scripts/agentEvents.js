// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import session from './session.js';
import {displayAgentStatus} from './index.js'
/**
 * Extends the agent events.
*/
export default function (agent) {
    // Show the CCP container once the agent is logged in
    console.log("CDEBUG >> agentEvents");
    
    session.agent = agent;
    const agentNameInput = agent.getName();
    const agentNameElement = document.getElementById('agentName');
    const agentNameTextNode = document.createTextNode(agentNameInput);
    agentNameElement.appendChild(agentNameTextNode);
    connect.getLog().info("Subscribing to events for agent " + agent.getName());
    connect.getLog().info("Agent is currently in status of " + agent.getStatus().name);
    displayAgentStatus(agent.getStatus().name);

    //session.agent = agent;
    agent.onRefresh(handleAgentRefresh);
    agent.onStateChange(handleAgentStateChange);
    agent.onRoutable(handleRoutable);
    agent.onNotRoutable(handleNotRoutable);
    agent.onOffline(handleAgentOffline);
    agent.onSoftphoneError(handleSoftphoneError);
    agent.onWebSocketConnectionLost(handleWebSocketConnectionLost);
    agent.onWebSocketConnectionGained(handleWebSocketConnectionGained);
    agent.onAfterCallWork(handleAfterCallWork);

    // Agent handlers
    function handleAgentRefresh(agent) {
        console.debug("CDEBUG >> handleAgentRefresh()");
        try {        
            connect.getLog().info("[agent.onRefresh] Agent data refreshed. Agent status is " + agent.getStatus().name);
            displayAgentStatus(agent.getStatus().name);
        } catch (error) {
            console.error("ERROR >> handleAgentRefresh: " + err);                
        }
    }

    function handleAgentStateChange(agent) {
        console.debug("CDEBUG >> handleAgentStateChange()");
    }

    function handleRoutable(agent) {
        console.debug("CDEBUG >> handleRoutable()");
        try {                    
            connect.getLog().info("[agent.onRoutable] Agent is routable. Agent status is " + agent.getStatus().name);
            displayAgentStatus(agent.getStatus().name);
        }
        catch(err){
            console.error("ERROR >> handleNotRoutable: " + err);
        }            
    }

    function handleNotRoutable(agent) {
        console.debug("CDEBUG >> handleNotRoutable()");
        try {                       
            connect.getLog().info("[agent.onNotRoutable] Agent is online, but not routable. Agent status is " + agent.getStatus().name);
            displayAgentStatus(agent.getStatus().name);
        }
        catch(err){
            console.error("ERROR >> handleNotRoutable: " + err);
        }        
    }

    function handleAgentOffline(agent) {
        console.debug("CDEBUG >> handleAgentOffline()");
        try {            
            connect.getLog().info("[agent.onOffline] Agent is offline. Agent status is " + agent.getStatus().name);
            displayAgentStatus(agent.getStatus().name);
        }
        catch(err){
            console.error("ERROR >> handleAgentOffline: " + err);
        }
    }

    function handleSoftphoneError(agent) {
        console.debug("CDEBUG >> handleSoftphoneError()");
    }

    function handleWebSocketConnectionLost(agent) {
        console.debug("CDEBUG >> handleWebSocketConnectionLost()");
    }

    function handleWebSocketConnectionGained(agent) {
        console.debug("CDEBUG >> handleWebSocketConnectionGained()");
    }

    function handleAfterCallWork(agent) {
        console.debug("CDEBUG >> handleAfterCallWork()");
    }
}