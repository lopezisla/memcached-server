const SET = "set";
const ADD = "add";
const REPLACE = "replace";
const APPEND = "append";
const PREPEND = "prepend";
const CAS = "cas";
const GET = "get";
const GETS = "gets";
const ALL_COMMANDS = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPEND, CAS];
const STORAGE_COMMANDS = [SET, ADD, REPLACE, APPEND, PREPEND,CAS];
const RETRIEVAL_COMMANDS = [GET, GETS];

module.exports = {
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPEND,
  CAS,
  GET,
  GETS,
  ALL_COMMANDS,
  STORAGE_COMMANDS,
  RETRIEVAL_COMMANDS
};
