const SET = "set";
const ADD = "add";
const REPLACE = "replace";
const APPEND = "append";
const PREPREND = "prepend";
const CAS = "cas";
const GET = "get";
const GETS = "gets";
const ALL_COMMANDS = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const RETRIEVAL_COMMANDS = [GET, GETS];

module.exports = {
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPREND,
  CAS,
  GET,
  GETS,
  ALL_COMMANDS,
  RETRIEVAL_COMMANDS
};
