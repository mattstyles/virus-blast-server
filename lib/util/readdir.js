
import path from 'path'
import fs from 'fs'


export class File {
    constructor( filepath ) {
        this.path = filepath

        return new Promise( ( resolve, reject ) => {
            fs.stat( filepath, ( err, stats ) => {
                if ( err ) {
                    console.log( 'error statting filepath', filepath )
                    return reject( err )
                }

                this.isDirectory = stats.isDirectory()
                this.size = stats.size

                resolve( this )
            })
        })
    }
}


export default function readdir( dirpath ) {

    return new Promise( ( resolve, reject ) => {

        fs.readdir( path.resolve( dirpath ), ( err, files ) => {
            if ( err ) {
                console.log( 'error reading directory' )
                return reject( err )
            }

            // Create new file objects
            Promise.all( files
                .map( file => path.resolve( dirpath, file ) )
                .map( filepath => new File( filepath ) ) )
                .then( resolve )
                .catch( reject )
        })
    })
}
