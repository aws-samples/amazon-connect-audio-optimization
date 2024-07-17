// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/* eslint-disable no-undef */
import session from './session.js';

/**
 * Extends the contact events.
*/
export default function (contact) {
    console.debug("CDEBUG >> ContactEvents - New Contact contactId: " + contact.contactId);
    console.debug("CDEBUG >> ContactEvents - New Contact InitialContactId(): " + contact.getInitialContactId());
    session.contact = contact;
    connect.getLog().info("Subscribing to events for contact");
    if (contact.getActiveInitialConnection()
        && contact.getActiveInitialConnection().getEndpoint()) {
        connect.getLog().info("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
    } else {
        connect.getLog().info("This is an existing contact for this agent");
    }
    connect.getLog().info("Contact is from queue " + contact.getQueue().name);
    connect.getLog().info("Contact attributes are " + JSON.stringify(contact.getAttributes()));

    // Route to the respective handler
    contact.onIncoming(handleContactIncoming);
    contact.onAccepted(handleContactAccepted);
    contact.onConnecting(handleContactConnecting);
    contact.onConnected(handleContactConnected);
    contact.onEnded(handleContactEnded);
    contact.onDestroy(handleContactDestroyed);

    function handleContactIncoming(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactIncoming');
        connect.getLog().info("[contact.onIncoming] Contact is incoming");
        if (contact) {
            connect.getLog().info("[contact.onIncoming] Contact is incoming. Contact state is " + contact.getStatus().type);
        } else {
            connect.getLog().info("[contact.onIncoming] Contact is incoming. Null contact passed to event handler");
        }
    }

    function handleContactAccepted(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactAccepted - Contact accepted by agent');
        if (contact) {
            connect.getLog().info("[contact.onAccepted] Contact accepted by agent. Contact state is " + contact.getStatus().type);
        } else {
            connect.getLog().info("[contact.onAccepted] Contact accepted by agent. Null contact passed to event handler");
        }
    }

    function handleContactConnecting(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactConnecting() - Contact connecting to agent' + JSON.stringify(contact));
        connect.getLog().info("[contact.onConnecting] Contact is connecting");
        console.log("CDEBUG >> handle contact connecting - contact: " + JSON.stringify(session.contact));
        if (contact && session.contact.isInbound()) {
            connect.getLog().info("[contact.onConnecting] Contact is connecting. Contact state is " + contact.getStatus().type);
            document.getElementById ('answerDiv').classList.add("glowingButton");
        } else {
            connect.getLog().info("[contact.onConnecting] Contact is connecting. Null contact passed to event handler");
        }
    }

    function handleContactConnected(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactConnected() - Contact connected to agent');
        if (contact) {
            connect.getLog().info("[contact.onConnected] Contact connected to agent. Contact state is " + contact.getStatus().type);
            document.getElementById ('answerDiv').classList.remove("glowingButton");
            document.getElementById ('hangupDiv').classList.add("glowingButton");
        } else {
            connect.getLog().info("[contact.onConnected] Contact connected to agent. Null contact passed to event handler");
        }
    }

    function handleContactEnded(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactEnded() - Contact has ended successfully');
        if (contact) {
            connect.getLog().info("[contact.onEnded] Contact has ended. Contact state is " + contact.getStatus().type);
            document.getElementById ('hangupDiv').classList.remove("glowingButton");
            document.getElementById ('clearDiv').classList.add("glowingButton");
        } else {
            connect.getLog().info("[contact.onEnded] Contact has ended. Null contact passed to event handler");
        }
    }

    function handleContactDestroyed(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactDestroyed() - Contact will be destroyed');
        connect.getLog().info("[contact.onDestroy] Contact is Destroyed");
        if (contact) {
            connect.getLog().info("[contact.onDestroy] Contact is destroyed. Contact state is " + contact.getStatus().type);
            document.getElementById ('clearDiv').classList.remove("glowingButton");
        } else {
            connect.getLog().info("[contact.onDestroy] Contact is connecting. Null contact passed to event handler");
        }
    }
}