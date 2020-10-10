import React, { useState, useEffect } from 'react';import {
    makeStyles
} from '@material-ui/core';
var Axios = require('axios');
const querystring = require('querystring');

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    forgeviewer: {
        width: '80vw',
        height: '50vh',
        margin: 0,
        backgroundColor: "#F0F8FF",
        position: 'relative'
    }
}));

const ModelViewer = () => {
    const classes = useStyles();
    const [viewerContainer, setViewerContainer] = React.useState()
    const [Autodesk] = React.useState(window.Autodesk)

    var options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2', // TODO: for models uploaded to EMEA change this option to 'derivativeV2_EU'
        getAccessToken: getForgeToken
    };
    var documentId = 'urn:' + process.env.REACT_APP_FORGE_URN;//+ getUrlParameter('urn');

    var viewer;

    useEffect(() => {
    
        // Run this when the page is loaded
        Autodesk.Viewing.Initializer(options, function onInitialized(){
            Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
        });
    });

    function getForgeToken(callback) {
        Axios({
            method: 'POST',
            url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: querystring.stringify({
                client_id: process.env.REACT_APP_FORGE_CLIENT_ID,
                client_secret: process.env.REACT_APP_FORGE_CLIENT_SECRET,
                grant_type: 'client_credentials',
                scope: 'viewables:read'
            })
        })
        .then(function (response) {
            // Success
            console.log(response);
            callback(response.data.access_token, response.data.expires_in);
        })
        .catch(function (error) {
            // Failed
            console.log(error);
        });
    }

    // Get Query string from URL,
    // we will use this to get the value of 'urn' from URL
    function getUrlParameter(name) {
        // name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        // var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        // var results = regex.exec(location.search);
        // return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    /**
    * Autodesk.Viewing.Document.load() success callback.
    * Proceeds with model initialization.
    */
    function onDocumentLoadSuccess(doc) {
        // A document contains references to 3D and 2D viewables.
        var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry'}, true);
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }

        // Choose any of the avialble viewables
        var initialViewable = viewables[0];
        var svfUrl = doc.getViewablePath(initialViewable);
        var modelOptions = {
            sharedPropertyDbPath: doc.getPropertyDbPath()
        };

        viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer);
        viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
    }

    /**
     * Autodesk.Viewing.Document.load() failuire callback.
     */
    function onDocumentLoadFailure(viewerErrorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    /**
     * viewer.loadModel() success callback.
     * Invoked after the model's SVF has been initially loaded.
     * It may trigger before any geometry has been downloaded and displayed on-screen.
     */
    function onLoadModelSuccess(model) {
        console.log('onLoadModelSuccess()!');
        console.log('Validate model loaded: ' + (viewer.model === model));
        console.log(model);
    }

    /**
     * viewer.loadModel() failure callback.
     * Invoked when there's an error fetching the SVF file.
     */
    function onLoadModelError(viewerErrorCode) {
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
    }

    return(
        <div className={classes.forgeviewer}>
            <div
                ref={(div) => {
                    setViewerContainer(div);
                }}
            />
        </div>
    );
};

export default ModelViewer;