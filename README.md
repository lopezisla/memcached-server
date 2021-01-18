# memcached-server
This is a javascript memcached server for a node.js enviroment. 

## Content
Supports two types of commands from the original implementation [http://memcached.org/](http://memcached.org/), storage and retrieval commands. You can also find a series of unit tests for each command.

## Installation
To install and run this project just type and execute:

    $ npm start

The server will be ready to listen for connections on port 11211. You can change it if you want.

This implementation accepts connections and commands from any Memcached client. You can also connect to the server using the telnet command from any CLI:

    $ telnet <ip-address> <port>

There is no need to send any command to end the session. A client may just close the connection at any moment it no longer needs it.

## Commands supported
A subset of Memcached commands, with all of their allowed options, are supported. Command names are
lower-case and are case-sensitive.

Storage commands ask the server to store some data identified by a key. The client sends a command line, and then a data block; after that the client expects one line of response, which will indicate
success or failure.

- set 
- add
- replace
- append
- prepend
- cas

Retrieval commands ask the server to retrieve data corresponding to a set of keys (one or more keys in one request). The client sends a command line, which includes all the requested keys; after that for each item the server finds it sends to the client one response line with information about the item, and one data block with the item's data; this continues until the server finished with the "END" response line.

- get
- gets

### Storage commands
First, the client sends a command line which looks like this:

    <command name> <key> <flags> <exptime> <bytes> [noreply]\r\n

cas command needs an extra parameter:

    cas <key> <flags> <exptime> <bytes> <cas unique> [noreply]\r\n

- `<command name>` is "set", "add", "replace", "append" or "prepend"

- `set` means "store this data".

- `add` means "store this data, but only if the server *doesn't* already
hold data for this key".

- `replace` means "store this data, but only if the server *does* already hold data for this key".

- `append` means "add this data to an existing key after existing data".

- `prepend` means "add this data to an existing key before existing data".

The append and prepend commands do not accept flags or exptime. They update existing data portions, and ignore new flag and exptime settings.

- `cas` is a check and set operation which means "store this data but only if no one else has updated since I last fetched it."

- `<key>` is the key under which the client asks to store the data

- `<flags>` is an arbitrary 16-bit unsigned integer (written out indecimal) that the server stores along with the data and sends back when the item is retrieved. Clients may use this as a bit field to store data-specific information; this field is opaque to the server.

- `<exptime>` is expiration time in seconds. If it's 0, the item never expires. If it's non-zero, it is guaranteed that clients will not be able to retrieve this item after the expiration time arrives. If a negative value is given the item is immediately expired.

- `<bytes>` is the number of bytes in the data block to follow, *not* including the delimiting \r\n. this param may be zero (in which case it's followed by an empty data block).

- `<cas unique>` is a unique integer value of an existing entry. Clients should use the value returned from the "gets" command when issuing "cas" updates.

- `noreply` optional parameter instructs the server to not send the reply. NOTE: if the request line is malformed, the server can't parse "noreply" option reliably. In this case it will send the error to the client. Client should construct only valid requests.

After this line, the client sends the data block:

    <data block>\r\n

- `<data block>` is a chunk of arbitrary 8-bit data of length bytes from the previous line.

After sending the command line and the data block the client awaits the reply, which may be:

- `STORED\r\n` to indicate success.

- `NOT_STORED\r\n` to indicate the data was not stored, but not because of an error. This normally means that the condition for an "add" or a "replace" command wasn't met.

- `EXISTS\r\n` to indicate that the item you are trying to store with a "cas" command has been modified since you last fetched it.

- `NOT_FOUND\r\n` to indicate that the item you are trying to store with a "cas" command did not exist.

#### Storage commands samples
set command with an a key, flag 1, 0 seconds of exptime, 6 bytes and foobar data block value:
    set a 1 0 6\r\n
    foobar\r\n
add command with a b key, flag 1, 20 seconds of exptime, 3 bytes and foo data block value:
    add b 1 20 3\r\n
    foo\r\n
replace command with an a key, flag 1, 0 seconds of exptime, 3 bytes and bar data block value:
    replace a 1 0 3\r\n
    bar\r\n
append command with an a key, flag 1, 0 seconds of exptime, 3 bytes and baz data block value:
    append a 1 0 3\r\n
    baz\r\n
prepend command with an a key, flag 1, 0 seconds of exptime, 3 bytes and qux data block value:
    prepend a 1 0 3\r\n
    qux\r\n
cas command with an a key, flag 1, 0 seconds of exptime, 4 bytes, 4 cas unique and baz data block value:
    cas a 1 0 4 4 noreply\r\n
    quux\r\n

### Retrieval commands
The retrieval commands "get" and "gets" operate like this:

    get <key>*\r\n

    gets <key>*\r\n

- `<key>*` means one or more key strings separated by whitespace.

After this command, the client expects zero or more items, each of which is received as a text line followed by a data block. After all the items have been transmitted, the server sends the string.

- `END\r\n` to indicate the end of response.

Each item sent by the server looks like this:

    VALUE <key> <flags> <bytes> [<cas unique>]\r\n
    <data block>\r\n

- `<key>` is the key for the item being sent.

- `<flags>` is the flags value set by the storage command.

- `<bytes>` is the length of the data block to follow, *not* including its delimiting \r\n .

- `<cas unique>` is a unique 64-bit integer that uniquely identifies this specific item.

- `<data block>` is the data for this item.

If some of the keys appearing in a retrieval request are not sent back by the server in the item list this means that the server does not hold items with such keys.

#### Retrieval commands samples
get command with an a key:
    get a\r\n
get command with an a and b keys:
    get a b c\r\n
gets command with an a key:
    gets a\r\n
gets command with an a and b keys:
    gets a b\r\n
    
## Unit tests
Use the following command to run the unit tests:

    $ npm run test

## References
- Memcached original implementation: [http://memcached.org/](http://memcached.org/)
- Protocol: [protocol.txt](https://github.com/memcached/memcached/blob/master/doc/protocol.txt)


