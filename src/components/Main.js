import React from "react";
import Archive from "./Archive";
import Pending from "./Pending";
import { Tabs, Tab, Container } from "react-bootstrap";

export default function Main() {
    return (
        <Tabs defaultActiveKey="pending" id="uncontrolled-tab-example">
            <Tab eventKey="pending" title="Pending">
                <Container>
                    <Pending />
                </Container>
            </Tab>
            <Tab eventKey="archive" title="Archive">
                <Container>
                    <Archive />
                </Container>
            </Tab>
        </Tabs>
    );
}
