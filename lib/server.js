
import path from 'path'

import koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import route from 'koa-route'

import render from './util/views'
import readdir from './util/readdir'

import parse from 'co-body'


var app = koa()

// Logger
app.use( logger() )


// Custom 404
var notfound = function *( next ) {
    yield next

    if ( this.body || !this.idempotent ) {
        return
    }

    this.status = 404
    this.body = yield render( '404' )
}
app.use( notfound )


// POST /files gets files from the specified path
app.use( route.post( '/files', function *( next ) {
    let body = yield parse( this )
    try {
        var files = yield readdir( body.path )
    } catch( err ) {
        console.error( err )
        this.status = 500
        return
    }

    console.log( 'file path:', body.path )

    this.status = 200
    this.body = {
        cwd: path.resolve( body.path ),
        files: files
    }
}))


// Serve the client
var clientpath = path.join( __dirname, '../node_modules/client/dist/' )
app.use( serve( clientpath ) )


// Export composable app
export default app
