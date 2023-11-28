const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
let issue1;
let issue2;

suite('Functional Tests', function() {
    suite("Routing tests", function(){
        suite("3 Post request Tests", function(){
            test("Create an issue with every field: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post("/api/issues/testing123")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue 1",
                    issue_text: "functional Test",
                    created_by:"fCC",
                    assigned_to:"Dom",
                    status_text:"Not Done",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    issue1=res.body._id;
                    assert.equal(res.body.issue_title, "Issue 1");
                    assert.equal(res.body.issue_text, "functional Test");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.status_text, "Not Done");
                    done();
                }).timeout(5000);
            });
            test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post("/api/issues/testing123")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue 1",
                    issue_text: "functional Test",
                    created_by:"fCC",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "Issue 1");
                    assert.equal(res.body.issue_text, "functional Test");
                    assert.equal(res.body.created_by, "fCC");
                    done();
                }).timeout(5000);
            });
            test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post("/api/issues/testing123")
                .set("content-type", "application/json")
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by:"fCC",
                    assigned_to:"",
                    status_text:"Not Done",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                }).timeout(5000);
            })
        })
        suite("3 GET request Tests", function(){
            test("View issues on a project: GET request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .get("/api/issues/testing123")
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    done();
                }).timeout(5000);
            });
            test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .get("/api/issues/testing123")
                .query({
                    issue_title: "Issue 1"
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title,"Issue 1");
                    done();
                }).timeout(5000);
            });
            test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .get("/api/issues/testing123")
                .query({
                    issue_title: "Issue 1",
                    issue_text: "functional Test",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title,"Issue 1");
                    assert.equal(res.body[0].issue_text,"functional Test");
                    done();
                }).timeout(5000);
            });
        });

        suite("5 PUT request tests", function(){
            test("Update one field on an issue: PUT request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .put("/api/issues/testing123")
                .send({
                    _id:"65644111992d082694be1e47",
                    issue_text: "diferent Test",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body._id,"65644111992d082694be1e47");
                    assert.equal(res.body.result,"successfully updated");
                    done();
                }).timeout(5000);
            });
            test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .put("/api/issues/testing123")
                .send({
                    _id:"65644111992d082694be1e47",
                    issue_text: "diferent Test",
                    assigned_to:"Pepelepues",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body._id,"65644111992d082694be1e47");
                    assert.equal(res.body.result,"successfully updated");
                    done();
                }).timeout(5000);
            });
            test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .put("/api/issues/testing123")
                .send({
                    issue_text: "diferent Test",
                    assigned_to:"Pepelepues",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error,"missing _id");
                    done();
                }).timeout(5000);
            });
            test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .put("/api/issues/testing123")
                .send({
                    _id:"65644111992d082694be1e47",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error,"no update field(s) sent");
                    done();
                }).timeout(5000);
            });
            test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .put("/api/issues/testing123")
                .send({
                    _id:"65644111752d082694be1e47",
                    issue_text: "diferent Test",
                    assigned_to:"Pepelepues",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error,"could not update");
                    done();
                }).timeout(5000);
            });
        });
        suite("3 DELETE request tests", function(){
            test("Delete an issue: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/testing123")
                .send({
                    _id: issue1,
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result,"successfully deleted");
                    done();
                }).timeout(5000);
            });
            test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/testing123")
                .send({
                    _id: "4654651321365423",
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error,"could not delete");
                    done();
                }).timeout(5000);
            });
            test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/testing123")
                .send({
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error,"missing _id");
                    done();
                });
            });
        });
    });
  
});
