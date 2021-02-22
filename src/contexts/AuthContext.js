import React, { useState, useContext, useEffect } from "react";
import { gapi } from "gapi-script";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        gapi.load("client:auth2", initClient);

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Array of API discovery doc URLs for APIs
    const DISCOVERY_DOCS = ["https://docs.googleapis.com/$discovery/rest?version=v1"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = "https://www.googleapis.com/auth/documents";

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = () => {
        gapi.client
            .init({
                apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                },
                function (error) {
                    console.log(error);
                }
            );
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            // Set the signed in user
            // console.log('ID: ' + profile.getId());
            // console.log('Full Name: ' + profile.getName());
            // console.log('Given Name: ' + profile.getGivenName());
            // console.log('Family Name: ' + profile.getFamilyName());
            // console.log('Image URL: ' + profile.getImageUrl());
            // console.log('Email: ' + profile.getEmail());
            let profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            setCurrentUser({
                id: profile.getId(),
                email: profile.getEmail(),
                imgUrl: profile.getImageUrl(),
            });
            // list files if user is authenticated
            // printDocTitle();
        } else {
            // prompt user to sign in
            handleAuthClick();
        }
    };

    /**
     * Prints the title of a sample doc:
     * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
     */
    const printDocTitle = (id) => {
        return gapi.client.docs.documents
            .get({
                documentId: id,
            })
            .then(
                function (response) {
                    let doc = response.result;
                    return doc.title;
                },
                function (response) {
                    return response.result.error.message;
                }
            );
    };

    /**
     *  Sign in the user upon button click.
     */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
    };

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = (event) => {
        gapi.auth2.getAuthInstance().signOut();
    };

    const value = {
        currentUser,
        printDocTitle,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
