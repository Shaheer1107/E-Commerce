import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        // ✅ Lifecycle event handlers registered BEFORE connecting
        //    so they fire even on the first connection attempt
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected')
        })

        mongoose.connection.on('error', (err) => {
            // ✅ Logs DB errors that happen AFTER initial connection
            //    e.g. if MongoDB Atlas goes down mid-session
            console.error('MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            // ✅ Important to know in production — logs when DB drops
            console.warn('MongoDB disconnected')
        })

        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)

    } catch (error) {
        // ✅ If the initial connection fails, log clearly and exit
        //    Without this, the server starts silently with NO database
        //    Every request would then crash with an obscure mongoose error
        //    process.exit(1) signals to Render/Railway that the service failed
        //    — they will restart it automatically
        console.error('MongoDB initial connection failed:', error.message)
        process.exit(1)
    }
}

export default connectDB