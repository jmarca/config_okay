/* global require console process it describe after before __dirname */

const config_okay = require('../.')

const fs     = require('fs')
const denodeify = require('denodeify')
const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);
const statFile = denodeify(fs.stat);

const tap = require('tap')

const path    = require('path')
const rootdir = path.normalize(__dirname)

const good_file = rootdir+'/test.good.config.json'
const bad_file  = rootdir+'/test.bad.config.json'

const good_config = {'foo':'bar'
                     ,'baz':'bat'
                     ,'another':2
                    };

const bad_config = {'foo':'barf'
                    ,'baz':'batch'
                    ,'another':false
                   };


tap.plan(5)

tap.test('bad file settings',function (t) {

    return writeFile(bad_file,JSON.stringify(bad_config)
                     , {'enconding':'utf8'
                        ,'mode':'0700'})
        .then( () => {
            return  config_okay(bad_file)
                .then ( result => {
                    t.fail( 'did not reject bad file')
                    t.end()
                })
                .catch ( err => {
                    t.match(err,/^mode of.*must be 0600$/,'complaint looks good')
                    t.pass('did not process file with wrong chmod')
                    t.end()
                })
        })
        .then( () => {
            return fs.unlinkSync(bad_file)
        })
        .catch(console.log.bind(console))
})

tap.test('skip .txt files', function (t) {

    return config_okay('file.txt')
        .then ( result => {
            t.fail( 'did not reject .txt file')
            return null
        })
        .catch( err => {
            t.match(err,/^config_okay requires file to end in/,'complaint looks good')
            t.pass('did not process .txt file')
            t.end()
            return null
        })

})

tap.test('croak if a file is not there', function (t) {

    return config_okay('file.json')
        .then ( result => {
            t.fail( 'did not reject .txt file')
            return null
        })
        .catch( err => {
            // console.log('caught error in test as expected',err)
            t.match(err,/ENOENT: no such file or directory/,'complaint looks good')
            t.pass('did not process a file that does not exist')
            t.end()
            return null
        })

})

tap.test('default to config.json if no file specified', function (t) {
    return writeFile('config.json',JSON.stringify(good_config)
                     , {'enconding':'utf8'
                        ,'mode':'0600'})
        .then( () => {
            return config_okay()
                .then( result => {
                    t.ok(result)
                    t.same(result, good_config, 'read back what was put in to config file')
                    t.end()
                    return null
                })
                .catch( e =>{
                    t.fail('did not process valid json file')
                    t.end()
                    return null
                })
        })
        .then( () => {
            return fs.unlinkSync('config.json')
        })
        .catch(console.log.bind(console))

})



tap.test('read valid json file', function (t) {
    return writeFile(good_file,JSON.stringify(good_config)
                     , {'enconding':'utf8'
                        ,'mode':'0600'})
        .then( () => {
            return config_okay(good_file)
                .then( result => {
                    t.ok(result)
                    t.same(result, good_config, 'read back what was put in to config file')
                    t.end()
                    return null
                })
                .catch( e =>{
                    t.fail('did not process valid json file')
                    t.end()
                    return null
                })
        })
        .then( () => {
            return fs.unlinkSync(good_file)
        })
        .catch(console.log.bind(console))

})

tap.end()
