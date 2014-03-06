/*global require module */
var fs = require('fs')
var path    = require('path')
var rootdir = path.normalize(__dirname)
var default_config_file = rootdir+'/config.json'


var config_okay = function(f,cb){
    if(!cb && typeof f === 'function'){
        cb = f
        f=default_config_file
    }
    if(!f){
        f=default_config_file
    }
    if(! /\.js(on)?$/.test(f)){
        return cb('config_okay requires file to end in .json or .js')
    }
    fs.stat(f,function(err,stats){
        if(err) return cb(err)
        if(!stats) return cb('no stats')
        if(stats.mode.toString(8) != '100600'){
            return cb('mode of '+f+' must be 0600')
        }
        var config = require(f)
        return cb(null,config)
    })
    return null
}

module.exports=config_okay
