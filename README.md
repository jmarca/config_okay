# config okay

This became a module because I used it more than once.

It is really simple.  All it does is parse a config file.  Borrowing
from postgresql, it refuses to do anything if the config file isn't
chmod 0600.  I don't even know what that means in the Windows or Mac
world, so patches welcome.  Essentially, if a file is not set such
that only the owner can read and write it, then it isn't a good idea
to store passwords in it.

So, if you have a config file of any sort, and it is set to be chmod
0600, then you can use this file.

What is does is check the permissions of the file, then it requires it
and returns the results of the require statement.

According to the node.js docs, require will pull in either a
javascript file, or a JSON file.


# Installation

npm install config_okay

# Example

``` javascript

var config_okay = require('config_okay')
var configfile = 'config.json' // or pull from the command line or something

config_okay(configfile,function(err,config){
     if(err){
        throw new Error('node.js needs a good croak module')
     }
     do_something(config)
})
```

Personally, I sometimes stick this in something like an
async.waterfall as the first function in the sequence, so that if it
fails, the whole cascade will abort.
