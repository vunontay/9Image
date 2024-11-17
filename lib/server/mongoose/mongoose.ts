import mongoose from "mongoose";

const mongooseConnect = async () => {
    try {
        // Kiểm tra xem kết nối đã được thiết lập chưa
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        // Kết nối tới MongoDB URI
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Mongoose connected");
        return conn;
    } catch (error) {
        console.error("Mongoose connection error:", error);
        throw error; // Ném lỗi để xử lý ở cấp cao hơn
    }
};

export default mongooseConnect;
