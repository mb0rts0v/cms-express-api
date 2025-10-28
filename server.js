require( "dotenv" ).config();
const express = require( "express" );
const { connectDB } = require("./config/database"); 
const cors = require( "cors" );
const PORT = process.env.PORT || 3000;
const app = express();
const models = require('./models'); 
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
const categoryRoutes = require('./routes/category');
const contentItemRoutes = require('./routes/contentItem');
app.use('/api/categories', categoryRoutes);
app.use('/api/items', contentItemRoutes);
app.use( cors( { origin: `http://localhost:5173` } ) );
const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();

app.get( "/", ( request, response ) => response.send("API is running and connected to DB!") );