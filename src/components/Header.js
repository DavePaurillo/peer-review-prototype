import React from "react";
import { Row, Col, Button, InputGroup, FormControl } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function Header() {
    const { currentUser, printDocTitle } = useAuth();

    async function handleClick(e) {
        let documentLink = document.getElementById("document-link").value;
        let documentId = documentLink.match(/[-\w]{25,}/)[0];
        let documentTitle = await printDocTitle(documentId);
        let status = "for review";
        let owner = currentUser.email;

        db.collection("documents").add({
            approvers: [],
            commenters: [],
            documentId,
            documentLink,
            documentTitle,
            owner,
            status,
        });
    }

    return (
        <header>
            <Row className="d-flex align-items-center justify-content-between pb-lg-5 pt-lg-5">
                <Col lg={3}>
                    <h4>Peer Review Tool</h4>
                </Col>
                <Col lg={6}>
                    <section className="d-flex align-items-center" style={{ gap: "1rem" }}>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Document</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                id="document-link"
                            />
                        </InputGroup>
                        <Button
                            onClick={() => handleClick()}
                            className="btn-sm"
                            variant="primary"
                            style={{ minWidth: "8.2rem" }}
                        >
                            Send for review
                        </Button>
                    </section>
                </Col>
                <Col lg={2}>
                    <ul className="d-flex list-unstyled align-items-center justify-content-sm-between mb-0">
                        <li>
                            <a href="#">PED</a>
                        </li>
                        <li>
                            <a href="#">TSE</a>
                        </li>
                        <li>
                            <a href="#">PACE</a>
                        </li>
                    </ul>
                </Col>
                <Col lg={1}>
                    <img
                        src={currentUser.imgUrl}
                        alt=""
                        style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
                    />
                </Col>
            </Row>
        </header>
    );
}
