import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Archive() {
    const [docDetails, setDocDetails] = useState();

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

    return (
        <>
            <Row className="border border-top-0 border-left-0 border-right-0 text-lg-center mt-3">
                <Col lg={8}>
                    <dt>Document Name</dt>
                </Col>
                <Col lg={2}>
                    <dt>Owner</dt>
                </Col>
                <Col lg={2}>
                    <dt>Status</dt>
                </Col>
            </Row>

            {docDetails?.map((doc) => {
                if (doc.data.status == "completed") {
                    return (
                        <Row key={doc.id} className="d-flex align-items-center border text-lg-center">
                            <Col lg={8} className="m-0 p-0">
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
                        </Row>
                    );
                }
            })}
        </>
    );
}
