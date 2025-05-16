import dotenv from "dotenv";
import { app } from "./app";

// Configure environment variables
dotenv.config({
    path: "./.env"
});

// Improved error handling for server startup
const startServer = async () => {
    try {
        const port = process.env.PORT || 8000;
        
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
        
        // Add basic error handlers
        app.use((err: any, req: any, res: any, next: any) => {
            console.error("Application error:", err);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? err.message : {}
            });
        });
        
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Add global uncaught exception handler
process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(error.name, error.message);
    console.error(error.stack);
    process.exit(1);
});

// Add unhandled rejection handler
process.on("unhandledRejection", (error: any) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(error.name, error.message);
    console.error(error.stack);
    process.exit(1);
});

// Start the server
startServer();