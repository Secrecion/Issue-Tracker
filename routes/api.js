"use strict";
const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      ProjectModel.findOne({ name: project }, (err, projectData) => {
        if (err || !projectData) {
          res.json({ error: "Project not found" });
          return;
        }
       IssueModel.find({
        projectId:projectData._id,
        ...req.query,
       }, (err, issueData)=>{
        if (err || !issueData) {
          res.json({ error: "Project not found" });
          return
          ;
        }
        res.json(issueData);
        return;
       });
      });
    })

    .post((req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      ProjectModel.findOne({ name: project }, (err, projectData) => {
        if (err) {
          res.send("there was an error retrieving that project");
          return;
        }
        if (!projectData) {
          const newProject = new ProjectModel({ name: project });
          newProject.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
              return;
            } else {
              const newIssue = new IssueModel({
                projectId: data._id,
                issue_title: issue_title || "",
                issue_text: issue_text || "",
                created_on: new Date(),
                updated_on: new Date(),
                created_by: created_by || "",
                assigned_to: assigned_to || "",
                open: true,
                status_text: status_text || "",
              });
              newIssue.save((err, data) => {
                if (err || !data) {
                  res.send("There was an error saving in post");
                  return;
                } else {
                  res.json(data);
                  return;
                }
              });
            }
          });
        } else {
          const newIssue = new IssueModel({
            projectId: projectData._id,
            issue_title: issue_title || "",
            issue_text: issue_text || "",
            created_on: new Date(),
            updated_on: new Date(),
            created_by: created_by || "",
            assigned_to: assigned_to || "",
            open: true,
            status_text: status_text || "",
          });
          newIssue.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
              return;
            } else {
              res.json(data);
              return;
            }
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } =
        req.body;
        if(!_id){
          return res.send({ error: "missing _id" });
        }
        if(
          !issue_title &&
          !issue_text &&
          !created_by &&
          !assigned_to &&
          !status_text &&
          !open
        ){
          return res.send({ error: 'no update field(s) sent', '_id': _id });
        }
        ProjectModel.findOne({ name: project }, (err, projectData) => {
          if (err || !projectData) {
            return res.send({ error: 'could not update', '_id': _id });
          }
          IssueModel.findByIdAndUpdate(_id,{
            ...req.body,
            updated_on:new Date(),
          }, (err, issueData)=>{
            if( err || !issueData ){
              return res.send({ error: 'could not update', '_id': _id });
            }
           return res.json({  result: 'successfully updated', '_id': _id });
          })
        })
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id }=req.body;
      if(!_id){
        return res.json({ error: 'missing _id' });
      }
      ProjectModel.findOne({ name: project }, (err, projectData) => {
        if (err || !projectData) {
          return res.send({ error: 'could not delete', '_id': _id });
        }
        IssueModel.findByIdAndDelete(_id, (err, issueData)=>{
          if( err || !issueData ){
            return res.json({ error: 'could not delete', '_id': _id });
          }
         return res.json({ result: 'successfully deleted', '_id': _id });
        })
      });
    });
    
};
