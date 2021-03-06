/*global require module */
const fs = require('fs')
const path    = require('path')
const rootdir = path.normalize(__dirname)
const default_config_file = rootdir+'/config.json'

// promise wraps fs.readFile
function statfile(f) {
    return new Promise( (resolve,reject) => {
        fs.stat(f,(e,s)=>{
            if(e){
                //console.log('got an error',e)
                reject(e)
            }
            resolve(s)
            return null
        });
    });
}

function config_okay(f) {
    return new Promise( (resolve,reject) => {
        let stats;
        if(!f){
            f=default_config_file
        }
        if(! /\.js(on)?$/.test(f)){
            return reject ('config_okay requires file to end in .json or .js')
        }
        statfile(f)
            .then( stats => {
                // if(!stats){
                //     return reject ('no stats')
                // }
                // I can't see how that might happen
                // if stat fails, it rejects.  if it succeeds, it will
                // return a stats object
                if(stats.mode.toString(8) !== '100600'){
                    return reject ('mode of '+f+' must be 0600')
                }
                const config = require(f)
                return resolve(config)
            })
            .catch (e => {
                //console.log('caught error',e)
                reject (e)
            })
        return null
    })
}

module.exports=config_okay
