
import path from 'path'
import koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import route from 'koa-route'
import render from './util/views'


var app = koa()

// Logger
app.use( logger() )


// Custom 404
app.use( function *( next ) {
    yield next

    if ( this.body || !this.idempotent ) {
        return
    }

    this.status = 404
    this.body = yield render( '404' )
})


// Serve the client
var clientpath = path.join( __dirname, '../node_modules/client/dist/' )
app.use( serve( clientpath ) )


// Export composable app
export default app
