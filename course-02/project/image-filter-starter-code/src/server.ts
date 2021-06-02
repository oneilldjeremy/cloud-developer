import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validURL} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Takes a URL from parameter image_url in query
  // Applies a filter to image and returns it to client
  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    let url = req.query.image_url;

    if ( !url ) {
      return res.status(400)
                .send(`An image URL is required`);
    }

    if (!validURL(url)) {
      return res.status(400).send('URL is not in the correct format' );
    }

    const filteredpath = await filterImageFromURL(url);

    res.status(200).sendFile(filteredpath, () => {deleteLocalFiles([filteredpath])});

  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();