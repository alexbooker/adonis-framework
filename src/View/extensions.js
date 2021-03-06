'use strict'

/**
 * adonis-framework
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const co = require('co')
const Ioc = require('adonis-fold').Ioc

function ViewsYield () {
  this.tags = ['yield']

  /**
   * @description nunjucks standard parser it looks for yield
   * tag and returns everything inside it.
   * @method parse
   * @param  {Object} parser
   * @param  {Function} nodes
   * @param  {Object} lexer
   * @return {Object}
   * @public
   */
  this.parse = function (parser, nodes) {
    var tok = parser.nextToken()
    var args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(tok.value)
    return new nodes.CallExtensionAsync(this, 'run', args)
  }

  /**
   * @description nunjucks run function, it will run this Function
   * everytime it finds an execution block with yield tag
   * @method run
   * @param  {Object}   context
   * @param  {Object}   injections
   * @param  {Function} callback
   * @return {void}
   * @public
   */
  this.run = function (context, injections, callback) {
    var keys = Object.keys(injections)
    var index = keys[0]
    var method = injections[index]

    co(function *() {
      return yield method
    })
    .then(function (response) {
      context.ctx[index] = response
      callback()
    })
    .catch(function (error) {
      callback(error)
    })
  }
}

exports = module.exports = function (env) {
  env.addExtension('yield', new ViewsYield())
  env.addGlobal('make', Ioc.make)
  env.addGlobal('use', Ioc.use)
}
