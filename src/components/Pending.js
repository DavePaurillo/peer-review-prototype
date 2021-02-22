import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

export default function Pending() {
    const [docDetails, setDocDetails] = useState();
    const { currentUser } = useAuth();

    useEffect(() => {
        db.collection("documents").onSnapshot((snapshot) =>
            setDocDetails(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
    }, []);

    function showNotification(message) {
        console.log("notif");
        if (Notification.permission === "granted") {
            console.log("granted, show message");
            notify(message);
        } else if (Notification.permission !== "denied") {
            console.log("not granted");
            Notification.requestPermission((permission) => {
                console.log("request");
                if (permission === "granted") {
                    console.log("request granted");
                    notify(message);
                }
            });
        }
    }

    function notify(message) {
        let notif = new Notification("New message incoming", {
            body: message,
            // icon: "yourimageurl.png",
        });
    }

    function updateDocument(collectionId, status) {
        db.collection("documents").doc(collectionId).update({
            status: status,
        });
    }

    function handleClick(action, doc) {
        switch (action) {
            case "comments addressed":
                updateDocument(doc.id, "for review");
                // add notification here
                showNotification("comments addressed");
                break;

            case "mark as done":
                updateDocument(doc.id, "completed");
                // add notification here
                showNotification("mark as done");
                break;

            case "added comments":
                updateDocument(doc.id, "added comments");
                // add notification here
                showNotification("added comments");
                break;

            case "approve draft":
                updateDocument(doc.id, "approved");
                // add notification here
                showNotification("approve draft");
                break;
        }
    }

    function setActionButtons(doc) {
        if (currentUser.email == doc.data.owner) {
            return (
                <div className="d-flex justify-content-center" style={{ gap: ".5rem" }}>
                    <Button
                        onClick={() => handleClick("comments addressed", doc)}
                        variant="outline-secondary"
                        title="comments addressed"
                    >
                        <FontAwesomeIcon icon="comments" />
                    </Button>
                    <Button
                        onClick={() => handleClick("mark as done", doc)}
                        variant="outline-secondary"
                        title="mark as done"
                    >
                        <FontAwesomeIcon icon="check-square" />
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="d-flex justify-content-center" style={{ gap: ".5rem" }}>
                    <Button
                        onClick={() => handleClick("added comments", doc)}
                        variant="outline-secondary"
                        title="added comments"
                    >
                        <FontAwesomeIcon icon="comments" />
                    </Button>
                    <Button
                        onClick={() => handleClick("approve draft", doc)}
                        variant="outline-secondary"
                        title="approve draft"
                    >
                        <FontAwesomeIcon icon="check-square" />
                    </Button>
                </div>
            );
        }
    }

    return (
        <>
            <Row className="border border-top-0 border-left-0 border-right-0 text-lg-center mt-3">
                <Col lg={6}>
                    <dt>Document Name</dt>
                </Col>
                <Col lg={2}>
                    <dt>Owner</dt>
                </Col>
                <Col lg={2}>
                    <dt>Status</dt>
                </Col>
                <Col lg={2}>
                    <dt>Action</dt>
                </Col>
            </Row>

            {docDetails?.map((doc) => {
                if (
                    doc.data.status == "for review" ||
                    doc.data.status == "approved" ||
                    doc.data.status == "added comments"
                ) {
                    return (
                        <Row key={doc.id} className="d-flex align-items-center border text-lg-center">
                            <Col lg={6} className="m-0 p-0">
                                <a
                                    href={doc.data.documentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-flex align-items-center justify-content-center border rounded mt-1 mb-1 ml-1 p-1"
                                >
                                    <FontAwesomeIcon icon="file-alt" className="mr-1" />
                                    <p className="m-0">{doc.data.documentTitle}</p>
                                </a>
                            </Col>
                            <Col lg={2}>{doc.data.owner}</Col>
                            <Col lg={2}>{doc.data.status}</Col>
                            <Col lg={2}>{setActionButtons(doc)}</Col>
                        </Row>
                    );
                }
            })}
        </>
    );
}
