/**
 * Website.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// var moment = require('moment');


module.exports = {

  attributes: {
    url:{type:'String',required:true,unique:true},
    title:{type:'String'},
    description:{type:'String'},
    body:{type:'String'},
    keywords:[{type:'String'}],
    text:{type:'String'}
    // createdAt: { type: 'datetime', defaultsTo: moment.utc().format() },
  },
  connection:'mainDB'
};

