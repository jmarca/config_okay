/* global require console process it describe after before __dirname */

var config_okay = require('../.')

var should = require('should')
var fs     = require('fs')

var path    = require('path')
var rootdir = path.normalize(__dirname)

var good_file = rootdir+'/test.good.config.json'
var bad_file  = rootdir+'/test.bad.config.json'

before(function(done){
    // create a config file
    var good_config = {'foo':'bar'
                      ,'baz':'bat'
                      ,'another':2
                      }

    var bad_config = {'foo':'barf'
                     ,'baz':'batch'
                     ,'another':false
                     }

    fs.writeFile(good_file
                ,JSON.stringify(good_config)
                ,{'encoding':'utf8'
                 ,'mode':'0600'
                 }
                ,function(err){
                     if(err) throw err

                     fs.writeFile(bad_file
                                 ,JSON.stringify(bad_config)
                                 ,{'encoding':'utf8'
                                  ,'mode':'0700'
                                  }
                                 ,function(err){
                                      if(err) throw err
                                      return done()
                                  })
                     return null
                 })
    return null
})

after(function(done){
    if( !fs.unlinkSync(good_file) && !fs.unlinkSync(bad_file) )
        return done()
    console.log('error unlinking?')
    return null
})

describe('config_okay',function(){
    it('should error out on a file in without mode 0600'
      ,function(done){
           config_okay(bad_file,function(e,c){
               should.exist(e)
               should.not.exist(c)
               e.should.match(/^mode of.*must be 0600$/)
               return done()
           })
       })
    it('should parse okay a file in with mode 0600'
      ,function(done){
           config_okay(good_file,function(err,c){
               should.not.exist(err)
               should.exist(c)
               c.should.have.keys('foo','baz','another')
               c.foo.should.eql('bar')
               c.baz.should.eql('bat')
               c.another.should.eql(2)
               return done()
           })

       })
})
