/// <reference types="cypress" />

describe("Signup & Login", () => {

    let randomstring = Math.random().toString(36).substring(2);
    let testUsername = "Auto" + randomstring;
    let testEmail = "Auto_email" + randomstring + "@gmail.com";
    let password = "Password1";

    beforeEach(() => {

        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign up").click();
        cy.get('[placeholder="Username"]').type(testUsername);
        cy.get('[placeholder="Email"]').type(testEmail);
        cy.get('[placeholder="Password"]').type(password);
        cy.get(".btn").contains("Sign up").click();
    })

    it("Test valid sign up", () => {
        cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");
        cy.wait("@newUser").then(({ request, response }) => {
            cy.log("Request: " + JSON.stringify(request));
            cy.log("Response: " + JSON.stringify(response));
            expect(response.statusCode).to.eq(201);
            expect(request.body.user.username).to.eq(testUsername);
            expect(request.body.user.email).to.eq(testEmail);
        })
    })
    it("Test valid log in & mock popular tags", () => {
        cy.intercept("GET", "**/tags", { fixture: 'popularTags.json' });
        cy.get(".nav").contains("Sign in").click();
        cy.get('[placeholder="Email"]').type(testEmail);
        cy.get('[placeholder="Password"]').type(password);
        cy.get(".btn").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').contains(testUsername);
        cy.get('.tag-list').should("contain", "JavaScript").and("contain", "cypress");
    })
    it("Test valid log in & mock popular tags on Global Feed", () => {
        cy.intercept("GET", "**/api/articles*", { fixture: 'testArticles.json' }).as("articles");
        cy.get(".nav").contains("Sign in").click();
        cy.get('[placeholder="Email"]').type(testEmail);
        cy.get('[placeholder="Password"]').type(password);
        cy.get(".btn").contains("Sign in").click();
        cy.get('.nav-link').contains("Global Feed").click();
        cy.wait("@articles");
        // cy.get('.nav-link').contains("New Article").click();
        // cy.get('[placeholder="Article Title"]').type('Test1');
        // cy.get('input[placeholder*="article about"]').type('It is about nothing');
        // cy.get('textarea[placeholder*="Write your"]').type('Some large text...');
        // cy.get('[placeholder="Enter tags"]').type('test npm');
        // cy.get(".btn").contains("Publish Article").click();
    })

})