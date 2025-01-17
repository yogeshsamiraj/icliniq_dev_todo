import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb+srv://dev_user:odnnua0iCvJIpc6z@cluster0.5oypu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
